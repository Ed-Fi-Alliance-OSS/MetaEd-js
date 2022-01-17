import R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';
import { MergedInterchange } from '../model/MergedInterchange';
import { edfiXsdRepositoryForNamespace } from './EnhancerHelper';
import { combinedElementsAndIdentityTemplatesFor } from '../model/MergedInterchange';
import {
  unionOfInterchangeItems,
  differenceOfInterchangeItems,
  differenceOfInterchangeItemsNameOnly,
} from '../model/InterchangeItem';

const enhancerName = 'MergedInterchangeElementOrderEnhancer';

function orderExtensionElements(coreInterchanges: MergedInterchange[], extensionInterchanges: MergedInterchange[]) {
  extensionInterchanges.forEach((extension) => {
    const initialExtensionElements = combinedElementsAndIdentityTemplatesFor(extension);
    const matchingCoreInterchange = R.find(R.eqProps('metaEdName', extension), coreInterchanges);
    if (matchingCoreInterchange) {
      const initialCoreElements = combinedElementsAndIdentityTemplatesFor(matchingCoreInterchange);
      const extensionElementsLessCoreElements = differenceOfInterchangeItemsNameOnly(
        initialExtensionElements,
        initialCoreElements,
      );
      const extensionElementsThatExtendCore = differenceOfInterchangeItems(
        initialExtensionElements,
        extensionElementsLessCoreElements,
      );
      const extensionElementsThatExtendCoreThenOnesThatAreNew = unionOfInterchangeItems(
        extensionElementsThatExtendCore,
        extensionElementsLessCoreElements,
      );
      extension.orderedElements = extensionElementsThatExtendCoreThenOnesThatAreNew;
    } else {
      extension.orderedElements = initialExtensionElements;
    }
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const coreXsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, coreNamespace);
  if (coreXsdRepository == null) return { enhancerName, success: false };

  const coreInterchanges: MergedInterchange[] = [...coreXsdRepository.mergedInterchange.values()];
  coreInterchanges.forEach((coreInterchange: MergedInterchange) => {
    coreInterchange.orderedElements = combinedElementsAndIdentityTemplatesFor(coreInterchange);
  });

  metaEd.namespace.forEach((namespace: Namespace) => {
    if (!namespace.isExtension) return;
    const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (xsdRepository == null) return;

    orderExtensionElements(coreInterchanges, [...xsdRepository.mergedInterchange.values()]);
  });

  return {
    enhancerName,
    success: true,
  };
}
