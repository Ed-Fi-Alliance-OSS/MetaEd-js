// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import { ColumnMetadata } from '../../model/flattening/ColumnMetadata';
import { TableMetadata } from '../../model/flattening/TableMetadata';

/**
 * Check if a property is a polymorphic reference
 */
function isPolymorphicReference(property: any): boolean {
  // Check if the referenced entity is an abstract type
  // This is a simplified check - would need to look at the actual entity type
  const polymorphicTypes = ['EducationOrganization', 'GeneralStudentProgramAssociation', 'StudentProgramAssociation'];
  return polymorphicTypes.some((type) => property.referencedType?.includes(type));
}

/**
 * Get the polymorphic type for a reference
 */
function getPolymorphicType(property: any): string {
  // Extract the base polymorphic type
  if (property.referencedType?.includes('EducationOrganization')) {
    return 'EducationOrganization';
  }
  if (property.referencedType?.includes('GeneralStudentProgramAssociation')) {
    return 'GeneralStudentProgramAssociation';
  }
  if (property.referencedType?.includes('StudentProgramAssociation')) {
    return 'StudentProgramAssociation';
  }
  return '';
}

/**
 * Derive column name from reference path
 */
function deriveColumnNameFromReferencePath(key: string, referenceName: string): string {
  // Convert the key to a column name
  const keyParts = key.split('.');
  const lastPart = keyParts[keyParts.length - 1];
  return `${referenceName}${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)}`;
}

/**
 * Add natural key columns from a reference
 */
function addReferenceNaturalKeyColumns(
  table: TableMetadata,
  referenceProperty: any,
  apiSchemaData: EntityApiSchemaData,
): void {
  // Find the document paths for this reference
  const documentPaths = apiSchemaData.documentPathsMapping?.[referenceProperty.fullPropertyName];

  if (documentPaths && documentPaths.isReference && 'referenceJsonPaths' in documentPaths) {
    documentPaths.referenceJsonPaths.forEach((referenceJsonPath: any) => {
      // Add column for each natural key component of the reference
      const column: ColumnMetadata = {
        jsonPath: referenceJsonPath.referenceJsonPath.replace(table.jsonPath, ''),
        columnName: deriveColumnNameFromReferencePath(referenceJsonPath.identityJsonPath, referenceProperty.metaEdName),
        columnType: 'string', // Will be refined by SqlTypeMapperEnhancer
        isNaturalKey: true,
      };
      table.columns.push(column);
    });
  }
}

/**
 * Process reference properties in a table to add foreign key columns
 */
function processTableReferences(table: TableMetadata, apiSchemaData: EntityApiSchemaData, entity: any): void {
  // Process reference properties
  if (apiSchemaData.collectedApiProperties) {
    apiSchemaData.collectedApiProperties.forEach((collectedProperty) => {
      const { property } = collectedProperty;
      const propertyApiSchemaData = property.data.edfiApiSchema as EntityPropertyApiSchemaData | undefined;
      const apiMapping = propertyApiSchemaData?.apiMapping;

      if (!apiMapping) {
        return;
      }

      // Handle scalar references (foreign keys)
      if (apiMapping.isScalarReference) {
        // Add foreign key column for this reference
        const refColumn: ColumnMetadata = {
          columnName: `${property.metaEdName}Id`,
          columnType: 'bigint',
          fromReferencePath: property.fullPropertyName,
          isRequired: property.isRequired || false,
        };

        // Check if this is a polymorphic reference
        if (isPolymorphicReference(property)) {
          refColumn.isPolymorphicReference = true;
          refColumn.polymorphicType = getPolymorphicType(property);

          // Add discriminator column for polymorphic references
          const discriminatorColumn: ColumnMetadata = {
            columnName: `${property.metaEdName}Type`,
            columnType: 'string',
            maxLength: '255',
            isDiscriminator: true,
            isRequired: property.isRequired || false,
          };
          table.columns.push(discriminatorColumn);
        }

        table.columns.push(refColumn);

        // Also add natural key columns from the reference
        addReferenceNaturalKeyColumns(table, property, apiSchemaData);
      }

      // Handle descriptor references specially
      if (apiMapping.metaEdType === 'descriptor') {
        // Descriptors are typically inline with CodeValue and Namespace
        // These should be handled as regular columns, not foreign keys
        const codeValueColumn: ColumnMetadata = {
          jsonPath: `.${apiMapping.topLevelName}`,
          columnName: `${apiMapping.fullName || property.metaEdName}`,
          columnType: 'descriptor',
          isRequired: property.isRequired || false,
          maxLength: '306', // CodeValue (50) + '#' (1) + Namespace (255)
        };
        table.columns.push(codeValueColumn);
      }
    });
  }

  // Recursively process child tables
  table.childTables.forEach((childTable) => {
    processTableReferences(childTable, apiSchemaData, entity);
  });
}

/**
 * Identifies and resolves foreign key relationships in flattened tables.
 * Maps reference properties to foreign key columns with appropriate metadata.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'domainEntityExtension',
    'associationExtension',
  ).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    if (!apiSchemaData.flatteningMetadata) {
      return;
    }

    // Process references in the root table
    processTableReferences(apiSchemaData.flatteningMetadata.table, apiSchemaData, entity);
  });

  return {
    enhancerName: 'ReferenceResolverEnhancer',
    success: true,
  };
}
