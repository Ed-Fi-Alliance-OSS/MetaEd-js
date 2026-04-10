// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from '@edfi/metaed-core';
import writeXlsxFile from 'write-excel-file';
import type { NamespaceEdfiApiSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/Namespace';
import type { ResourceSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/api-schema/ResourceSchema';
import type {
  SchemaObject,
  ArraySchemaObject,
  ReferenceObject,
} from '@edfi/metaed-plugin-edfi-api-schema/src/model/OpenApiTypes';
import { singularize } from '@edfi/metaed-plugin-edfi-api-schema/src/Utility';
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
 * Checks if a schema name refers to an internal sub-schema that should be recursed.
 * All three conditions must be true:
 * 1. Present as a key in allSchemas
 * 2. Does NOT end with _Reference, _Readable, or _Writable
 * 3. Is not the main schema itself
 */
function isInternalSubSchema(
  schemaName: string,
  allSchemas: Record<string, ReferenceObject | SchemaObject>,
  mainSchemaName: string,
): boolean {
  if (!(schemaName in allSchemas)) return false;
  if (schemaName === mainSchemaName) return false;
  if (schemaName.endsWith('_Reference') || schemaName.endsWith('_Readable') || schemaName.endsWith('_Writable')) {
    return false;
  }
  return true;
}

/**
 * Recursively processes schema properties, building dot-separated path prefixes
 * for properties within commons.
 *
 * @param schema The current schema being processed
 * @param prefix The dot-separated path prefix (empty string for root level)
 * @param allSchemas All schemas in components.schemas (lookup map)
 * @param mainSchemaName The main entity schema name (to avoid recursing into itself)
 * @param rows Array to accumulate PropertyRow objects
 * @param projectEndpointName Project name for the row
 * @param projectVersion Project version for the row
 * @param resourceName Resource name for the row
 */
function processSchemaProperties(
  schema: SchemaObject,
  prefix: string,
  allSchemas: Record<string, ReferenceObject | SchemaObject>,
  mainSchemaName: string,
  rows: PropertyRow[],
  projectEndpointName: string,
  projectVersion: string,
  resourceName: string,
): void {
  const requiredProperties = schema.required ?? [];

  Object.entries(schema.properties ?? {}).forEach(([propertyName, propertyDef]) => {
    // Skip the 'id' property
    if (propertyName === 'id') {
      return;
    }

    const qualifiedName = prefix ? `${prefix}.${propertyName}` : propertyName;

    // ── $ref branch (foreign-key reference OR scalar common) ──
    if ('$ref' in propertyDef) {
      const reference = propertyDef as EdFiSchemaObject & { $ref: string };
      const refSchemaName = reference.$ref.split('/').at(-1) ?? '';

      // Emit row for the $ref itself
      rows.push({
        project: projectEndpointName,
        version: projectVersion,
        resourceName,
        propertyName: qualifiedName,
        description: reference.$ref,
        dataType: 'reference',
        minLength: null,
        maxLength: null,
        validationRegEx: null,
        isIdentityKey: reference['x-Ed-Fi-isIdentity'] === true,
        isNullable: reference['x-nullable'] === true,
        isRequired: requiredProperties.includes(propertyName),
      });

      // If it's an internal sub-schema, recurse to expose its properties
      if (isInternalSubSchema(refSchemaName, allSchemas, mainSchemaName)) {
        const subPrefix = prefix ? `${prefix}.${propertyName}` : propertyName;
        const subSchema = allSchemas[refSchemaName] as SchemaObject;
        processSchemaProperties(
          subSchema,
          subPrefix,
          allSchemas,
          mainSchemaName,
          rows,
          projectEndpointName,
          projectVersion,
          resourceName,
        );
      }
    }
    // ── array branch (array with $ref items) ──
    else if (propertyDef.type === 'array' && propertyDef.items && '$ref' in propertyDef.items) {
      const arrayProperty = propertyDef as ArraySchemaObject;
      const itemsRef = arrayProperty.items as ReferenceObject;
      const refSchemaName = itemsRef.$ref.split('/').at(-1) ?? '';

      // Emit row for the array property itself
      rows.push({
        project: projectEndpointName,
        version: projectVersion,
        resourceName,
        propertyName: qualifiedName,
        description: itemsRef.$ref,
        dataType: 'array',
        minLength: null,
        maxLength: null,
        validationRegEx: null,
        isIdentityKey: false, // arrays are never identity keys
        isNullable: false, // arrays follow schema convention of not nullable
        isRequired: requiredProperties.includes(propertyName),
      });

      // If it's an internal sub-schema, recurse using singularized property name
      if (isInternalSubSchema(refSchemaName, allSchemas, mainSchemaName)) {
        const singularContext = singularize(propertyName);
        const subPrefix = prefix ? `${prefix}.${singularContext}` : singularContext;
        const subSchema = allSchemas[refSchemaName] as SchemaObject;
        processSchemaProperties(
          subSchema,
          subPrefix,
          allSchemas,
          mainSchemaName,
          rows,
          projectEndpointName,
          projectVersion,
          resourceName,
        );
      }
    }
    // ── scalar branch (direct scalar properties and scalar arrays) ──
    else {
      const property = propertyDef as EdFiSchemaObject;
      let dataType: string;
      let description: string = property.description || '';

      // Extract data type - use format if present, otherwise use type
      dataType = property.type || 'unknown';
      if (property.format != null) {
        dataType = property.format;
      }

      // For array types, use the items $ref as the description to indicate the array item type
      // This provides information about what schema type the array contains
      if (property.type === 'array') {
        const arrayProperty = property as ArraySchemaObject;
        if ('$ref' in arrayProperty.items) {
          const itemsRef = arrayProperty.items as ReferenceObject;
          description = itemsRef.$ref;
        }
      }

      rows.push({
        project: projectEndpointName,
        version: projectVersion,
        resourceName,
        propertyName: qualifiedName,
        description,
        dataType,
        minLength: property.minLength ?? null,
        maxLength: property.maxLength ?? null,
        validationRegEx: property.pattern ?? null,
        isIdentityKey: property['x-Ed-Fi-isIdentity'] === true,
        isNullable: property['x-nullable'] === true,
        isRequired: requiredProperties.includes(propertyName),
      });
    }
  });
}

/**
 * Extracts property rows from a namespace's API schema data
 */
export function extractPropertyRowsForNamespace(namespace: Namespace): PropertyRow[] {
  const rows: PropertyRow[] = [];

  const namespaceData = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
  if (namespaceData == null || namespaceData.apiSchema == null) {
    return rows;
  }

  const { projectSchema } = namespaceData.apiSchema;
  const { projectEndpointName } = projectSchema;
  const { projectVersion } = projectSchema;

  Object.entries(projectSchema.resourceSchemas).forEach(([resourceEndpoint, resourceSchema]: [string, ResourceSchema]) => {
    const resourceName = resourceEndpoint;

    const openApiFragment = resourceSchema.openApiFragments.resources || resourceSchema.openApiFragments.descriptors;

    if (openApiFragment == null || openApiFragment.components == null || openApiFragment.components.schemas == null) {
      return;
    }

    const { schemas } = openApiFragment.components;

    // Step 1: Identify main schema
    const schemaEntries = Object.entries(schemas);
    const mainSchemaEntry = schemaEntries.find(([schemaName, schema]) => {
      const hasCommonSuffix =
        schemaName.endsWith('_Reference') || schemaName.endsWith('_Readable') || schemaName.endsWith('_Writable');
      return !hasCommonSuffix && (schema as SchemaObject).properties != null;
    });

    if (mainSchemaEntry == null) {
      return;
    }

    const [mainSchemaName, mainSchema] = mainSchemaEntry;

    // Step 2: Build schema lookup
    const allSchemas = schemas;

    // Step 3: Recursive property walk
    // MetaEd does not allow circular Common references, so no visited-set needed.
    processSchemaProperties(
      mainSchema as SchemaObject,
      '',
      allSchemas,
      mainSchemaName,
      rows,
      projectEndpointName,
      projectVersion,
      resourceName,
    );
  });

  return rows;
}

/**
 * Extracts resource rows from a namespace's API schema data
 */
export function extractResourceRowsForNamespace(namespace: Namespace): ResourceRow[] {
  const rows: ResourceRow[] = [];

  const namespaceData = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
  if (namespaceData == null || namespaceData.apiSchema == null) {
    return rows;
  }

  const { projectSchema } = namespaceData.apiSchema;
  const { projectEndpointName } = projectSchema;
  const { projectVersion } = projectSchema;

  // Iterate over all resource schemas
  Object.entries(projectSchema.resourceSchemas).forEach(([resourceEndpoint, resourceSchema]: [string, ResourceSchema]) => {
    const resourceName = resourceEndpoint;

    // Find the OpenAPI fragment - prefer 'resources' type, fall back to 'descriptors'
    const openApiFragment = resourceSchema.openApiFragments.resources || resourceSchema.openApiFragments.descriptors;

    if (openApiFragment == null || openApiFragment.components == null || openApiFragment.components.schemas == null) {
      return;
    }

    // Get the main schema to extract description
    // For resources, there may be multiple schemas (main one plus _Reference, etc.)
    // Find the schema that best matches the resource name (without _Reference, _Readable, etc. suffixes)
    const { schemas } = openApiFragment.components;
    let mainSchema: SchemaObject | undefined;

    // Find a schema without common suffixes like _Reference, _Readable, or _Writable
    const schemaEntries = Object.entries(schemas);
    const mainSchemaEntry = schemaEntries.find(([schemaName, schema]) => {
      // The main schema typically doesn't have common suffixes like _Reference, _Readable, etc.
      // and usually contains properties (not just a $ref)
      const hasCommonSuffix =
        schemaName.endsWith('_Reference') || schemaName.endsWith('_Readable') || schemaName.endsWith('_Writable');

      return !hasCommonSuffix && (schema as SchemaObject).properties != null;
    });

    if (mainSchemaEntry != null) {
      mainSchema = mainSchemaEntry[1] as SchemaObject;
    }

    // If we didn't find a main schema with properties, just use the first one
    if (mainSchema == null) {
      mainSchema = schemaEntries[0]?.[1] as SchemaObject | undefined;
    }

    const resourceDescription = mainSchema?.description || '';

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
