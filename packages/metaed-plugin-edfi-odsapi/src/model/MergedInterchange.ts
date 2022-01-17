import { MetaEdEnvironment, EnhancerResult, InterchangeItem, Namespace } from '@edfi/metaed-core';
import { EdFiXsdEntityRepository, MergedInterchange } from '@edfi/metaed-plugin-edfi-xsd';
import { edfiXsdRepositoryForNamespace } from '@edfi/metaed-plugin-edfi-xsd';

export interface MergedInterchangeEdfiOdsApi extends MergedInterchange {
  apiOrder: number;
  apiOrderedElements: InterchangeItem[];
}

const enhancerName = 'MergedInterchangeSetupEnhancer';

export function addMergedInterchangeEdfiOdsApiTo(mergedInterchange: MergedInterchange) {
  if (mergedInterchange.data.edfiOdsApi == null) mergedInterchange.data.edfiOdsApi = {};

  Object.assign(mergedInterchange.data.edfiOdsApi, {
    apiOrder: 0,
    apiOrderedElements: [],
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const edfiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edfiXsdEntityRepository == null) return;

    edfiXsdEntityRepository.mergedInterchange.forEach((mergedInterchange: MergedInterchange) => {
      addMergedInterchangeEdfiOdsApiTo(mergedInterchange);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
