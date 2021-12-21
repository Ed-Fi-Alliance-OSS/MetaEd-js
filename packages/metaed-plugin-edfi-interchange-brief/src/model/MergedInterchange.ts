import { MetaEdEnvironment, EnhancerResult, InterchangeItem, Namespace } from 'metaed-core';
import { EdFiXsdEntityRepository, MergedInterchange } from 'metaed-plugin-edfi-xsd';
import { edfiXsdRepositoryForNamespace } from 'metaed-plugin-edfi-xsd';
import { ReferenceUsageInfo } from './ReferenceUsageInfo';

export interface MergedInterchangeEdfiInterchangeBrief {
  interchangeBriefEntities: InterchangeItem[];
  interchangeBriefExtendedReferences: ReferenceUsageInfo[];
  interchangeBriefDescriptorReferences: ReferenceUsageInfo[];
  interchangeBriefMarkdownEscapedDocumentation: string;
}

const enhancerName = 'MergedInterchangeSetupEnhancer';

export function addMergedInterchangeEdfiInterchangeBriefTo(mergedInterchange: MergedInterchange) {
  if (mergedInterchange.data.edfiInterchangeBrief == null) mergedInterchange.data.edfiInterchangeBrief = {};

  Object.assign(mergedInterchange.data.edfiInterchangeBrief, {
    interchangeBriefEntities: [],
    interchangeBriefExtendedReferences: [],
    interchangeBriefDescriptorReferences: [],
    interchangeBriefMarkdownEscapedDocumentation: '',
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (xsdRepository == null) return;
    xsdRepository.mergedInterchange.forEach((mergedInterchange) => {
      addMergedInterchangeEdfiInterchangeBriefTo(mergedInterchange);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
