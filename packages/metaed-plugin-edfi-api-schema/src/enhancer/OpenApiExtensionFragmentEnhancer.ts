import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import type { ProjectEndpointName } from '../model/api-schema/ProjectEndpointName';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { PathsObject, Schemas, TagObject } from '../model/OpenApiTypes';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import {
  createDeleteSectionFor,
  createGetByIdSectionFor,
  createGetByQuerySectionFor,
  createPostSectionFor,
  createPutSectionFor,
} from './OpenApiSpecificationEnhancerBase';
import { OpenApiExtensionFragments, Exts } from '../model/OpenApiExtensionFragments';

/**
 * Enhancer that creates the OpenApi spec for an extension.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (!namespace.isExtension) return;

    const newPaths: PathsObject = {};
    const newSchemas: Schemas = {};
    const newTags: TagObject[] = [];

    // Paths and schemas for new extension endpoints
    getEntitiesOfTypeForNamespaces(
      [namespace],
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
    ).forEach((entity: TopLevelEntity) => {
      const projectEndpointName: ProjectEndpointName = entity.namespace.projectName.toLowerCase() as ProjectEndpointName;
      const { endpointName } = entity.data.edfiApiSchema as EntityApiSchemaData;

      // Add to paths without "id"
      newPaths[`/${projectEndpointName}/${endpointName}`] = {
        post: createPostSectionFor(entity, endpointName),
        get: createGetByQuerySectionFor(entity, endpointName),
      };

      newPaths[`/${projectEndpointName}/${endpointName}/{id}`] = {
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

      // Add to global tags
      newTags.push({
        name: endpointName,
        description: entity.documentation,
      });
    });

    const exts: Exts = {};

    // Schemas for extensions to existing endpoints
    getEntitiesOfTypeForNamespaces([namespace], 'domainEntityExtension', 'associationExtension').forEach(
      (entity: TopLevelEntity) => {
        exts[`${entity.baseEntityNamespaceName}_${entity.metaEdName}`] = (
          entity.data.edfiApiSchema as EntityApiSchemaData
        ).openApiRequestBodyComponent;
      },
    );

    const openApiExtensionFragments: OpenApiExtensionFragments = {
      newPaths,
      newSchemas,
      exts,
      newTags,
    };

    (namespace.data.edfiApiSchema as NamespaceEdfiApiSchema).openApiExtensionFragments = openApiExtensionFragments;
  });
  return {
    enhancerName: 'OpenApiExtensionFragmentEnhancer',
    success: true,
  };
}
