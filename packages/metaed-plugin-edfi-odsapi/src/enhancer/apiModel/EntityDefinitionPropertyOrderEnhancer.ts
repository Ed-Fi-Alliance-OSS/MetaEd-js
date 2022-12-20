import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import * as R from 'ramda';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

const enhancerName = 'EntityDefinitionPropertyOrderEnhancer';

const sortByPropertyName = R.sortBy(R.pipe(R.prop('propertyName'), R.toLower));

const sortByIdentifierName = R.sortBy(R.pipe(R.prop('identifierName'), R.toLower));

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const { entityDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

    entityDefinitions.forEach((entityDefinition: EntityDefinition) => {
      entityDefinition.locallyDefinedProperties = sortByPropertyName(entityDefinition.locallyDefinedProperties);
      entityDefinition.identifiers = sortByIdentifierName(entityDefinition.identifiers);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
