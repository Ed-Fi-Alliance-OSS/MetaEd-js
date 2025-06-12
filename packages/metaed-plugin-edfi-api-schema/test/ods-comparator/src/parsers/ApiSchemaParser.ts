/* eslint-disable no-restricted-syntax */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApiSchema } from '../../../../src/model/api-schema/ApiSchema';
import { ResourceSchema } from '../../../../src/model/api-schema/ResourceSchema';
import { DocumentPaths } from '../../../../src/model/api-schema/DocumentPaths';
import { PathType } from '../../../../src/model/api-schema/PathType';
import { DocumentStructure, DocumentField } from '../types/DocumentStructure';

/**
 * Map PathType to DocumentField type
 */
function mapPathTypeToFieldType(pathType: PathType): DocumentField['type'] {
  switch (pathType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'date';
    case 'date-time':
      return 'date-time';
    case 'time':
      return 'string'; // Treat time as string
    default:
      // Handle any additional types as string
      return 'string';
  }
}

/**
 * Parse DocumentPaths into DocumentField(s)
 */
function parseDocumentPaths(documentPaths: DocumentPaths): DocumentField[] {
  const fields: DocumentField[] = [];

  if (!documentPaths.isReference) {
    // Scalar path
    fields.push({
      path: documentPaths.path,
      type: mapPathTypeToFieldType(documentPaths.type),
      isRequired: documentPaths.isRequired,
    });
  } else if ('isDescriptor' in documentPaths && documentPaths.isDescriptor) {
    // Descriptor reference
    fields.push({
      path: documentPaths.path,
      type: 'string',
      isRequired: documentPaths.isRequired,
      reference: {
        resourceName: documentPaths.resourceName,
        isDescriptor: true,
      },
    });
  } else if ('referenceJsonPaths' in documentPaths) {
    // Regular reference with referenceJsonPaths
    for (const refPath of documentPaths.referenceJsonPaths) {
      fields.push({
        path: refPath.referenceJsonPath,
        type: mapPathTypeToFieldType(refPath.type),
        isRequired: documentPaths.isRequired,
        reference: {
          resourceName: documentPaths.resourceName,
          isDescriptor: false,
        },
      });
    }
  }

  return fields;
}

/**
 * Parse a single ResourceSchema into a DocumentStructure
 */
function parseResourceSchema(endpointName: string, resourceSchema: ResourceSchema): DocumentStructure {
  const fields = new Map<string, DocumentField>();

  // Process documentPathsMapping
  for (const [, documentPaths] of Object.entries(resourceSchema.documentPathsMapping)) {
    const documentFields = parseDocumentPaths(documentPaths);

    // Add all fields from this document path
    for (const field of documentFields) {
      fields.set(field.path, field);
    }
  }

  return {
    endpointName,
    fields,
    isDescriptor: !resourceSchema.isResourceExtension && resourceSchema.isDescriptor,
  };
}

/**
 * Parse an ApiSchema and extract document structures for all resources
 */
export function parseApiSchema(apiSchema: ApiSchema): Map<string, DocumentStructure> {
  const structures = new Map<string, DocumentStructure>();

  const { resourceSchemas } = apiSchema.projectSchema;

  for (const [endpointName, resourceSchema] of Object.entries(resourceSchemas)) {
    const structure = parseResourceSchema(endpointName, resourceSchema);
    structures.set(endpointName, structure);
  }

  return structures;
}
