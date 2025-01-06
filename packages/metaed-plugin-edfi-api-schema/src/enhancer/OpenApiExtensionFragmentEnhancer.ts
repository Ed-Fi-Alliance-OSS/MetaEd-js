import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import type { ProjectNamespace } from '../model/api-schema/ProjectNamespace';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { PathsObject, Schemas } from '../model/OpenApiTypes';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import {
  createDeleteSectionFor,
  createGetByIdSectionFor,
  createGetByQuerySectionFor,
  createPostSectionFor,
  createPutSectionFor,
} from './OpenApiSpecificationEnhancerBase';
import { ExtensionOpenApiFragments, Exts } from '../model/ExtensionOpenApiFragments';

/**
 * Enhancer that creates the OpenApi spec for an extension.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (!namespace.isExtension) return;

    const paths: PathsObject = {};
    const newSchemas: Schemas = {};

    /**
     * Paths and schemas for new extension endpoints
     */
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
      newSchemas[openApiReferenceComponentPropertyName] = openApiReferenceComponent;
      newSchemas[openApiRequestBodyComponentPropertyName] = openApiRequestBodyComponent;
    });

    const exts: Exts = {};
    const extSchemas: Schemas = {};

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntityExtension', 'associationExtension').forEach(
      (entity: TopLevelEntity) => {
        const { openApiReferenceComponent, openApiReferenceComponentPropertyName, openApiRequestBodyComponent } = entity.data
          .edfiApiSchema as EntityApiSchemaData;

        // Add references - might be duplicates of what is already in data standard OpenApi
        extSchemas[openApiReferenceComponentPropertyName] = openApiReferenceComponent;

        exts[entity.metaEdName] = openApiRequestBodyComponent;
      },
    );

    const extensionOpenApiFragments: ExtensionOpenApiFragments = {
      paths,
      newSchemas,
      exts,
      extSchemas,
    };

    (namespace.data.edfiApiSchema as NamespaceEdfiApiSchema).extensionOpenApiFragments = extensionOpenApiFragments;
  });
  return {
    enhancerName: 'OpenApiExtensionFragmentEnhancer',
    success: true,
  };
}
