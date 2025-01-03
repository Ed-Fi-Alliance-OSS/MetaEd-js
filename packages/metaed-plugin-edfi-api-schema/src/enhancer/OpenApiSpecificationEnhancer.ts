import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import type { ProjectNamespace } from '../model/api-schema/ProjectNamespace';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { PathsObject, ComponentsObject, Document, Schemas } from '../model/OpenApiTypes';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import {
  createDeleteSectionFor,
  createGetByIdSectionFor,
  createGetByQuerySectionFor,
  createPostSectionFor,
  createPutSectionFor,
  createResponses,
} from './OpenApiSpecificationEnhancerBase';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const paths: PathsObject = {};
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

      // Add to paths without "id"
      paths[`/${projectNamespace}/${endpointName}`] = {
        post: createPostSectionFor(entity, endpointName),
        get: createGetByQuerySectionFor(entity, endpointName),
      };

      paths[`/${projectNamespace}/${endpointName}/{id}`] = {
        get: createGetByIdSectionFor(entity, endpointName),
        put: createPutSectionFor(entity, endpointName),
        delete: createDeleteSectionFor(entity, endpointName),
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

    const components: ComponentsObject = {
      schemas,
      responses: createResponses(),
    };

    const swaggerDocument: Document = {
      openapi: '3.0.0',
      info: {
        title: '',
        description: '',
        version: '',
      },
      servers: [
        {
          url: '',
        },
      ],
      paths,
      components,
    };

    (namespace.data.edfiApiSchema as NamespaceEdfiApiSchema).coreOpenApiSpecification = swaggerDocument;
  });
  return {
    enhancerName: 'OpenApiSpecificationEnhancer',
    success: true,
  };
}
