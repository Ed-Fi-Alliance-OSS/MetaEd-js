import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import { createSchemasPathsTagsFrom, sortTagsByName } from './OpenApiSpecificationEnhancerBase';
import { Exts } from '../model/OpenApiExtensionFragments';
import { SchemasPathsTags } from '../model/SchemasPathsTags';

/**
 * Enhancer that creates the OpenApi spec fragments for an extension.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (!namespace.isExtension) return;

    const namespaceEdfiApiSchema: NamespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
    const resourceSchemaPathsTags: SchemasPathsTags = { schemas: {}, paths: {}, tags: [] };
    const descriptorSchemaPathsTags: SchemasPathsTags = { schemas: {}, paths: {}, tags: [] };

    // Paths and schemas for new extension endpoints
    getEntitiesOfTypeForNamespaces(
      [namespace],
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
    ).forEach((entity: TopLevelEntity) => {
      const { schemas, paths, tags } = createSchemasPathsTagsFrom(entity);
      Object.assign(resourceSchemaPathsTags.schemas, schemas);
      Object.assign(resourceSchemaPathsTags.paths, paths);
      resourceSchemaPathsTags.tags.push(...tags);
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

    namespaceEdfiApiSchema.openApiExtensionResourceFragments = {
      newPaths: resourceSchemaPathsTags.paths,
      newSchemas: resourceSchemaPathsTags.schemas,
      exts,
      newTags: resourceSchemaPathsTags.tags,
    };

    // Paths and schemas for new descriptor endpoints
    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity: TopLevelEntity) => {
      const { schemas, paths, tags } = createSchemasPathsTagsFrom(entity);
      Object.assign(descriptorSchemaPathsTags.schemas, schemas);
      Object.assign(descriptorSchemaPathsTags.paths, paths);
      descriptorSchemaPathsTags.tags.push(...tags);
    });

    namespaceEdfiApiSchema.openApiExtensionDescriptorFragments = {
      newPaths: descriptorSchemaPathsTags.paths,
      newSchemas: descriptorSchemaPathsTags.schemas,
      exts: {},
      newTags: sortTagsByName(descriptorSchemaPathsTags.tags),
    };
  });
  return {
    enhancerName: 'OpenApiExtensionFragmentEnhancer',
    success: true,
  };
}
