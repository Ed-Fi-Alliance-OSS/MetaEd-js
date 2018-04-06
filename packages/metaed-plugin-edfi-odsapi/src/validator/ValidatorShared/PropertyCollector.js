// @flow

// 2.x - METAED-711 - ODS-1732
import { asReferentialProperty } from 'metaed-core';
import type { TopLevelEntity, EntityProperty } from 'metaed-core';

export function collectSingleEntity(
  entity: TopLevelEntity,
  includeAllProperties: boolean,
  entityStrategy: (entity: TopLevelEntity, property: EntityProperty) => any,
  propertyStrategy: (entity: TopLevelEntity, property: EntityProperty) => any,
): { referencedEntities: Array<any>, properties: Array<any> } {
  if (entity == null) return { referencedEntities: [], properties: [] };
  const referencedEntities: Array<any> = [];
  const properties: Array<any> = [];

  entity.properties.forEach((property: EntityProperty) => {
    if (
      (asReferentialProperty(property).referencedEntity != null &&
        asReferentialProperty(property).referencedEntity.properties != null &&
        ['choice', 'inlineCommon'].includes(entity.type)) ||
      ((includeAllProperties || property.isPartOfIdentity || property.isIdentityRename) &&
        ['association', 'descriptor', 'domainEntity', 'enumeration'].includes(property.type))
    ) {
      referencedEntities.push(entityStrategy(asReferentialProperty(property).referencedEntity, property));
    } else if (includeAllProperties || property.isPartOfIdentity) {
      properties.push(propertyStrategy(asReferentialProperty(property).referencedEntity, property));
    }
  });

  return { referencedEntities, properties };
}

export function propertyCollector(entity: TopLevelEntity): Array<EntityProperty> {
  if (entity == null) return [];
  const entities: Array<TopLevelEntity> = [entity];
  const properties: Array<EntityProperty> = [];

  while (entities.length > 0) {
    const currentEntity: TopLevelEntity = entities.shift();
    const result: { referencedEntities: Array<any>, properties: Array<any> } = collectSingleEntity(
      currentEntity,
      false,
      // eslint-disable-next-line no-unused-vars
      (referencedEntity, property) => referencedEntity,
      (referencedEntity, property) => property,
    );

    entities.push(...result.referencedEntities);
    properties.push(...result.properties);
  }

  return properties;
}
