import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import { ComponentsObject, Document } from '../model/OpenApiTypes';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import {
  createHardcodedParameterResponses,
  createHardcodedComponentParameters,
  createSchemasPathsTagsFrom,
  sortTagsByName,
} from './OpenApiSpecificationEnhancerBase';
import { SchemasPathsTags } from '../model/SchemasPathsTags';

/**
 * Assembles an OpenAPI document from schemas, paths and tags
 */
function openApiDocumentFrom({ schemas, paths, tags }: SchemasPathsTags): Document {
  const components: ComponentsObject = {
    schemas,
    responses: createHardcodedParameterResponses(),
    parameters: createHardcodedComponentParameters(),
  };

  const openApiDocument: Document = {
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
    tags: sortTagsByName(tags),
  };
  return openApiDocument;
}

/**
 * Enhancer that creates the resource and descriptor OpenAPI specs for a data standard.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.isExtension) return;

    const namespaceEdfiApiSchema: NamespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
    const resourceSchemaPathsTags: SchemasPathsTags = { schemas: {}, paths: {}, tags: [] };
    const descriptorSchemaPathsTags: SchemasPathsTags = { schemas: {}, paths: {}, tags: [] };

    // All the entities that go in the "resources" OpenAPI schema
    getEntitiesOfTypeForNamespaces(
      [namespace],
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
      'schoolYearEnumeration',
    ).forEach((entity: TopLevelEntity) => {
      const { schemas, paths, tags } = createSchemasPathsTagsFrom(entity);
      Object.assign(resourceSchemaPathsTags.schemas, schemas);
      Object.assign(resourceSchemaPathsTags.paths, paths);
      resourceSchemaPathsTags.tags.push(...tags);
    });
    namespaceEdfiApiSchema.openApiCoreResources = openApiDocumentFrom(resourceSchemaPathsTags);

    // And in the "descriptor" OpenAPI schema
    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity: TopLevelEntity) => {
      const { schemas, paths, tags } = createSchemasPathsTagsFrom(entity);
      Object.assign(descriptorSchemaPathsTags.schemas, schemas);
      Object.assign(descriptorSchemaPathsTags.paths, paths);
      descriptorSchemaPathsTags.tags.push(...tags);
    });
    namespaceEdfiApiSchema.openApiCoreDescriptors = openApiDocumentFrom(descriptorSchemaPathsTags);
  });

  return {
    enhancerName: 'OpenApiCoreSpecificationEnhancer',
    success: true,
  };
}
