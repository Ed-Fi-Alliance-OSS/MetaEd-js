// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from '@edfi/metaed-core';
import writeXlsxFile from 'write-excel-file';
import type { NamespaceEdfiApiSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/Namespace';
import type { ResourceSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/api-schema/ResourceSchema';
import type { SchemaObject } from '@edfi/metaed-plugin-edfi-api-schema/src/model/OpenApiTypes';
import {
  PropertyRow,
  ResourceRow,
  propertiesSchema,
  resourcesSchema,
  propertiesWorksheetName,
  resourcesWorksheetName,
} from '../model/ApiCatalogRow';

/**
 * Extended SchemaObject type that includes Ed-Fi custom properties
 */
type EdFiSchemaObject = SchemaObject & {
  'x-Ed-Fi-isIdentity'?: boolean;
  'x-nullable'?: boolean;
};

/**
 * Extracts property rows from a namespace's API schema data
 */
function extractPropertyRowsForNamespace(namespace: Namespace): PropertyRow[] {
  const rows: PropertyRow[] = [];

  const namespaceData = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
  if (namespaceData == null || namespaceData.apiSchema == null) {
    return rows;
  }

  const { projectSchema } = namespaceData.apiSchema;
  const projectEndpointName = projectSchema.projectEndpointName;
  const projectVersion = projectSchema.projectVersion;

  // Iterate over all resource schemas
  Object.entries(projectSchema.resourceSchemas).forEach(([resourceEndpoint, resourceSchema]: [string, ResourceSchema]) => {
    const resourceName = resourceEndpoint;

    // Find the OpenAPI fragment - prefer 'resources' type, fall back to 'descriptors'
    const openApiFragment = resourceSchema.openApiFragments.resources || resourceSchema.openApiFragments.descriptors;
    
    if (openApiFragment == null || openApiFragment.components == null || openApiFragment.components.schemas == null) {
      return;
    }

    // Iterate through all schemas in the fragment
    Object.values(openApiFragment.components.schemas).forEach((schema: SchemaObject) => {
      if (schema.properties == null) {
        return;
      }

      const requiredProperties = schema.required || [];

      // Iterate through all properties in the schema
      Object.entries(schema.properties).forEach(([propertyName, propertySchema]) => {
        // Skip the 'id' property as specified
        if (propertyName === 'id') {
          return;
        }

        let dataType: string;
        let description: string;
        let minLength: number | null = null;
        let maxLength: number | null = null;
        let validationRegEx: string | null = null;
        let isIdentityKey = false;
        let isNullable = false;

        // Handle reference objects
        if ('$ref' in propertySchema) {
          const reference = propertySchema as EdFiSchemaObject & { $ref: string };
          dataType = 'reference';
          description = reference.$ref;
          isIdentityKey = reference['x-Ed-Fi-isIdentity'] === true;
          isNullable = reference['x-nullable'] === true;
        } else {
          const property = propertySchema as EdFiSchemaObject;

          // Extract data type - use format if present, otherwise use type
          dataType = property.type || 'unknown';
          if (property.format != null) {
            dataType = property.format;
          }

          // Extract other properties
          description = property.description || '';
          minLength = property.minLength != null ? property.minLength : null;
          maxLength = property.maxLength != null ? property.maxLength : null;
          validationRegEx = property.pattern != null ? property.pattern : null;
          isIdentityKey = property['x-Ed-Fi-isIdentity'] === true;
          isNullable = property['x-nullable'] === true;
        }

        // Check if property is in the required array
        const isRequired = requiredProperties.includes(propertyName);

        rows.push({
          project: projectEndpointName,
          version: projectVersion,
          resourceName,
          propertyName,
          description,
          dataType,
          minLength,
          maxLength,
          validationRegEx,
          isIdentityKey,
          isNullable,
          isRequired,
        });
      });
    });
  });

  return rows;
}

/**
 * Extracts resource rows from a namespace's API schema data
 */
function extractResourceRowsForNamespace(namespace: Namespace): ResourceRow[] {
  const rows: ResourceRow[] = [];

  const namespaceData = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
  if (namespaceData == null || namespaceData.apiSchema == null) {
    return rows;
  }

  const { projectSchema } = namespaceData.apiSchema;
  const projectEndpointName = projectSchema.projectEndpointName;
  const projectVersion = projectSchema.projectVersion;

  // Iterate over all resource schemas
  Object.entries(projectSchema.resourceSchemas).forEach(([resourceEndpoint, resourceSchema]: [string, ResourceSchema]) => {
    const resourceName = resourceEndpoint;

    // Find the OpenAPI fragment - prefer 'resources' type, fall back to 'descriptors'
    const openApiFragment = resourceSchema.openApiFragments.resources || resourceSchema.openApiFragments.descriptors;
    
    if (openApiFragment == null || openApiFragment.components == null || openApiFragment.components.schemas == null) {
      return;
    }

    // Get the first schema to extract description
    const schemas = Object.values(openApiFragment.components.schemas);
    const firstSchema = schemas[0] as SchemaObject | undefined;
    const resourceDescription = firstSchema?.description || '';

    // Format domains as comma-separated list
    const domains = resourceSchema.domains.join(', ');

    rows.push({
      project: projectEndpointName,
      version: projectVersion,
      resourceName,
      resourceDescription,
      domains,
    });
  });

  return rows;
}

/**
 * Generates an Excel spreadsheet containing API catalog information
 */
export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const propertyRows: PropertyRow[] = [];
  const resourceRows: ResourceRow[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    propertyRows.push(...extractPropertyRowsForNamespace(namespace));
    resourceRows.push(...extractResourceRowsForNamespace(namespace));
  });

  // @ts-ignore - TypeScript typings here don't recognize Blob return type
  const fileAsBlob: Blob = await writeXlsxFile([resourceRows, propertyRows], {
    buffer: true,
    schema: [resourcesSchema, propertiesSchema],
    sheets: [resourcesWorksheetName, propertiesWorksheetName],
  });
  const fileAsArrayBuffer = await fileAsBlob.arrayBuffer();

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'Ed-Fi API Catalog Excel',
      namespace: 'Documentation',
      folderName: 'Ed-Fi-API-Catalog',
      fileName: 'Ed-Fi-API-Catalog.xlsx',
      resultString: '',
      resultStream: Buffer.from(fileAsArrayBuffer),
    },
  ];

  return {
    generatorName: 'edfiApiCatalog.ApiCatalogGenerator',
    generatedOutput,
  };
}
