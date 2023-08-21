import { String as sugar } from 'sugar';
import { newNamespace } from '@edfi/metaed-core';
import { Namespace, Interchange, InterchangeItem, MetaEdEnvironment } from '@edfi/metaed-core';
import { unionOfInterchangeItems } from './InterchangeItem';
import { EdFiXsdEntityRepository } from './EdFiXsdEntityRepository';
import { edfiXsdRepositoryForNamespace } from '../enhancer/EnhancerHelper';

// From structure of Interchange - if core models move to structural typing, consider using Interchange directly
interface MergedInterchangeBase {
  data: any;
  documentation: string;
  metaEdName: string;
  namespace: Namespace;

  elements: InterchangeItem[];
  identityTemplates: InterchangeItem[];
  extendedDocumentation: string;
  useCaseDocumentation: string;
  baseEntityName: string;
  baseEntity: Interchange | null;
}

export interface MergedInterchange extends MergedInterchangeBase {
  repositoryId: string;
  interchangeName: string;
  schemaLocation: string;
  orderedElements: InterchangeItem[];
  humanizedName: string;
}

export const addHumanizedNameFor = (mergedInterchange: MergedInterchange) =>
  mergedInterchange.metaEdName ? sugar.titleize(mergedInterchange.metaEdName) : '';

export const combinedElementsAndIdentityTemplatesFor = (mergedInterchange: MergedInterchange) =>
  unionOfInterchangeItems(mergedInterchange.elements, mergedInterchange.identityTemplates);

export const addMergedInterchangeToRepository = (metaEd: MetaEdEnvironment, mergedInterchange: MergedInterchange) => {
  const edfiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(
    metaEd,
    mergedInterchange.namespace,
  );
  if (edfiXsdEntityRepository == null) return;

  mergedInterchange.repositoryId = mergedInterchange.namespace.isExtension
    ? `${mergedInterchange.namespace.projectExtension}-${mergedInterchange.metaEdName}`
    : mergedInterchange.metaEdName;
  mergedInterchange.humanizedName = addHumanizedNameFor(mergedInterchange);

  edfiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);
};

// warning: limitation of extending base model objects in an extension plugin is that the type field is restricted
// to base types - so it will have type as 'interchange'
export function newMergedInterchange(): MergedInterchange {
  return {
    data: {},
    documentation: '',
    metaEdName: '',
    namespace: newNamespace(),

    elements: [],
    identityTemplates: [],
    extendedDocumentation: '',
    useCaseDocumentation: '',
    baseEntityName: '',
    baseEntity: null,
    humanizedName: '',
    repositoryId: '',
    interchangeName: '',
    schemaLocation: '',
    orderedElements: [],
  };
}
