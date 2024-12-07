import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { OpenAPIV3 } from 'openapi-types';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import { ProjectNamespace } from '../model/api-schema/ProjectNamespace';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const { apiSchema } = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
    const projectNamespace: ProjectNamespace = namespace.projectName.toLowerCase() as ProjectNamespace;

    const paths: OpenAPIV3.PathsObject = Object.fromEntries(
      Object.entries(apiSchema.projectSchemas[projectNamespace].caseInsensitiveEndpointNameMapping).map(([k]) => [
        `/${projectNamespace}/${k}`,
        {
          post: {
            description:
              'The POST operation can be used to create or update resources. In database terms, this is often referred to as an "upsert" operation (insert + update). Clients should NOT include the resource "id" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.',
            operationId: `post-${k}`,
            requestBody: {
              description: `The JSON representation of the ${k} resource to be created or updated.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/edFi_${k}`,
                  },
                },
              },
              required: true,
              'x-bodyName': k,
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
                description:
                  'Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.',
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
            tags: [`${k}`],
          },
        },
      ]),
    );

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
    };
    namespace.data.openApiSpecification = swaggerDocument;
  });

  return {
    enhancerName: 'OpenApiSpecificationEnhancer',
    success: true,
  };
}
