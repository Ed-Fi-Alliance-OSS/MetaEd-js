import R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { getAllTopLevelEntitiesForNamespaces } from '@edfi/metaed-core';
import { TopLevelEntityEdfiXsd } from '../model/TopLevelEntity';

const enhancerName = 'SubclassIdentityEnhancer';

function addBaseIdentityProperties(topLevelEntity: TopLevelEntity) {
  if (!topLevelEntity.baseEntity) return;
  addBaseIdentityProperties(topLevelEntity.baseEntity);
  const identityRenames = topLevelEntity.identityProperties.filter((x) => x.isIdentityRename);
  if (!topLevelEntity.baseEntity) return; // makes Flow happy
  const baseIdentities = (topLevelEntity.baseEntity.data.edfiXsd as TopLevelEntityEdfiXsd).xsdIdentityProperties;
  const identitiesWithoutRenamed = baseIdentities.filter((x) =>
    identityRenames.every((y) => y.baseKeyName !== x.metaEdName),
  );
  // Only add properties that haven't been previously added
  const entityEdfiXsd = topLevelEntity.data.edfiXsd as TopLevelEntityEdfiXsd;
  entityEdfiXsd.xsdIdentityProperties = R.union(entityEdfiXsd.xsdIdentityProperties, identitiesWithoutRenamed);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach((entity) => {
    addBaseIdentityProperties(entity);
  });

  return {
    enhancerName,
    success: true,
  };
}
