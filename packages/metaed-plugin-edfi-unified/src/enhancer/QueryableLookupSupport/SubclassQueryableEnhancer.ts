// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, EntityProperty, MetaEdEnvironment, TopLevelEntity } from '@edfi/metaed-core';
import { getAllEntitiesForNamespaces } from '@edfi/metaed-core';

const enhancerName = 'SubclassQueryableEnhancer';

function includeBaseClassQueryableFields(entity: TopLevelEntity, queryableProperties: EntityProperty[]): EntityProperty[] {
  const { baseEntity }: TopLevelEntity = entity;
  if (!baseEntity) return queryableProperties;
  const entityIdentityRenames = entity.identityProperties.filter((x) => x.isIdentityRename).map((x) => x.baseKeyName);
  queryableProperties.push(...baseEntity.queryableFields.filter((x) => !entityIdentityRenames.includes(x.metaEdName)));
  return includeBaseClassQueryableFields(baseEntity, queryableProperties);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesForNamespaces(Array.from(metaEd.namespace.values()))
    .map((x) => x as TopLevelEntity)
    .filter((x) => x.baseEntity && x.baseEntity.queryableFields)
    .forEach((entity) => entity.queryableFields.push(...includeBaseClassQueryableFields(entity, [])));

  return {
    enhancerName,
    success: true,
  };
}
