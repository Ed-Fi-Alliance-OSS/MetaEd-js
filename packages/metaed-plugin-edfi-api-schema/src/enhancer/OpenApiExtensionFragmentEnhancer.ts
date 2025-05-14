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
  DomainEntity,
} from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import { createSchemasFrom, createPathsFrom, createTagsFrom, sortTagsByName } from './OpenApiSpecificationEnhancerBase';
import { Exts } from '../model/OpenApiExtensionFragments';
import { PathsObject, Schemas, TagObject } from '../model/OpenApiTypes';

/**
 * Enhancer that creates the OpenApi spec fragments for an extension.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (!namespace.isExtension) return;

    const namespaceEdfiApiSchema: NamespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
    const resourceSchemas: Schemas = {};
    const resourcePaths: PathsObject = {};
    const resourceTags: TagObject[] = [];

    // Paths and schemas for new extension endpoints
    getEntitiesOfTypeForNamespaces(
      [namespace],
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
    ).forEach((entity: DomainEntity) => {
      Object.assign(resourceSchemas, createSchemasFrom(entity));
      if (entity.isAbstract) return;
      Object.assign(resourcePaths, createPathsFrom(entity));
      resourceTags.push(...createTagsFrom(entity));
    });

    const exts: Exts = {};

    // Schemas for extensions to existing endpoints
    getEntitiesOfTypeForNamespaces([namespace], 'domainEntityExtension', 'associationExtension').forEach(
      (entity: TopLevelEntity) => {
        exts[`${entity.baseEntityNamespaceName}_${entity.metaEdName}`] = (
          entity.data.edfiApiSchema as EntityApiSchemaData
        ).openApiRequestBodyComponent;

        Object.assign(resourceSchemas, createSchemasFrom(entity));
      },
    );

    namespaceEdfiApiSchema.openApiExtensionResourceFragments = {
      newPaths: resourcePaths,
      newSchemas: resourceSchemas,
      exts,
      newTags: sortTagsByName(resourceTags),
    };

    const descriptorSchemas: Schemas = {};
    const descriptorPaths: PathsObject = {};
    const descriptorTags: TagObject[] = [];

    // Paths and schemas for new descriptor endpoints
    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity: TopLevelEntity) => {
      Object.assign(descriptorSchemas, createSchemasFrom(entity));
      Object.assign(descriptorPaths, createPathsFrom(entity));
      descriptorTags.push(...createTagsFrom(entity));
    });

    namespaceEdfiApiSchema.openApiExtensionDescriptorFragments = {
      newPaths: descriptorPaths,
      newSchemas: descriptorSchemas,
      exts: {},
      newTags: sortTagsByName(descriptorTags),
    };
  });
  return {
    enhancerName: 'OpenApiExtensionFragmentEnhancer',
    success: true,
  };
}
