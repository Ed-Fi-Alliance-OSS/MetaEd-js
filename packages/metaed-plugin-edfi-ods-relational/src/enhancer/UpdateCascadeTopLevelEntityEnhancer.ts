import R from 'ramda';
import { asReferentialProperty, getAllTopLevelEntitiesForNamespaces, getAllEntitiesOfType } from 'metaed-core';
import { EnhancerResult, EntityProperty, MetaEdEnvironment, TopLevelEntity } from 'metaed-core';
import { isOdsReferenceProperty } from '../model/property/ReferenceProperty';

const enhancerName = 'UpdateCascadeTopLevelEntityEnhancer';

export interface Edge<T> {
  source: T;
  target: T;
}
export interface BidirectionalGraph<T> {
  vertices: T[];
  edges: Edge<T>[];
}
export function inEdges<T>(graph: BidirectionalGraph<T>, vertex: T): Edge<T>[] {
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
  const associationAndDeEntities: TopLevelEntity[] = getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
  ) as TopLevelEntity[];

  const declaredCascadingEntities: TopLevelEntity[] = associationAndDeEntities.filter(
    (x: TopLevelEntity) => x.allowPrimaryKeyUpdates,
  );

  const referenceEntityProperties: EntityProperty[] = R.chain(
    (entity: TopLevelEntity) =>
      entity.data.edfiOdsRelational.odsProperties.filter((property: EntityProperty) => isOdsReferenceProperty(property)),
    getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())),
  );

  declaredCascadingEntities.forEach((declaredCascadingEntity: TopLevelEntity) => {
    declaredCascadingEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates = true;

    const cascadeGraph: BidirectionalGraph<TopLevelEntity> = { vertices: [], edges: [] };
    cascadeGraph.vertices.push(declaredCascadingEntity);

    let topLevelCascadingEntities: TopLevelEntity[] = [];
    topLevelCascadingEntities.push(declaredCascadingEntity);
    while (R.not(R.isEmpty(topLevelCascadingEntities))) {
      const newCascades: TopLevelEntity[] = [];

      // eslint-disable-next-line no-loop-func
      referenceEntityProperties.forEach((referenceEntityProperty: EntityProperty) => {
        if (!topLevelCascadingEntities.includes(asReferentialProperty(referenceEntityProperty).referencedEntity)) return;
        if (!referenceEntityProperty.isPartOfIdentity && !referenceEntityProperty.isIdentityRename) return;

        referenceEntityProperty.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates = true;
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
      const edgesToPrune: Edge<TopLevelEntity>[] = R.compose(
        R.tail,
        R.sortBy(R.compose(R.toLower, R.path(['source', 'data', 'edfiOdsRelational', 'odsTableId']))),
      )(inEdges(cascadeGraph, multipleCascadeTopLevelEntity));

      edgesToPrune.forEach((edge: Edge<TopLevelEntity>) => {
        multipleCascadeTopLevelEntity.data.edfiOdsRelational.odsIdentityProperties.forEach((property: EntityProperty) => {
          if (!isOdsReferenceProperty(property) || asReferentialProperty(property).referencedEntity !== edge.source) return;

          property.data.edfiOdsRelational.odsCausesCyclicUpdateCascade = true;
          cascadeGraph.edges = R.reject((x) => x.edge === edge)(cascadeGraph).edges;
        });
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
