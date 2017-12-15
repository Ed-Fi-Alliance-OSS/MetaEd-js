// @flow
import R from 'ramda';
import {
  asReferentialProperty,
  asTopLevelEntity,
  getAllTopLevelEntities,
  getEntitiesOfType,
} from 'metaed-core';
import type
 {
  EnhancerResult,
  EntityProperty,
  MetaEdEnvironment,
  TopLevelEntity,
  ModelBase,
} from 'metaed-core';
import { isOdsReferenceProperty } from '../model/property/ReferenceProperty';

const enhancerName: string = 'UpdateCascadeTopLevelEntityEnhancer';

export type Edge<T> = {
  source: T,
  target: T,
}
export type BidirectionalGraph<T> = {
  vertices: Array<T>,
  edges: Array<Edge<T>>
}
export function inEdges<T>(graph: BidirectionalGraph<T>, vertex: T): Array<Edge<T>> {
  return graph.edges.filter((edge: Edge<T>) => edge.target === vertex);
}

// For Each Entity with CascadePrimaryKeyUpdates
//    For each identity property referencing that entity
//        Mark the entity containing that property as cascade primary key updates
//        Add for recurse
//        Add graph edge from root entity to entity containing the property
//    Recurse any entities that we found
// Find any entity with multiple reference edges pointing at it
// Sort by Ods_TableName, only allow the first to cascade, disable the rest by marking the property as Ods_CausesCyclicUpdateCascade = true
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const declaredCascadingEntities: Array<TopLevelEntity> = R.union(
    getEntitiesOfType(metaEd.entity, 'domainEntity').filter((x: ModelBase) => asTopLevelEntity(x).allowPrimaryKeyUpdates),
    getEntitiesOfType(metaEd.entity, 'association').filter((x: ModelBase) => asTopLevelEntity(x).allowPrimaryKeyUpdates),
  );

  const referenceEntityProperties: Array<EntityProperty> = R.chain(
    (entity: TopLevelEntity) => entity.data.edfiOds.ods_Properties.filter((property: EntityProperty) => isOdsReferenceProperty(property)),
    getAllTopLevelEntities(metaEd.entity),
  );

  declaredCascadingEntities.forEach((declaredCascadingEntity: TopLevelEntity) => {
    declaredCascadingEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates = true;

    const cascadeGraph: BidirectionalGraph<TopLevelEntity> = { vertices: [], edges: [] };
    cascadeGraph.vertices.push(declaredCascadingEntity);

    let topLevelCascadingEntities: Array<TopLevelEntity> = [];
    topLevelCascadingEntities.push(declaredCascadingEntity);
    while (R.not(R.isEmpty(topLevelCascadingEntities))) {
      const newCascades: Array<TopLevelEntity> = [];

      // eslint-disable-next-line no-loop-func
      referenceEntityProperties.forEach((referenceEntityProperty: EntityProperty) => {
        if (!topLevelCascadingEntities.includes(asReferentialProperty(referenceEntityProperty).referencedEntity)) return;
        if (!referenceEntityProperty.isPartOfIdentity && !referenceEntityProperty.isIdentityRename) return;

        referenceEntityProperty.parentEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates = true;
        newCascades.push(referenceEntityProperty.parentEntity);

        cascadeGraph.vertices.push(referenceEntityProperty.parentEntity);
        cascadeGraph.edges.push({
          source: asReferentialProperty(referenceEntityProperty).referencedEntity,
          target: referenceEntityProperty.parentEntity,
        });
      });

      topLevelCascadingEntities = newCascades;
    }

    const multipleCascadePathVertices = cascadeGraph.vertices.filter(
      (vertex: TopLevelEntity) => inEdges(cascadeGraph, vertex).length > 1,
    );
    multipleCascadePathVertices.forEach((multipleCascadeTopLevelEntity: TopLevelEntity) => {
      const edgesToPrune: Array<Edge<TopLevelEntity>> = R.compose(
        R.tail,
        R.sortBy(R.compose(R.toLower, R.path(['source', 'data', 'edfiOds', 'ods_TableName']))),
      )(inEdges(cascadeGraph, multipleCascadeTopLevelEntity));

      edgesToPrune.forEach((edge: Edge<TopLevelEntity>) => {
        multipleCascadeTopLevelEntity.data.edfiOds.ods_IdentityProperties.forEach((property: EntityProperty) => {
          if (!isOdsReferenceProperty(property)
            || asReferentialProperty(property).referencedEntity !== edge.source) return;

          property.data.edfiOds.ods_CausesCyclicUpdateCascade = true;
          cascadeGraph.edges = R.reject(x => x.edge === edge)(cascadeGraph).edges;
        });
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
