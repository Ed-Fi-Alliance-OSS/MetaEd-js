import { MetaEdEnvironment, EnhancerResult } from 'metaed-core';
import { getAllTopLevelEntitiesForNamespaces } from 'metaed-core';
import { TopLevelEntityEdfiXsd } from '../model/TopLevelEntity';

const enhancerName = 'CopyPropertiesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach(entity => {
    (entity.data.edfiXsd as TopLevelEntityEdfiXsd).xsdIdentityProperties.push(...entity.identityProperties);
  });

  return {
    enhancerName,
    success: true,
  };
}
