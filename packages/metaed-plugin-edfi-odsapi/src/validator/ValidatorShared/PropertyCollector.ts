// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// 2.x - METAED-711 - ODS-1732
import { TopLevelEntity, EntityProperty, ReferentialProperty } from '@edfi/metaed-core';

export function collectSingleEntity(
  entity: TopLevelEntity,
  includeAllProperties: boolean,
  entityStrategy: (ent: TopLevelEntity, property: EntityProperty) => any,
  propertyStrategy: (ent: TopLevelEntity, property: EntityProperty) => any,
): { referencedEntities: any[]; properties: any[] } {
  if (entity == null) return { referencedEntities: [], properties: [] };
  const referencedEntities: any[] = [];
  const properties: any[] = [];

  entity.properties.forEach((property: EntityProperty) => {
    if (
      ((property as ReferentialProperty).referencedEntity != null &&
        (property as ReferentialProperty).referencedEntity.properties != null &&
        ['choice', 'inlineCommon'].includes(entity.type)) ||
      ((includeAllProperties || property.isPartOfIdentity || property.isIdentityRename) &&
        ['association', 'descriptor', 'domainEntity', 'enumeration'].includes(property.type))
    ) {
      referencedEntities.push(entityStrategy((property as ReferentialProperty).referencedEntity, property));
    } else if (includeAllProperties || property.isPartOfIdentity) {
      properties.push(propertyStrategy((property as ReferentialProperty).referencedEntity, property));
    }
  });

  return { referencedEntities, properties };
}

export function propertyCollector(entity: TopLevelEntity): EntityProperty[] {
  if (entity == null) return [];
  const entities: TopLevelEntity[] = [entity];
  const properties: EntityProperty[] = [];

  while (entities.length > 0) {
    const currentEntity: TopLevelEntity = entities.shift() as TopLevelEntity;
    const result: { referencedEntities: any[]; properties: any[] } = collectSingleEntity(
      currentEntity,
      false,
      (referencedEntity, _property) => referencedEntity,
      (_referencedEntity, property) => property,
    );

    entities.push(...result.referencedEntities);
    properties.push(...result.properties);
  }

  return properties;
}
