import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import type { ProjectNamespace } from '../model/api-schema/ProjectNamespace';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { PathsObject, ComponentsObject, Document, Schemas, TagObject } from '../model/OpenApiTypes';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import {
  createDeleteSectionFor,
  createGetByIdSectionFor,
  createGetByQuerySectionFor,
  createPostSectionFor,
  createPutSectionFor,
  createHardcodedParameterResponses,
  createHardcodedComponentParameters,
} from './OpenApiSpecificationEnhancerBase';

/**
 * Enhancer that creates the OpenApi spec for a data standard.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.isExtension) return;

    const paths: PathsObject = {};
    const schemas: Schemas = {};
    const tags: TagObject[] = [];

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

      // Add to global tags
      tags.push({
        name: endpointName,
        description: entity.documentation,
      });
    });

    const components: ComponentsObject = {
      schemas,
      responses: createHardcodedParameterResponses(),
      parameters: createHardcodedComponentParameters(),
    };

    const swaggerDocument: Document = {
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
      paths,
      components,
      tags,
    };

    (namespace.data.edfiApiSchema as NamespaceEdfiApiSchema).coreOpenApiSpecification = swaggerDocument;
  });
  return {
    enhancerName: 'OpenApiSpecificationEnhancer',
    success: true,
  };
}
