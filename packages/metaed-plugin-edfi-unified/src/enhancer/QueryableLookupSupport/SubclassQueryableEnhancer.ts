import { EnhancerResult, EntityProperty, MetaEdEnvironment, TopLevelEntity } from 'metaed-core';
import { asTopLevelEntity, getAllEntitiesForNamespaces } from 'metaed-core';

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
    .map((x) => asTopLevelEntity(x))
    .filter((x) => x.baseEntity && x.baseEntity.queryableFields)
    .forEach((entity) => entity.queryableFields.push(...includeBaseClassQueryableFields(entity, [])));

  return {
    enhancerName,
    success: true,
  };
}
