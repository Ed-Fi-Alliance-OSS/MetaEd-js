// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  getEntitiesOfTypeForNamespaces,
} from '@edfi/metaed-core';
import { ComponentsObject, Document, PathsObject, Schemas, TagObject } from '../model/OpenApiTypes';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import {
  createHardcodedParameterResponses,
  createHardcodedComponentParameters,
  createSchemasFrom,
  createPathsFrom,
  createTagsFrom,
  sortTagsByName,
} from './OpenApiSpecificationEnhancerBase';

import { newSchoolYearOpenApis, SchoolYearOpenApis } from './OpenApiComponentEnhancerBase';

/**
 * Assembles an OpenAPI document from schemas, paths and tags
 */
function openApiDocumentFrom(schemas: Schemas, paths: PathsObject, tags: TagObject[]): Document {
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
    const resourceSchemas: Schemas = {};
    const resourcePaths: PathsObject = {};
    const resourceTags: TagObject[] = [];

    // All the entities that go in the "resources" OpenAPI schema
    getEntitiesOfTypeForNamespaces(
      [namespace],
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
      'schoolYearEnumeration',
    ).forEach((entity: TopLevelEntity) => {
      Object.assign(resourceSchemas, createSchemasFrom(entity));
      Object.assign(resourcePaths, createPathsFrom(entity));
      resourceTags.push(...createTagsFrom(entity));
    });

    const schoolYearOpenApis: SchoolYearOpenApis = newSchoolYearOpenApis(metaEd.minSchoolYear, metaEd.maxSchoolYear);
    Object.assign(resourceSchemas, {
      EdFi_SchoolYearTypeReference: schoolYearOpenApis.schoolYearEnumerationOpenApi,
    });

    namespaceEdfiApiSchema.openApiCoreResources = openApiDocumentFrom(resourceSchemas, resourcePaths, resourceTags);

    const descriptorSchemas: Schemas = {};
    const descriptorPaths: PathsObject = {};
    const descriptorTags: TagObject[] = [];

    // And in the "descriptor" OpenAPI schema
    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity: TopLevelEntity) => {
      Object.assign(descriptorSchemas, createSchemasFrom(entity));
      Object.assign(descriptorPaths, createPathsFrom(entity));
      descriptorTags.push(...createTagsFrom(entity));
    });

    namespaceEdfiApiSchema.openApiCoreDescriptors = openApiDocumentFrom(descriptorSchemas, descriptorPaths, descriptorTags);
  });

  return {
    enhancerName: 'OpenApiCoreSpecificationEnhancer',
    success: true,
  };
}
