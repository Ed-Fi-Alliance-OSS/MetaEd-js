import { invariant } from 'ts-invariant';
import { type TopLevelEntity, EntityProperty, StringProperty, IntegerProperty } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EndpointName } from '../model/api-schema/EndpointName';
import { Operation, Parameter, SchemaObject, ResponsesObject } from '../model/OpenApiTypes';

export function createResponses(): ResponsesObject {
  return {
    Created: {
      description:
        'The resource was created.  An ETag value is available in the ETag header, and the location of the resource is available in the Location header of the response.',
    },
    Updated: {
      description: 'The resource was updated.  An updated ETag value is available in the ETag header of the response.',
    },
    Deleted: {
      description: 'The resource was successfully deleted.',
    },
    NotModified: {
      description:
        "The resource's current server-side ETag value matched the If-None-Match header value supplied with the request indicating the resource has not been modified.",
    },
    BadRequest: {
      description:
        'Bad Request. The request was invalid and cannot be completed. See the response body for specific validation errors. This will typically be an issue with the query parameters or their values.',
      content: {
        'application/json': {},
      },
    },
    Unauthorized: {
      description:
        'Unauthorized. The request requires authentication. The OAuth bearer token was either not provided or is invalid. The operation may succeed once authentication has been successfully completed.',
    },
    Forbidden: {
      description:
        'Forbidden. The request cannot be completed in the current authorization context. Contact your administrator if you believe this operation should be allowed.',
    },
    NotFound: {
      description: 'The resource could not be found.',
    },
    NotFoundUseSnapshot: {
      description:
        'The resource could not be found. If Use-Snapshot header is set to true, this response can indicate the snapshot may have been removed.',
    },
    Conflict: {
      description:
        'Conflict.  The request cannot be completed because it would result in an invalid state.  See the response body for details.',
      content: {
        'application/json': {},
      },
    },
    PreconditionFailed: {
      description:
        "The resource's current server-side ETag value does not match the supplied If-Match header value in the request. This indicates the resource has been modified by another consumer.",
    },
    Error: {
      description: 'An unhandled error occurred on the server. See the response body for details.',
      content: {
        'application/json': {},
      },
    },
  };
}

/**
 * Returns the "post" section of non-id "path" for the given entity
 */
