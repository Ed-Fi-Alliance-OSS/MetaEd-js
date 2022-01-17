import {
  EnhancerResult,
  MetaEdEnvironment,
  getAllEntitiesOfType,
  getAllTopLevelEntitiesForNamespaces,
  ReferentialProperty,
  SimpleProperty,
  ModelBase,
  SharedSimple,
} from '@edfi/metaed-core';

const enhancerName = 'OutReferencePathEnhancer';

function addToOutReferenceEntityEndpointsMap(
  outReferenceEntityEndpointsMap: Map<ModelBase, (ReferentialProperty | SimpleProperty)[][]>,
  outReferencePath: (ReferentialProperty | SimpleProperty)[],
) {
  const endpointOfPath = outReferencePath[outReferencePath.length - 1].referencedEntity;
  if (!outReferenceEntityEndpointsMap.has(endpointOfPath)) {
    outReferenceEntityEndpointsMap.set(endpointOfPath, []);
  }
  (outReferenceEntityEndpointsMap.get(endpointOfPath) as (ReferentialProperty | SimpleProperty)[][]).push(outReferencePath);
}

function addToOutReferenceEntitiesMap(
  outReferenceEntitiesMap: Map<ModelBase, (ReferentialProperty | SimpleProperty)[][]>,
  outReferencePath: (ReferentialProperty | SimpleProperty)[],
) {
  outReferencePath.forEach((property) => {
    if (!outReferenceEntitiesMap.has(property.referencedEntity)) {
      outReferenceEntitiesMap.set(property.referencedEntity, []);
    }
    (outReferenceEntitiesMap.get(property.referencedEntity) as (ReferentialProperty | SimpleProperty)[][]).push(
      outReferencePath,
    );
  });
}

function buildUpPaths(
  inReferences: (ReferentialProperty | SimpleProperty)[],
  pathSoFar: (ReferentialProperty | SimpleProperty)[],
  visitList: ModelBase[],
) {
  inReferences.forEach((inReference) => {
    // avoid cycles
    if (visitList.includes(inReference.parentEntity)) return;

    // prepend to path
    const outReferencePath = [inReference, ...pathSoFar];
    inReference.parentEntity.outReferencePaths.push(outReferencePath);
    addToOutReferenceEntitiesMap(inReference.parentEntity.outReferenceEntitiesMap, outReferencePath);
    addToOutReferenceEntityEndpointsMap(inReference.parentEntity.outReferenceEntityEndpointsMap, outReferencePath);
    buildUpPaths(inReference.parentEntity.inReferences, outReferencePath, [...visitList, inReference.parentEntity]);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces([...metaEd.namespace.values()]).forEach((entity) => {
    // only leaf entities
    if (entity.outReferences.length > 0) return;
    buildUpPaths(entity.inReferences, [], []);
  });

  getAllEntitiesOfType(metaEd, 'sharedInteger', 'sharedDecimal', 'sharedString').forEach((entity) => {
    const sharedSimpleEntity = entity as SharedSimple;
    buildUpPaths(sharedSimpleEntity.inReferences, [], []);
  });

  return {
    enhancerName,
    success: true,
  };
}
