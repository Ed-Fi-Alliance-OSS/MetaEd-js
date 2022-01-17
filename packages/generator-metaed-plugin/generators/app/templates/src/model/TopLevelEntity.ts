import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, getAllTopLevelEntitiesForNamespaces } from '@edfi/metaed-core';

// Model that defines a new data element that hangs off of a TopLevelEntity
// File named the same as the parent object type
// Exactly one parent object type per file

// Definition of an additional data element for all top level entities
export type TopLevelEntityEdfiOdsApi = {
  exampleName: string;
};

// Model object initialization is a "setup" enhancer named prefixed as the parent object type
const enhancerName = 'TopLevelEntitySetupEnhancer';

// exampleName is defined as not null, so intitalize TopLevelEntity with an empty string,
// creating the plugin-specfic slot "orgExample" (the plugin shortname) on the "data" sub-object, if not already there
export function addTopLevelEntityOrgExampleTo(topLevelEntity: TopLevelEntity) {
  if (topLevelEntity.data.orgExample == null) topLevelEntity.data.orgExample = {};

  Object.assign(topLevelEntity.data.orgExample, {
    exampleName: '',
  });
}

// standard enhancer function signature
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Loop over all TopLevelEntity objects in all namespaces
  getAllTopLevelEntitiesForNamespaces([...metaEd.namespace.values()]).forEach(entity => {
    // Initialize each entity
    addTopLevelEntityOrgExampleTo(entity);
  });

  return {
    enhancerName,
    success: true,
  };
}
