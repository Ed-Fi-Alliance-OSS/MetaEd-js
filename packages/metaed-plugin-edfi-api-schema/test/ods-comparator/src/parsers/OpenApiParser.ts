/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DocumentStructure, DocumentField } from '../types/DocumentStructure';

interface OpenApiDocument {
  openapi: string;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

// Module-level variable to hold schemas during parsing
let schemas: Record<string, any> = {};

/**
 * Extract endpoint name from path (e.g., "/ed-fi/students" -> "students")
 */
function extractEndpointName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

/**
 * Extract schema name from $ref (e.g., "#/components/schemas/edFi_student" -> "edFi_student")
 */
function extractSchemaName(ref: string): string {
  const parts = ref.split('/');
  return parts[parts.length - 1];
}

/**
 * Get the field type from a schema
 */
function getFieldType(schema: any): DocumentField['type'] {
  if (schema.type === 'string') {
    if (schema.format === 'date') {
      return 'date';
    }
    if (schema.format === 'date-time') {
      return 'date-time';
    }
    return 'string';
  }
  if (schema.type === 'integer') {
    return 'integer';
  }
  if (schema.type === 'number') {
    return 'number';
  }
  if (schema.type === 'boolean') {
    return 'boolean';
  }
  if (schema.type === 'array') {
    return 'array';
  }
  if (schema.type === 'object' || schema.$ref) {
    return 'object';
  }

  return 'string'; // Default
}

/**
 * Determine if a property is a reference object based on naming conventions
 */
function isReferenceObject(propName: string, schema: any): boolean {
  return propName.endsWith('Reference') && schema.type === 'object';
}

/**
 * Extract resource name from reference property name
 */
function extractResourceNameFromReference(propName: string): string {
  // Remove 'Reference' suffix and pluralize
  let resourceName = propName.replace(/Reference$/, '');

  // Simple pluralization (this could be enhanced)
  if (!resourceName.endsWith('s')) {
    resourceName += 's';
  }

  return resourceName;
}

/**
 * Recursively parse a schema definition into DocumentFields
 */
function parseSchema(
  schema: any,
  currentPath: string,
  fields: Map<string, DocumentField>,
  requiredFields: string[],
  parentPath: string = '',
): void {
  if (schema.type === 'object' && schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      // Skip internal fields
      if (propName.startsWith('_')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const propPath = `${currentPath}.${propName}`;
      const isRequired = requiredFields.includes(propName);

      parseProperty(propName, propSchema as any, propPath, fields, isRequired);
    }
  } else if (schema.type === 'array' && schema.items) {
    // Handle array schema
    const arrayField: DocumentField = {
      path: currentPath,
      type: 'array',
      isRequired: parentPath ? requiredFields.includes(parentPath.split('.').pop()!) : false,
      arrayItems: {
        path: `${currentPath}[*]`,
        type: getFieldType(schema.items),
        isRequired: false,
      },
    };

    fields.set(currentPath, arrayField);

    // If array items are objects, parse their properties
    if (schema.items.type === 'object' || schema.items.$ref) {
      parseProperty('[*]', schema.items, `${currentPath}[*]`, fields, false);
    }
  }
}

/**
 * Parse a single property
 */
function parseProperty(
  propName: string,
  propSchema: any,
  propPath: string,
  fields: Map<string, DocumentField>,
  isRequired: boolean,
): void {
  if (propSchema.$ref) {
    // Handle reference
    const refSchemaName = extractSchemaName(propSchema.$ref);
    const refSchema = schemas[refSchemaName];

    if (refSchema) {
      // Check if this is a reference object (has properties that look like references)
      if (isReferenceObject(propName, refSchema)) {
        const resourceName = extractResourceNameFromReference(propName);

        // Add the reference object itself
        const refField: DocumentField = {
          path: propPath,
          type: 'object',
          isRequired,
          reference: {
            resourceName,
            isDescriptor: false,
          },
        };
        fields.set(propPath, refField);

        // Parse nested properties
        parseSchema(refSchema, propPath, fields, refSchema.required || [], propName);
      } else {
        // Regular object schema
        parseSchema(refSchema, propPath, fields, refSchema.required || [], propName);
      }
    }
  } else if (propSchema.type === 'array') {
    // Handle array
    const arrayField: DocumentField = {
      path: propPath,
      type: 'array',
      isRequired,
      arrayItems: {
        path: `${propPath}[*]`,
        type: 'object',
        isRequired: false,
      },
    };

    fields.set(propPath, arrayField);

    if (propSchema.items) {
      if (propSchema.items.$ref) {
        const itemSchemaName = extractSchemaName(propSchema.items.$ref);
        const itemSchema = schemas[itemSchemaName];
        if (itemSchema) {
          parseSchema(itemSchema, `${propPath}[*]`, fields, itemSchema.required || []);
        }
      } else {
        parseProperty('[*]', propSchema.items, `${propPath}[*]`, fields, false);
      }
    }
  } else if (propSchema.type === 'object') {
    // Handle nested object
    const objField: DocumentField = {
      path: propPath,
      type: 'object',
      isRequired,
    };
    fields.set(propPath, objField);

    if (propSchema.properties) {
      parseSchema(propSchema, propPath, fields, propSchema.required || [], propName);
    }
  } else {
    // Handle scalar field
    const field: DocumentField = {
      path: propPath,
      type: getFieldType(propSchema),
      isRequired,
    };

    // Check if this is a descriptor field
    if (propName.endsWith('Descriptor')) {
      field.reference = {
        resourceName: propName,
        isDescriptor: true,
      };
    }

    fields.set(propPath, field);
  }
}

/**
 * Parse a POST endpoint to extract its document structure
 */
function parsePostEndpoint(endpointName: string, postOperation: any): DocumentStructure | null {
  const { requestBody } = postOperation;
  if (!requestBody || !requestBody.content || !requestBody.content['application/json']) {
    return null;
  }

  const { schema } = requestBody.content['application/json'];
  if (!schema || !schema.$ref) {
    return null;
  }

  const schemaName = extractSchemaName(schema.$ref);
  const schemaDefinition = schemas[schemaName];

  if (!schemaDefinition) {
    return null;
  }

  const fields = new Map<string, DocumentField>();
  parseSchema(schemaDefinition, '$', fields, schemaDefinition.required || []);

  return {
    endpointName,
    fields,
  };
}

/**
 * Parse an OpenAPI document and extract document structures for all POST endpoints
 */
export function parseOpenApi(openApiDoc: OpenApiDocument): Map<string, DocumentStructure> {
  const structures = new Map<string, DocumentStructure>();
  schemas = openApiDoc.components.schemas;

  for (const [path, pathItem] of Object.entries(openApiDoc.paths)) {
    if (pathItem.post && pathItem.post.requestBody) {
      const endpointName = extractEndpointName(path);
      const structure = parsePostEndpoint(endpointName, pathItem.post);
      if (structure) {
        structures.set(endpointName, structure);
      }
    }
  }

  return structures;
}
