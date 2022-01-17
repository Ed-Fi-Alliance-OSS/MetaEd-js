import { MetaEdEnvironment, EnhancerResult, InterchangeItem, Namespace } from '@edfi/metaed-core';
import { edfiXsdRepositoryForNamespace } from './EnhancerHelper';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';
import { InterchangeItemEdfiXsd } from '../model/InterchangeItem';
import { DescriptorEdfiXsd } from '../model/Descriptor';
import { ModelBaseEdfiXsd } from '../model/ModelBase';
import { MergedInterchange } from '../model/MergedInterchange';

const enhancerName = 'InterchangeItemEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) return;

    Array.from(edFiXsdEntityRepository.mergedInterchange.values()).forEach((interchange: MergedInterchange) => {
      interchange.elements.forEach((elementItem: InterchangeItem) => {
        const interchangeItemEdfiXsd = elementItem.data.edfiXsd as InterchangeItemEdfiXsd;
        interchangeItemEdfiXsd.xsdName = elementItem.metaEdName;
        if (elementItem.referencedEntity.type === 'descriptor') {
          const referencedEntityEdfiXsd: DescriptorEdfiXsd = elementItem.referencedEntity.data.edfiXsd as DescriptorEdfiXsd;
          interchangeItemEdfiXsd.xsdType = referencedEntityEdfiXsd.xsdDescriptorNameWithExtension;
        } else {
          const referencedEntityEdfiXsd: ModelBaseEdfiXsd = elementItem.referencedEntity.data.edfiXsd as ModelBaseEdfiXsd;
          interchangeItemEdfiXsd.xsdType = referencedEntityEdfiXsd.xsdMetaEdNameWithExtension();
        }
      });

      interchange.identityTemplates.forEach((elementItem: InterchangeItem) => {
        const identityTemplateItemEdfiXsd = elementItem.data.edfiXsd as InterchangeItemEdfiXsd;
        identityTemplateItemEdfiXsd.xsdName = `${elementItem.metaEdName}Reference`;
        const referencedEntityEdfiXsd: ModelBaseEdfiXsd = elementItem.referencedEntity.data.edfiXsd as ModelBaseEdfiXsd;
        identityTemplateItemEdfiXsd.xsdType = `${referencedEntityEdfiXsd.xsdMetaEdNameWithExtension()}ReferenceType`;
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