export function createPostSectionFor(entity: TopLevelEntity, endpointName: EndpointName): Operation {
  return {
    description:
      'The POST operation can be used to create or update resources. In database terms, this is often referred to as an "upsert" operation (insert + update). Clients should NOT include the resource "id" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.',
    operationId: `post${entity.metaEdName}`,
    requestBody: {
      description: `The JSON representation of the ${entity.metaEdName} resource to be created or updated.`,
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${entity.namespace.namespaceName}_${entity.metaEdName}`,
          },
        },
      },
      required: true,
      'x-bodyName': entity.metaEdName,
    },
    responses: {
      '200': {
        $ref: '#/components/responses/Updated',
      },
      '201': {
        $ref: '#/components/responses/Created',
      },
      '400': {
        $ref: '#/components/responses/BadRequest',
      },
      '401': {
        $ref: '#/components/responses/Unauthorized',
      },
      '403': {
        $ref: '#/components/responses/Forbidden',
      },
      '405': {
        description: 'Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.',
      },
      '409': {
        $ref: '#/components/responses/Conflict',
      },
      '412': {
        $ref: '#/components/responses/PreconditionFailed',
      },
      '500': {
        $ref: '#/components/responses/Error',
      },
    },
    summary: 'Creates or updates resources based on the natural key values of the supplied resource.',
    tags: [endpointName],
  };
}

/**
 * Returns the hardcoded set of get by query parameters common to all resources.
 */
function newStaticGetByQueryParameters(): Parameter[] {
  return [
    {
      $ref: '#/components/parameters/offset',
    },
    {
      $ref: '#/components/parameters/limit',
    },
    {
      $ref: '#/components/parameters/MinChangeVersion',
    },
    {
      $ref: '#/components/parameters/MaxChangeVersion',
    },
    {
      $ref: '#/components/parameters/totalCount',
    },
    {
      name: 'id',
      in: 'query',
      description: '',
      schema: {
        type: 'string',
      },
    },
  ];
}

function newStaticByIdParameters(): Parameter[] {
  return [
    {
      name: 'id',
      in: 'path',
      description: 'A resource identifier that uniquely identifies the resource.',
      required: true,
      schema: {
        type: 'string',
      },
    },
    {
      $ref: '#/components/parameters/If-None-Match',
    },
  ];
}

/**
 * Returns an OpenAPI schema object corresponding to the given property based on its type.
 */
function schemaObjectFrom(property: EntityProperty): SchemaObject {
  switch (property.type) {
    case 'boolean':
      return { type: 'boolean' };

    case 'duration':
      return { type: 'string', maxLength: 30 };

    case 'currency':
    case 'decimal':
    case 'percent':
    case 'sharedDecimal':
      return { type: 'number', format: 'double' };

    case 'date':
      return { type: 'string', format: 'date' };

    case 'datetime':
      return { type: 'string', format: 'date-time' };

    case 'descriptor':
    case 'enumeration':
      return { type: 'string', maxLength: 306 };

    case 'integer':
    case 'sharedInteger': {
      const integerProperty: IntegerProperty = property as IntegerProperty;
      return { type: 'integer', format: integerProperty.hasBigHint ? 'int64' : 'int32' };
    }

    case 'short':
    case 'sharedShort':
    case 'schoolYearEnumeration':
    case 'year':
      return { type: 'integer', format: 'int32' };

    case 'string':
    case 'sharedString': {
      const result: SchemaObject = { type: 'string' };
      const stringProperty: StringProperty = property as StringProperty;
      if (stringProperty.minLength) result.minLength = Number(stringProperty.minLength);
      if (stringProperty.maxLength) result.maxLength = Number(stringProperty.maxLength);
      return result;
    }

    case 'time':
      return { type: 'string' };

    default:
      return { type: 'boolean' };
  }
}

/**
 * Returns the set of get by query parameters for the given entity
 */
function getByQueryParametersFor(entity: TopLevelEntity): Parameter[] {
  const result: Parameter[] = [];
  const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  Object.entries(edfiApiSchemaData.queryFieldMapping).forEach(([fieldName, pathInfo]) => {
    invariant(pathInfo.length > 0, 'There should be at least one pathInfo in a queryFieldMapping');
    invariant(pathInfo[0].sourceProperty != null, 'There should be a sourceProperty on pathInfos');
    const { sourceProperty } = pathInfo[0];

    if (['association', 'choice', 'common', 'domainEntity', 'inlineCommon'].includes(sourceProperty.type)) return;

    const parameter: Parameter = {
      name: fieldName,
      in: 'query',
      description: sourceProperty.documentation,
      schema: schemaObjectFrom(sourceProperty),
    };
    if (sourceProperty.isPartOfIdentity) parameter['x-Ed-Fi-isIdentity'] = true;

    result.push(parameter);
  });
  return result;
}

/**
 * Returns the "get" section of the non-id "path" for the given entity
 */
export function createGetByQuerySectionFor(entity: TopLevelEntity, endpointName: EndpointName): Operation {
  return {
    description:
      'This GET operation provides access to resources using the "Get" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).',
    operationId: `get${entity.metaEdName}`,
    parameters: [...newStaticGetByQueryParameters(), ...getByQueryParametersFor(entity)],
    responses: {
      '200': {
        description: 'The requested resource was successfully retrieved.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: `#/components/schemas/${entity.namespace.namespaceName}_${entity.metaEdName}`,
              },
            },
          },
        },
      },
      '304': {
        $ref: '#/components/responses/NotModified',
      },
      '400': {
        $ref: '#/components/responses/BadRequest',
      },
      '401': {
        $ref: '#/components/responses/Unauthorized',
      },
      '403': {
        $ref: '#/components/responses/Forbidden',
      },
      '404': {
        $ref: '#/components/responses/NotFoundUseSnapshot',
      },
      '500': {
        $ref: '#/components/responses/Error',
      },
    },
    summary: 'Retrieves specific resources using the resource\'s property values (using the "Get" pattern).',
    tags: [endpointName],
  };
}

