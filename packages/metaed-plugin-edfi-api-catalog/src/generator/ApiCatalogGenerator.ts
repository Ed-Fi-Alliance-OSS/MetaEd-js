// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from '@edfi/metaed-core';
import writeXlsxFile from 'write-excel-file';
import type { NamespaceEdfiApiSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/Namespace';
import type { ResourceSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/api-schema/ResourceSchema';
import type { SchemaObject } from '@edfi/metaed-plugin-edfi-api-schema/src/model/OpenApiTypes';
import { ApiCatalogRow, apiCatalogSchema, apiCatalogWorksheetName } from '../model/ApiCatalogRow';

/**
 * Extracts API catalog rows from a namespace's API schema data
 */
function extractCatalogRowsForNamespace(namespace: Namespace): ApiCatalogRow[] {
  const rows: ApiCatalogRow[] = [];

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
    const isDescriptor = resourceSchema.isDescriptor;

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

        // Handle reference objects
        if ('$ref' in propertySchema) {
          return; // Skip references for now
        }

        const property = propertySchema as SchemaObject;

        // Extract data type - use format if present, otherwise use type
        let dataType = property.type || 'unknown';
        if (property.format != null) {
          dataType = property.format;
        }

        // Extract validation properties
        const minLength = property.minLength != null ? property.minLength : null;
        const maxLength = property.maxLength != null ? property.maxLength : null;
        const validationRegEx = property.pattern != null ? property.pattern : null;

        // Extract x-Ed-Fi-isIdentity
        const isIdentityKey = (property as SchemaObject & { 'x-Ed-Fi-isIdentity'?: boolean })['x-Ed-Fi-isIdentity'] === true;

        // Extract x-nullable
        const isNullable = (property as SchemaObject & { 'x-nullable'?: boolean })['x-nullable'] === true;

        // Check if property is in the required array
        const isRequired = requiredProperties.includes(propertyName);

        rows.push({
          project: projectEndpointName,
          version: projectVersion,
          resourceName,
          isDescriptor,
          propertyName,
          description: property.description || '',
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
 * Generates an Excel spreadsheet containing API catalog information
 */
export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const catalogRows: ApiCatalogRow[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    catalogRows.push(...extractCatalogRowsForNamespace(namespace));
  });

  // @ts-ignore - TypeScript typings here don't recognize Blob return type
  const fileAsBlob: Blob = await writeXlsxFile([catalogRows], {
    buffer: true,
    schema: [apiCatalogSchema],
    sheets: [apiCatalogWorksheetName],
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
