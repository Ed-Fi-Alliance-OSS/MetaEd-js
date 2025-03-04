import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import type { ProjectEndpointName } from '../model/api-schema/ProjectEndpointName';
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
 * The three sections of an OpenAPI document that need to be filled in
 */
type SchemasPathsTags = {
  schemas: Schemas;
  paths: PathsObject;
  tags: TagObject[];
};

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
    tags,
  };
  return openApiDocument;
}

/**
 * Creates the schemas, paths and tags from a given TopLevelEntity
 */
function createSchemasPathsTagsFrom(entity: TopLevelEntity): SchemasPathsTags {
  const schemas: Schemas = {};
  const paths: PathsObject = {};
  const tags: TagObject[] = [];

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

  const {
    openApiReferenceComponent,
    openApiReferenceComponentPropertyName,
    openApiRequestBodyComponent,
    openApiRequestBodyComponentPropertyName,
  } = entity.data.edfiApiSchema as EntityApiSchemaData;

  // Add to Schemas
  if (openApiReferenceComponentPropertyName !== '') {
    // Not all entities have a reference component (e.g. descriptors, school year enumeration)
    schemas[openApiReferenceComponentPropertyName] = openApiReferenceComponent;
  }
  schemas[openApiRequestBodyComponentPropertyName] = openApiRequestBodyComponent;

  // Add to global tags
  tags.push({
    name: endpointName,
    description: entity.documentation,
  });

  return { schemas, paths, tags };
}

/**
 * Enhancer that creates the resource and descriptor OpenAPI specs for a data standard.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.isExtension) return;

    const namespaceEdfiApiSchema: NamespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
    const coreResourceSchemaPathsTags: SchemasPathsTags = { schemas: {}, paths: {}, tags: [] };
    const coreDescriptorSchemaPathsTags: SchemasPathsTags = { schemas: {}, paths: {}, tags: [] };

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
      Object.assign(coreResourceSchemaPathsTags.schemas, schemas);
      Object.assign(coreResourceSchemaPathsTags.paths, paths);
      coreResourceSchemaPathsTags.tags.push(...tags);
    });
    namespaceEdfiApiSchema.openApiCoreResources = openApiDocumentFrom(coreResourceSchemaPathsTags);

    // And in the "descriptor" OpenAPI schema
    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity: TopLevelEntity) => {
      const { schemas, paths, tags } = createSchemasPathsTagsFrom(entity);
      Object.assign(coreDescriptorSchemaPathsTags.schemas, schemas);
      Object.assign(coreDescriptorSchemaPathsTags.paths, paths);
      coreDescriptorSchemaPathsTags.tags.push(...tags);
    });
    namespaceEdfiApiSchema.openApiCoreDescriptors = openApiDocumentFrom(coreDescriptorSchemaPathsTags);
  });

  return {
    enhancerName: 'OpenApiCoreSpecificationEnhancer',
    success: true,
  };
}