/**
 * Returns the "get" section of id "path" for the given entity
 */
export function createGetByIdSectionFor(entity: TopLevelEntity, endpointName: EndpointName): Operation {
  return {
    description: 'This GET operation retrieves a resource by the specified resource identifier.',
    operationId: `get${entity.metaEdName}`,
    parameters: [
      ...newStaticByIdParameters(),
      {
        name: 'Use-Snapshot',
        in: 'header',
        description: 'Indicates if the configured Snapshot should be used.',
        schema: {
          type: 'boolean',
          default: false,
        },
      },
    ],
    responses: {
      '200': {
        description: 'The requested resource was successfully retrieved.',
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${entity.namespace.namespaceName}_${entity.metaEdName}`,
            },
          },
        },
      },
      '304': {
        $ref: '#/components/responses/NotModified',
      },
      '400': {
        $ref: '#/components/responses/BadRequest',
      },
      '401': {
        $ref: '#/components/responses/Unauthorized',
      },
      '403': {
        $ref: '#/components/responses/Forbidden',
      },
      '404': {
        $ref: '#/components/responses/NotFoundUseSnapshot',
      },
      '500': {
        $ref: '#/components/responses/Error',
      },
    },
    summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
    tags: [endpointName],
  };
}

/**
 * Returns the "put" section of id "path" for the given entity
 */
export function createPutSectionFor(entity: TopLevelEntity, endpointName: EndpointName): Operation {
  return {
    description:
      'The PUT operation is used to update a resource by identifier. If the resource identifier ("id") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.',
    operationId: `put${entity.metaEdName}`,
    parameters: [
      ...newStaticByIdParameters(),
      {
        name: 'Use-Snapshot',
        in: 'header',
        description: 'Indicates if the configured Snapshot should be used.',
        schema: {
          type: 'boolean',
          default: false,
        },
      },
    ],
    requestBody: {
      description: `The JSON representation of the ${entity.metaEdName} resource to be created or updated.`,
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${entity.namespace.namespaceName}_${entity.metaEdName}`,
          },
        },
      },
    },
    responses: {
      '204': {
        $ref: '#/components/responses/Updated',
      },
      '400': {
        $ref: '#/components/responses/BadRequest',
      },
      '401': {
        $ref: '#/components/responses/Unauthorized',
      },
      '403': {
        $ref: '#/components/responses/Forbidden',
      },
      '404': {
        $ref: '#/components/responses/NotFound',
      },
      '405': {
        description: 'Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.',
      },
      '409': {
        $ref: '#/components/responses/Conflict',
      },
      '412': {
        $ref: '#/components/responses/PreconditionFailed',
      },
      '500': {
        $ref: '#/components/responses/Error',
      },
    },
    summary: 'Updates a resource based on the resource identifier.',
    tags: [endpointName],
  };
}

/**
 * Returns the "delete" section of id "path" for the given entity
 */
export function createDeleteSectionFor(entity: TopLevelEntity, endpointName: EndpointName): Operation {
  return {
    description:
      "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
    operationId: `delete${entity.metaEdName}`,
    parameters: newStaticByIdParameters(),
    responses: {
      '204': {
        $ref: '#/components/responses/Updated',
      },
      '400': {
        $ref: '#/components/responses/BadRequest',
      },
      '401': {
        $ref: '#/components/responses/Unauthorized',
      },
      '403': {
        $ref: '#/components/responses/Forbidden',
      },
      '404': {
        $ref: '#/components/responses/NotFound',
      },
      '405': {
        description: 'Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.',
      },
      '409': {
        $ref: '#/components/responses/Conflict',
      },
      '412': {
        $ref: '#/components/responses/PreconditionFailed',
      },
      '500': {
        $ref: '#/components/responses/Error',
      },
    },
    summary: 'Deletes an existing resource using the resource identifier.',
    tags: [endpointName],
  };
}
