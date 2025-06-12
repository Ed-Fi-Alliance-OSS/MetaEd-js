// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/**
 * Represents a field in the document structure
 */
export interface DocumentField {
  /**
   * The JSONPath to this field (e.g., "$.birthDate", "$.schoolReference.schoolId")
   */
  path: string;

  /**
   * The data type of the field
   */
  type: 'string' | 'number' | 'integer' | 'boolean' | 'date' | 'date-time' | 'array' | 'object';

  /**
   * Whether this field is required
   */
  isRequired: boolean;

  /**
   * If this is a reference field, contains reference information
   */
  reference?: {
    /**
     * The resource being referenced (e.g., "schools", "students")
     */
    resourceName: string;

    /**
     * Whether this is a descriptor reference
     */
    isDescriptor: boolean;
  };

  /**
   * If this is an array field, contains information about array items
   */
  arrayItems?: DocumentField;

  /**
   * If this is an object field, contains nested fields
   */
  properties?: Record<string, DocumentField>;
}

/**
 * Represents the complete document structure for an API endpoint
 */
export interface DocumentStructure {
  /**
   * The endpoint name (e.g., "students", "schools")
   */
  endpointName: string;

  /**
   * All fields in the document, keyed by their JSONPath
   */
  fields: Map<string, DocumentField>;

  /**
   * Whether this endpoint is a descriptor
   */
  isDescriptor?: boolean;
}

/**
 * Result of comparing two document structures
 */
export interface ComparisonResult {
  /**
   * The endpoint being compared
   */
  endpointName: string;

  /**
   * Whether the endpoint is missing from ApiSchema
   */
  missingFromApiSchema?: boolean;

  /**
   * Whether the endpoint is missing from OpenAPI
   */
  missingFromOpenApi?: boolean;

  /**
   * Fields that exist in ApiSchema but not in OpenAPI
   */
  missingInOpenApi: string[];

  /**
   * Fields that exist in OpenAPI but not in ApiSchema
   */
  missingInApiSchema: string[];

  /**
   * Fields with different types between ApiSchema and OpenAPI
   */
  typeMismatches: Array<{
    path: string;
    apiSchemaType: string;
    openApiType: string;
  }>;

  /**
   * Fields with different required status
   */
  requiredMismatches: Array<{
    path: string;
    apiSchemaRequired: boolean;
    openApiRequired: boolean;
  }>;

  /**
   * Whether the structures match
   */
  isMatch: boolean;
}
