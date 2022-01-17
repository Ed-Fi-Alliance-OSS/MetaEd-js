// 2.x - METAED-711 - ODS-1732
import { asReferentialProperty } from '@edfi/metaed-core';
import { TopLevelEntity, EntityProperty } from '@edfi/metaed-core';

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

export function propertyCollector(entity: TopLevelEntity): EntityProperty[] {
  if (entity == null) return [];
  const entities: TopLevelEntity[] = [entity];
  const properties: EntityProperty[] = [];

  while (entities.length > 0) {
    const currentEntity: TopLevelEntity = entities.shift() as TopLevelEntity;
    const result: { referencedEntities: any[]; properties: any[] } = collectSingleEntity(
      currentEntity,
      false,
      // @ts-ignore - "property" never read
      (referencedEntity, property) => referencedEntity,
      // @ts-ignore - "referencedEntity" never read
      (referencedEntity, property) => property,
    );

    entities.push(...result.referencedEntities);
    properties.push(...result.properties);
  }

  return properties;
}
