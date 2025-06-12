/* eslint-disable no-restricted-syntax */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DocumentStructure, DocumentField, ComparisonResult } from '../types/DocumentStructure';

export interface ComparisonOptions {
  ignoreLinkFields?: boolean;
  ignoreTypeMismatches?: boolean;
  ignoreRequiredMismatches?: boolean;
}

/**
 * Check if a path is a link field on a reference
 */
function isLinkFieldOnReference(path: string): boolean {
  // Check if path ends with link.rel or link.href and contains Reference
  const linkFieldPattern = /Reference.*\.link\.(rel|href)$/;
  return linkFieldPattern.test(path);
}

/**
 * Check if a path is an array field that has array items in ApiSchema
 */
function isArrayFieldWithItemsInApiSchema(path: string, apiSchemaStructure: DocumentStructure): boolean {
  // Only check paths that don't already contain [*] at the end
  if (!path.endsWith('[*]')) {
    const arrayItemPath = `${path}[*]`;
    // Check if there are any fields that start with the array item path
    for (const [apiPath] of apiSchemaStructure.fields) {
      if (apiPath.startsWith(arrayItemPath)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if a path is a reference object that has fields in ApiSchema
 */
function isReferenceObjectWithFieldsInApiSchema(path: string, apiSchemaStructure: DocumentStructure): boolean {
  // Check if this path represents an object that has reference fields under it
  const referencePrefix = `${path}.`;

  // Check if there are any fields that start with this path and are references (not descriptors)
  for (const [apiPath, field] of apiSchemaStructure.fields) {
    if (apiPath.startsWith(referencePrefix) && field.reference && !field.reference.isDescriptor) {
      return true;
    }
  }

  return false;
}

/**
 * Check if two types are compatible
 */
function areTypesCompatible(apiSchemaType: DocumentField['type'], openApiType: DocumentField['type']): boolean {
  // Direct match
  if (apiSchemaType === openApiType) {
    return true;
  }

  // Consider date and date-time as compatible
  if (
    (apiSchemaType === 'date' || apiSchemaType === 'date-time') &&
    (openApiType === 'date' || openApiType === 'date-time')
  ) {
    return true;
  }

  // Consider integer and number as compatible
  if (
    (apiSchemaType === 'integer' || apiSchemaType === 'number') &&
    (openApiType === 'integer' || openApiType === 'number')
  ) {
    return true;
  }

  return false;
}

/**
 * Compare a single endpoint between ApiSchema and OpenAPI
 */
function compareEndpoint(
  endpointName: string,
  apiSchemaStructure: DocumentStructure,
  openApiStructure: DocumentStructure,
  options: ComparisonOptions = {},
): ComparisonResult {
  const missingInOpenApi: string[] = [];
  const missingInApiSchema: string[] = [];
  const typeMismatches: ComparisonResult['typeMismatches'] = [];
  const requiredMismatches: ComparisonResult['requiredMismatches'] = [];

  // Find fields missing in OpenAPI
  for (const [path, apiField] of apiSchemaStructure.fields) {
    const openApiField = openApiStructure.fields.get(path);

    if (!openApiField) {
      missingInOpenApi.push(path);
    } else {
      // Compare types
      if (!options.ignoreTypeMismatches && !areTypesCompatible(apiField.type, openApiField.type)) {
        typeMismatches.push({
          path,
          apiSchemaType: apiField.type,
          openApiType: openApiField.type,
        });
      }

      // Compare required status
      if (!options.ignoreRequiredMismatches && apiField.isRequired !== openApiField.isRequired) {
        requiredMismatches.push({
          path,
          apiSchemaRequired: apiField.isRequired,
          openApiRequired: openApiField.isRequired,
        });
      }
    }
  }

  // Find fields missing in ApiSchema
  for (const [path] of openApiStructure.fields) {
    if (!apiSchemaStructure.fields.has(path)) {
      // Skip internal fields from OpenAPI
      if (!path.includes('._') && !path.includes('.id')) {
        // Skip link fields on references if option is enabled
        const shouldSkipLinkField = options.ignoreLinkFields && isLinkFieldOnReference(path);

        // Skip array fields if array items exist in ApiSchema
        const shouldSkipArrayField = isArrayFieldWithItemsInApiSchema(path, apiSchemaStructure);

        // Skip reference objects if reference fields exist in ApiSchema
        const shouldSkipReferenceObject = isReferenceObjectWithFieldsInApiSchema(path, apiSchemaStructure);

        if (!shouldSkipLinkField && !shouldSkipArrayField && !shouldSkipReferenceObject) {
          missingInApiSchema.push(path);
        }
      }
    }
  }

  const isMatch =
    missingInOpenApi.length === 0 &&
    missingInApiSchema.length === 0 &&
    typeMismatches.length === 0 &&
    requiredMismatches.length === 0;

  return {
    endpointName,
    missingInOpenApi,
    missingInApiSchema,
    typeMismatches,
    requiredMismatches,
    isMatch,
  };
}

/**
 * Compare document structures from ApiSchema and OpenAPI
 */
export function compareStructures(
  apiSchemaStructures: Map<string, DocumentStructure>,
  openApiStructures: Map<string, DocumentStructure>,
  options: ComparisonOptions = {},
): ComparisonResult[] {
  const results: ComparisonResult[] = [];
  const allEndpoints = new Set([...apiSchemaStructures.keys(), ...openApiStructures.keys()]);

  for (const endpointName of allEndpoints) {
    const apiSchemaStructure = apiSchemaStructures.get(endpointName);
    const openApiStructure = openApiStructures.get(endpointName);

    // Skip descriptor endpoints from ApiSchema
    if (!apiSchemaStructure?.isDescriptor) {
      if (!apiSchemaStructure) {
        // Endpoint exists in OpenAPI but not in ApiSchema
        results.push({
          endpointName,
          missingFromApiSchema: true,
          missingInOpenApi: [],
          missingInApiSchema: [],
          typeMismatches: [],
          requiredMismatches: [],
          isMatch: false,
        });
      } else if (!openApiStructure) {
        // Endpoint exists in ApiSchema but not in OpenAPI
        results.push({
          endpointName,
          missingFromOpenApi: true,
          missingInOpenApi: [],
          missingInApiSchema: [],
          typeMismatches: [],
          requiredMismatches: [],
          isMatch: false,
        });
      } else {
        // Both exist, compare fields
        const result = compareEndpoint(endpointName, apiSchemaStructure, openApiStructure, options);
        results.push(result);
      }
    }
  }

  return results;
}
