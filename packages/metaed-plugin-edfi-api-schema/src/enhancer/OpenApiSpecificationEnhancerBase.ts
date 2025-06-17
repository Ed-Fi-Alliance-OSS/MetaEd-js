// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { invariant } from 'ts-invariant';
import { type TopLevelEntity, EntityProperty, StringProperty, IntegerProperty } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EndpointName } from '../model/api-schema/EndpointName';
import {
  Operation,
  Parameter,
  SchemaObject,
  ResponsesObject,
  ParameterObject,
  ReferenceObject,
  PathsObject,
  Schemas,
  TagObject,
} from '../model/OpenApiTypes';
import { pluralize } from '../Utility';
import { ProjectEndpointName } from '../model/api-schema/ProjectEndpointName';
import { normalizeDescriptorName } from '../Utility';

/**
 * Creates the set of hardcoded component parameters
 */
export function createHardcodedParameterResponses(): ResponsesObject {
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
 * Creates the set of hardcoded component parameters
 */
export function createHardcodedComponentParameters(): { [key: string]: ReferenceObject | ParameterObject } {
  return {
    offset: {
      name: 'offset',
      in: 'query',
      description: 'Indicates how many items should be skipped before returning results.',
      schema: {
        type: 'integer',
        format: 'int32',
      },
    },
    limit: {
      name: 'limit',
      in: 'query',
      description: 'Indicates the maximum number of items that should be returned in the results.',
      schema: {
        maximum: 500,
        minimum: 0,
        type: 'integer',
        format: 'int32',
        default: 25,
      },
    },
    MinChangeVersion: {
      name: 'minChangeVersion',
      in: 'query',
      description: 'Used in synchronization to set sequence minimum ChangeVersion',
      schema: {
        type: 'integer',
        format: 'int64',
      },
    },
    MaxChangeVersion: {
      name: 'maxChangeVersion',
      in: 'query',
      description: 'Used in synchronization to set sequence maximum ChangeVersion',
      schema: {
        type: 'integer',
        format: 'int64',
      },
    },
    'If-None-Match': {
      name: 'If-None-Match',
      in: 'header',
      description:
        'The previously returned ETag header value, used here to prevent the unnecessary data transfer of an unchanged resource.',
      schema: {
        type: 'string',
      },
    },
    fields: {
      name: 'fields',
      in: 'query',
      description:
        'Specifies a subset of properties that should be returned for each entity (e.g. "property1,collection1(collProp1,collProp2)").',
      schema: {
        type: 'string',
      },
    },
    queryExpression: {
      name: 'q',
      in: 'query',
      description:
        'Specifies a query filter expression for the request. Currently only supports range-based queries on dates and numbers (e.g. "schoolId:[255901000...255901002]" and "BeginDate:[2016-03-07...2016-03-10]").',
      schema: {
        type: 'string',
      },
    },
    totalCount: {
      name: 'totalCount',
      in: 'query',
      description:
        "Indicates if the total number of items available should be returned in the 'Total-Count' header of the response.  If set to false, 'Total-Count' header will not be provided. Must be false when using cursor paging (with pageToken).",
      schema: {
        type: 'boolean',
        default: false,
      },
    },
    pageToken: {
      name: 'pageToken',
      in: 'query',
      description:
        'The token of the page to retrieve, obtained either from the "Next-Page-Token" header of the previous request, or from the "partitions" endpoint for the resource. Cannot be used with limit/offset paging.',
      schema: {
        type: 'string',
      },
    },
    pageSize: {
      name: 'pageSize',
      in: 'query',
      description: 'The maximum number of items to retrieve in the page. For use with pageToken (cursor paging) only.',
      schema: {
        minimum: 0,
        type: 'integer',
        format: 'int32',
        default: 25,
      },
    },
    numberOfPartitions: {
      name: 'number',
      in: 'query',
      description:
        'The number of evenly distributed partitions to provide for client-side parallel processing. If unspecified, a reasonable set of partitions will be determined based on the total number of accessible items.',
      schema: {
        maximum: 200,
        minimum: 1,
        type: 'integer',
        format: 'int32',
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
            $ref: `#/components/schemas/${entity.namespace.namespaceName}_${normalizeDescriptorName(entity)}`,
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

// All descriptor documents have the same OpenAPI get by query parameters
const descriptorOpenApiParameters: Parameter[] = [
  {
    name: 'codeValue',
    in: 'query',
    description: 'A code or abbreviation that is used to refer to the descriptor.',
    schema: {
      maxLength: 50,
      type: 'string',
    },
    'x-Ed-Fi-isIdentity': true,
  },
  {
    name: 'description',
    in: 'query',
    description: 'The description of the descriptor.',
    schema: {
      maxLength: 1024,
      type: 'string',
    },
  },
  {
    name: 'effectiveBeginDate',
    in: 'query',
    description:
      'The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.',
    schema: {
      type: 'string',
      format: 'date',
    },
  },
  {
    name: 'effectiveEndDate',
    in: 'query',
    description: 'The end date of the period when the descriptor is in effect.',
    schema: {
      type: 'string',
      format: 'date',
    },
  },
  {
    name: 'namespace',
    in: 'query',
    description:
      'A globally unique namespace that identifies this descriptor set. Author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary.',
    schema: {
      maxLength: 255,
      type: 'string',
    },
    'x-Ed-Fi-isIdentity': true,
  },
  {
    name: 'shortDescription',
    in: 'query',
    description: 'A shortened description for the descriptor.',
    schema: {
      maxLength: 75,
      type: 'string',
    },
  },
];

/**
 * Returns the set of get by query parameters for the given entity
 */
function getByQueryParametersFor(entity: TopLevelEntity): Parameter[] {
  if (entity.type === 'descriptor') {
    return descriptorOpenApiParameters;
  }

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
    operationId: `get${pluralize(entity.metaEdName)}`,
    parameters: [...newStaticGetByQueryParameters(), ...getByQueryParametersFor(entity)],
    responses: {
      '200': {
        description: 'The requested resource was successfully retrieved.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: `#/components/schemas/${entity.namespace.namespaceName}_${normalizeDescriptorName(entity)}`,
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
    operationId: `get${pluralize(entity.metaEdName)}ById`,
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
              $ref: `#/components/schemas/${entity.namespace.namespaceName}_${normalizeDescriptorName(entity)}`,
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
            $ref: `#/components/schemas/${entity.namespace.namespaceName}_${normalizeDescriptorName(entity)}`,
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
    operationId: `delete${pluralize(entity.metaEdName)}ById`,
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

/**
 * Creates the schemas from a given TopLevelEntity
 */
export function createSchemasFrom(entity: TopLevelEntity): Schemas {
  const schemas: Schemas = {};

  const {
    openApiReferenceComponent,
    openApiReferenceComponentPropertyName,
    openApiRequestBodyComponent,
    openApiRequestBodyComponentPropertyName,
    openApiRequestBodyCollectionComponents,
  } = entity.data.edfiApiSchema as EntityApiSchemaData;

  // DomainEntityExtension and AssociationExtension do not have their own references or request bodies
  if (entity.type !== 'domainEntityExtension' && entity.type !== 'associationExtension') {
    // Add reference component
    // Not all entities have a reference component (e.g. descriptors, school year enumeration)
    if (openApiReferenceComponentPropertyName !== '') {
      schemas[openApiReferenceComponentPropertyName] = openApiReferenceComponent;
    }

    // Add request body component
    // 'Descriptor' suffix when entity is a Descriptor
    const key =
      entity.type === 'descriptor'
        ? `${openApiRequestBodyComponentPropertyName}Descriptor`
        : openApiRequestBodyComponentPropertyName;
    schemas[key] = openApiRequestBodyComponent;
  }

  // Add collection components
  openApiRequestBodyCollectionComponents.forEach(({ propertyName, schema }) => {
    schemas[propertyName] = schema;
  });

  return schemas;
}

/**
 * Creates the paths from a given TopLevelEntity
 */
export function createPathsFrom(entity: TopLevelEntity): PathsObject {
  const paths: PathsObject = {};

  const projectEndpointName: ProjectEndpointName = entity.namespace.projectName.toLowerCase() as ProjectEndpointName;
  const { endpointName } = entity.data.edfiApiSchema as EntityApiSchemaData;

  // Add to paths without "id"
  paths[`/${projectEndpointName}/${endpointName}`] = {
    post: createPostSectionFor(entity, endpointName),
    get: createGetByQuerySectionFor(entity, endpointName),
  };

  paths[`/${projectEndpointName}/${endpointName}/{id}`] = {
    get: createGetByIdSectionFor(entity, endpointName),
    put: createPutSectionFor(entity, endpointName),
    delete: createDeleteSectionFor(entity, endpointName),
  };

  return paths;
}

/**
 * Creates the tags from a given TopLevelEntity
 */
export function createTagsFrom(entity: TopLevelEntity): TagObject[] {
  const tags: TagObject[] = [];

  const { endpointName } = entity.data.edfiApiSchema as EntityApiSchemaData;

  tags.push({
    name: endpointName,
    description: entity.documentation,
  });

  return tags;
}

/**
 * Sorts tag objects by name, returning a new array.
 */
export function sortTagsByName(tags: TagObject[]): TagObject[] {
  return [...tags].sort((a, b) => a.name.localeCompare(b.name));
}
