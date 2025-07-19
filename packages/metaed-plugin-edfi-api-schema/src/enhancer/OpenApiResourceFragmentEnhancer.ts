// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  type MetaEdEnvironment,
  type EnhancerResult,
  type TopLevelEntity,
  type Namespace,
  type DomainEntity,
  getEntitiesOfTypeForNamespaces,
  SchoolYearEnumeration,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { createSchemasFrom, createPathsFrom, createTagsFrom } from './OpenApiSpecificationEnhancerBase';
import { OpenApiFragment } from '../model/api-schema/OpenApiFragment';
import { newSchoolYearOpenApis, SchoolYearOpenApis } from './OpenApiComponentEnhancerBase';

/**
 * Creates an OpenAPI fragment for a resource entity
 */
export function createResourceFragment(entity: TopLevelEntity): OpenApiFragment {
  const fragment: OpenApiFragment = {
    components: {
      schemas: createSchemasFrom(entity),
    },
  };

  // Abstract entities only have schemas
  if ((entity as DomainEntity).isAbstract) return fragment;

  return {
    ...fragment,
    paths: createPathsFrom(entity),
    tags: createTagsFrom(entity),
  };
}

/**
 * Creates an OpenAPI fragment for a descriptor entity
 */
function createDescriptorFragment(entity: TopLevelEntity): OpenApiFragment {
  return {
    paths: createPathsFrom(entity),
    components: {
      schemas: createSchemasFrom(entity),
    },
    tags: createTagsFrom(entity),
  };
}

/**
 * Creates an OpenAPI fragment for an extension entity that extends another resource
 */
function createExtensionFragment(entity: TopLevelEntity): OpenApiFragment {
  const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

  const fragment: OpenApiFragment = {
    components: {
      schemas: createSchemasFrom(entity),
    },
  };

  // For extensions, add the extension schema to the exts mapping
  fragment.exts = {
    [`${entity.baseEntityNamespaceName}_${entity.metaEdName}`]: entityApiSchemaData.openApiRequestBodyComponent,
  };

  return fragment;
}

/**
 * Enhancer that creates OpenAPI fragments for each resource and stores them
 * on the entity data. These fragments will be picked up by ApiSchemaBuildingEnhancer
 * when it creates the ResourceSchema objects.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    // Process resource entities
    getEntitiesOfTypeForNamespaces(
      [namespace],
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
    ).forEach((entity: TopLevelEntity) => {
      const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
      entityApiSchemaData.openApiFragments.resources = createResourceFragment(entity);
    });

    // Process school year
    getEntitiesOfTypeForNamespaces([namespace], 'schoolYearEnumeration').forEach((entity: SchoolYearEnumeration) => {
      const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
      const fragment: OpenApiFragment = createResourceFragment(entity);

      const schoolYearOpenApis: SchoolYearOpenApis = newSchoolYearOpenApis(metaEd.minSchoolYear, metaEd.maxSchoolYear);
      Object.assign(fragment.components.schemas, {
        EdFi_SchoolYearTypeReference: schoolYearOpenApis.schoolYearEnumerationOpenApi,
      });

      entityApiSchemaData.openApiFragments.resources = fragment;
    });

    // Process descriptor entities
    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity: TopLevelEntity) => {
      const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
      entityApiSchemaData.openApiFragments.descriptors = createDescriptorFragment(entity);
    });

    // Process extension entities
    getEntitiesOfTypeForNamespaces([namespace], 'domainEntityExtension', 'associationExtension').forEach(
      (entity: TopLevelEntity) => {
        const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
        entityApiSchemaData.openApiFragments.resources = createExtensionFragment(entity);
      },
    );
  });

  return {
    enhancerName: 'OpenApiResourceFragmentEnhancer',
    success: true,
  };
}
