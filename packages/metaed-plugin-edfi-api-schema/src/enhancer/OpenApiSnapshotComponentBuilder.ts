// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ParameterObject, ReferenceObject, ResponseObject, SchemaObject } from '../model/OpenApiTypes';

/**
 * Component key of the reusable Snapshot request header parameter. Header parameters in this
 * plugin are keyed by their header name, matching the existing If-Match and If-None-Match keys.
 */
export const USE_SNAPSHOT_PARAMETER_KEY = 'Use-Snapshot';

/**
 * Component key of the reusable DMS ProblemDetails envelope schema.
 */
export const PROBLEM_DETAILS_SCHEMA_KEY = 'ProblemDetails';

/**
 * Component key of the reusable Snapshot Not Found 404 response.
 */
export const SNAPSHOT_NOT_FOUND_RESPONSE_KEY = 'SnapshotNotFound';

/**
 * Component key of the reusable snapshot-specific Method Not Allowed 405 response.
 */
export const SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_KEY = 'SnapshotMethodNotAllowed';

/**
 * Document-local reference to the reusable Snapshot request header parameter.
 */
export const USE_SNAPSHOT_PARAMETER_REFERENCE: ReferenceObject = {
  $ref: `#/components/parameters/${USE_SNAPSHOT_PARAMETER_KEY}`,
};

/**
 * Document-local reference to the reusable Snapshot Not Found 404 response.
 */
export const SNAPSHOT_NOT_FOUND_RESPONSE_REFERENCE: ReferenceObject = {
  $ref: `#/components/responses/${SNAPSHOT_NOT_FOUND_RESPONSE_KEY}`,
};

/**
 * Document-local reference to the reusable snapshot-specific Method Not Allowed 405 response.
 */
export const SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_REFERENCE: ReferenceObject = {
  $ref: `#/components/responses/${SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_KEY}`,
};

/**
 * Media type of every DMS ProblemDetails response body.
 */
const PROBLEM_DETAILS_MEDIA_TYPE = 'application/problem+json';

/**
 * Illustrative request correlation identifier used in ProblemDetails response examples.
 */
const EXAMPLE_CORRELATION_ID = 'd4f2b1c8-6a3e-4a2f-9c1d-7b5e8a0f3c21';

/**
 * Creates the reusable Snapshot request header parameter. The header opts a read request into
 * the configured Snapshot, and defaults to false when the client does not send it.
 */
export function createUseSnapshotParameter(): ParameterObject {
  return {
    name: USE_SNAPSHOT_PARAMETER_KEY,
    in: 'header',
    description: 'Indicates whether the request should be served from the configured Snapshot.',
    schema: {
      type: 'boolean',
      default: false,
    },
  };
}

/**
 * Creates the reusable DMS ProblemDetails envelope schema. The shape mirrors the shared envelope
 * the Data Management Service emits for every failure response, so a single structural schema
 * describes both snapshot and non-snapshot bodies returned under the same status code.
 */
export function createProblemDetailsSchema(): SchemaObject {
  return {
    type: 'object',
    description: 'The shared Ed-Fi Data Management Service problem details envelope for failure responses.',
    required: ['detail', 'type', 'title', 'status', 'correlationId', 'validationErrors', 'errors'],
    properties: {
      detail: {
        type: 'string',
        description: 'A human-readable explanation specific to this occurrence of the problem.',
      },
      type: {
        type: 'string',
        description: 'A URI reference that identifies the problem type.',
      },
      title: {
        type: 'string',
        description: 'A short, human-readable summary of the problem type.',
      },
      status: {
        type: 'integer',
        format: 'int32',
        description: 'The HTTP status code produced for this occurrence of the problem.',
      },
      correlationId: {
        type: 'string',
        description: 'The correlation identifier of the request that produced this problem.',
      },
      validationErrors: {
        type: 'object',
        description: 'Validation failures keyed by the location of the invalid value.',
        additionalProperties: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
      errors: {
        type: 'array',
        description: 'Errors that are not attributable to a specific location in the request.',
        items: {
          type: 'string',
        },
      },
    },
  };
}

/**
 * Creates the reusable Snapshot Not Found 404 response. A snapshot-eligible GET has a single 404
 * slot, so the description covers both the ordinary resource-not-found case and the snapshot case
 * while the example demonstrates the exact Snapshot Not Found body.
 */
export function createSnapshotNotFoundResponse(): ResponseObject {
  return {
    description:
      'The requested resource could not be found. When the Use-Snapshot header is true, this also indicates that the configured Snapshot could not be found, for example because it has been removed.',
    content: {
      [PROBLEM_DETAILS_MEDIA_TYPE]: {
        schema: {
          $ref: `#/components/schemas/${PROBLEM_DETAILS_SCHEMA_KEY}`,
        },
        example: {
          detail: 'Snapshot not found.',
          type: 'urn:ed-fi:api:not-found',
          title: 'Not Found',
          status: 404,
          correlationId: EXAMPLE_CORRELATION_ID,
          validationErrors: {},
          errors: [],
        },
      },
    },
  };
}

/**
 * Creates the reusable snapshot-specific Method Not Allowed 405 response. Snapshot data is
 * read-only, so a write attempt is rejected and the Allow header advertises the only method
 * the endpoint accepts in that state.
 */
export function createSnapshotMethodNotAllowedResponse(): ResponseObject {
  return {
    description: 'Method Not Allowed. An attempt was made to modify data in a Snapshot, but Snapshot data is read-only.',
    headers: {
      Allow: {
        description: 'The methods the endpoint accepts for a Snapshot request.',
        schema: {
          type: 'string',
        },
        example: 'GET',
      },
    },
    content: {
      [PROBLEM_DETAILS_MEDIA_TYPE]: {
        schema: {
          $ref: `#/components/schemas/${PROBLEM_DETAILS_SCHEMA_KEY}`,
        },
        example: {
          detail: 'An attempt was made to modify data in a Snapshot, but this data is read-only.',
          type: 'urn:ed-fi:api:snapshots:method-not-allowed',
          title: 'Method Not Allowed with Snapshots',
          status: 405,
          correlationId: EXAMPLE_CORRELATION_ID,
          validationErrors: {},
          errors: [],
        },
      },
    },
  };
}
