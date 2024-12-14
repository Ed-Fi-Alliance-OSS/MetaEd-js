import type { OpenAPIV3 } from 'openapi-types';
import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import type { ProjectNamespace } from '../model/api-schema/ProjectNamespace';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EndpointName } from '../model/api-schema/EndpointName';

type Schemas = { [key: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject };

/**
 * Returns the "post" section of "path" for the given entity
 */
function createPostSectionFor(entity: TopLevelEntity, endpointName: EndpointName): OpenAPIV3.OperationObject {
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
      // 'x-bodyName': entity.metaEdName,  ----- in ODS/API but not part of OpenAPI spec
    },
    responses: {
      200: {
        $ref: '#/components/responses/Updated',
      },
      201: {
        $ref: '#/components/responses/Created',
      },
      400: {
        $ref: '#/components/responses/BadRequest',
      },
      401: {
        $ref: '#/components/responses/Unauthorized',
      },
      403: {
        $ref: '#/components/responses/Forbidden',
      },
      405: {
        description: 'Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.',
      },
      409: {
        $ref: '#/components/responses/Conflict',
      },
      412: {
        $ref: '#/components/responses/PreconditionFailed',
      },
      500: {
        $ref: '#/components/responses/Error',
      },
    },
    summary: 'Creates or updates resources based on the natural key values of the supplied resource.',
    tags: [endpointName],
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const paths: OpenAPIV3.PathsObject = {};
    const schemas: Schemas = {};

    getEntitiesOfTypeForNamespaces(
      [namespace],
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
    ).forEach((entity: TopLevelEntity) => {
      const projectNamespace: ProjectNamespace = entity.namespace.projectName.toLowerCase() as ProjectNamespace;
      const { endpointName } = entity.data.edfiApiSchema as EntityApiSchemaData;

      // Add to Paths
      paths[`/${projectNamespace}/${endpointName}`] = {
        post: createPostSectionFor(entity, endpointName),
      };

      const {
        openApiReferenceComponent,
        openApiReferenceComponentPropertyName,
        openApiRequestBodyComponent,
        openApiRequestBodyComponentPropertyName,
      } = entity.data.edfiApiSchema as EntityApiSchemaData;

      // Add to Schemas
      schemas[openApiReferenceComponentPropertyName] = openApiReferenceComponent;
      schemas[openApiRequestBodyComponentPropertyName] = openApiRequestBodyComponent;
    });

    const components: OpenAPIV3.ComponentsObject = {
      schemas,
      responses: {
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
      },
    };

    const swaggerDocument: OpenAPIV3.Document = {
      openapi: '3.0.0',
      info: {
        title: 'Ed-Fi Alliance Data Management Service',
        description: 'Ed-Fi Alliance Data Management Service',
        version: '0',
      },
      servers: [
        {
          url: 'http://localhost:5198/',
        },
      ],
      paths,
      components,
    };

    namespace.data.edfiApiSchema.openApiSpecification = swaggerDocument;
  });
  return {
    enhancerName: 'OpenApiSpecificationEnhancer',
    success: true,
  };
}
