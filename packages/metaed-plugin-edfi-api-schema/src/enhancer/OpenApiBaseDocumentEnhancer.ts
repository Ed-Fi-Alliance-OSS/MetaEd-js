// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { type MetaEdEnvironment, type EnhancerResult, type Namespace } from '@edfi/metaed-core';
import { ComponentsObject, Document, Operation, PathsObject } from '../model/OpenApiTypes';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import { createHardcodedParameterResponses, createHardcodedComponentParameters } from './OpenApiSpecificationEnhancerBase';
import { newSchoolYearOpenApis } from './OpenApiComponentEnhancerBase';
import { OpenApiDocumentType, OpenApiDocumentTypeValue } from '../model/api-schema/OpenApiDocumentType';
import {
  PROBLEM_DETAILS_SCHEMA_KEY,
  SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_KEY,
  SNAPSHOT_NOT_FOUND_RESPONSE_KEY,
  SNAPSHOT_NOT_FOUND_RESPONSE_REFERENCE,
  USE_SNAPSHOT_PARAMETER_KEY,
  USE_SNAPSHOT_PARAMETER_REFERENCE,
  createProblemDetailsSchema,
  createSnapshotMethodNotAllowedResponse,
  createSnapshotNotFoundResponse,
  createUseSnapshotParameter,
} from './OpenApiSnapshotComponentBuilder';

/**
 * Creates the component object for a document type. Each base document is served independently,
 * so every document owns its own copy of the snapshot components its operations reference.
 * Change Queries has no mutating operation, so it omits the snapshot 405 response.
 */
function createComponentsObject(documentType: OpenApiDocumentTypeValue): ComponentsObject {
  if (documentType === OpenApiDocumentType.CHANGE_QUERIES) {
    return {
      schemas: {
        [PROBLEM_DETAILS_SCHEMA_KEY]: createProblemDetailsSchema(),
      },
      responses: {
        [SNAPSHOT_NOT_FOUND_RESPONSE_KEY]: createSnapshotNotFoundResponse(),
      },
      parameters: {
        [USE_SNAPSHOT_PARAMETER_KEY]: createUseSnapshotParameter(),
      },
    };
  }

  return {
    schemas: {
      [PROBLEM_DETAILS_SCHEMA_KEY]: createProblemDetailsSchema(),
    },
    responses: {
      ...createHardcodedParameterResponses(),
      [SNAPSHOT_NOT_FOUND_RESPONSE_KEY]: createSnapshotNotFoundResponse(),
      [SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_KEY]: createSnapshotMethodNotAllowedResponse(),
    },
    parameters: {
      ...createHardcodedComponentParameters(),
      [USE_SNAPSHOT_PARAMETER_KEY]: createUseSnapshotParameter(),
    },
  };
}

/**
 * Creates the Change Queries available change versions operation.
 */
function createAvailableChangeVersionsOperation(): Operation {
  return {
    operationId: 'getAvailableChangeVersions',
    summary: 'Retrieves the available change version range.',
    parameters: [USE_SNAPSHOT_PARAMETER_REFERENCE],
    responses: {
      '200': {
        description: 'The available change version range was successfully retrieved.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['oldestChangeVersion', 'newestChangeVersion'],
              properties: {
                oldestChangeVersion: {
                  type: 'integer',
                  format: 'int64',
                },
                newestChangeVersion: {
                  type: 'integer',
                  format: 'int64',
                },
              },
            },
          },
        },
      },
      '404': SNAPSHOT_NOT_FOUND_RESPONSE_REFERENCE,
    },
  };
}

/**
 * Creates the path object for the standalone Change Queries OpenAPI document.
 */
function createChangeQueriesPaths(): PathsObject {
  return {
    '/availableChangeVersions': {
      get: createAvailableChangeVersionsOperation(),
    },
  };
}

/**
 * Creates the base OpenAPI document structure with document-specific initial paths and components.
 * This structure is common to all OpenAPI documents (resources, descriptors, etc.)
 */
function createBaseOpenApiDocument(metaEd: MetaEdEnvironment, documentType: OpenApiDocumentTypeValue): Document {
  const components: ComponentsObject = createComponentsObject(documentType);

  const openApiDocument: Document = {
    openapi: '3.0.0',
    info: {
      title: 'Ed-Fi Data Management Service API',
      description:
        'The Ed-Fi DMS API enables applications to read and write education data stored in an Ed-Fi DMS through a secure REST interface. \n***\n > *Note: Consumers of DMS information should sanitize all data for display and storage. DMS provides reasonable safeguards against cross-site scripting attacks and other malicious content, but the platform does not and cannot guarantee that the data it contains is free of all potentially harmful content.* \n***\n',
      version: '1',
      contact: { url: 'https://www.ed-fi.org/what-is-ed-fi/contact/' },
    },
    servers: [
      {
        url: '',
      },
    ],
    paths: documentType === OpenApiDocumentType.CHANGE_QUERIES ? createChangeQueriesPaths() : {},
    components,
    tags: [],
  };

  // Add hardcoded SchoolYearTypeReference schema only to resources document
  if (documentType === OpenApiDocumentType.RESOURCES) {
    const schoolYearOpenApis = newSchoolYearOpenApis(metaEd.minSchoolYear, metaEd.maxSchoolYear);
    const { schemas } = components;
    if (schemas != null) {
      schemas.EdFi_SchoolYearTypeReference = schoolYearOpenApis.schoolYearEnumerationOpenApi;
    }
  }

  return openApiDocument;
}

/**
 * Enhancer that creates the base OpenAPI document structures for core namespaces.
 * These base documents will be populated with fragments from ResourceSchema objects
 * during the generation phase.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.isExtension) return;

    const namespaceEdfiApiSchema: NamespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;

    // Create base documents for resources, descriptors, and the standalone Change Queries fixed route.
    namespaceEdfiApiSchema.openApiBaseDocuments = {
      [OpenApiDocumentType.RESOURCES]: createBaseOpenApiDocument(metaEd, OpenApiDocumentType.RESOURCES),
      [OpenApiDocumentType.DESCRIPTORS]: createBaseOpenApiDocument(metaEd, OpenApiDocumentType.DESCRIPTORS),
      [OpenApiDocumentType.CHANGE_QUERIES]: createBaseOpenApiDocument(metaEd, OpenApiDocumentType.CHANGE_QUERIES),
    };
  });

  return {
    enhancerName: 'OpenApiBaseDocumentEnhancer',
    success: true,
  };
}
