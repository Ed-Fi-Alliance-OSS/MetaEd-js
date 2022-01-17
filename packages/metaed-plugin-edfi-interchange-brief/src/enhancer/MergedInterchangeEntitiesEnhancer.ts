import { MetaEdEnvironment, EnhancerResult, InterchangeItem, Namespace } from '@edfi/metaed-core';
import { EdFiXsdEntityRepository, MergedInterchange } from '@edfi/metaed-plugin-edfi-xsd';
import { edfiXsdRepositoryForNamespace } from '@edfi/metaed-plugin-edfi-xsd';
import { MergedInterchangeEdfiInterchangeBrief } from '../model/MergedInterchange';
import { escapeForMarkdownTableContent } from './Shared';

const enhancerName = 'MergedInterchangeEntitiesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (xsdRepository == null) return;

    // eslint-disable-next-line prettier/prettier
    const mergedInterchanges: MergedInterchange[] = Array.from(
      xsdRepository.mergedInterchange.values(),
    ) as MergedInterchange[];

    mergedInterchanges.forEach((mergedInterchange) => {
      const entities: InterchangeItem[] = mergedInterchange.identityTemplates.concat(
        mergedInterchange.elements,
      ) as InterchangeItem[];
      entities.forEach((entity) => {
        if (entity.referencedEntity.type === 'domainEntityExtension') {
          entity.data.edfiInterchangeBrief = {
            ...entity.data.edfiInterchangeBrief,
            interchangeBriefDescription: entity.referencedEntity.baseEntity
              ? escapeForMarkdownTableContent(entity.referencedEntity.baseEntity.documentation)
              : '',
          };
        } else {
          entity.data.edfiInterchangeBrief = {
            ...entity.data.edfiInterchangeBrief,
            interchangeBriefDescription: escapeForMarkdownTableContent(entity.referencedEntity.documentation),
          };
        }
      });

      (mergedInterchange.data.edfiInterchangeBrief as MergedInterchangeEdfiInterchangeBrief).interchangeBriefEntities.push(
        ...entities,
      );
    });
  });
  return {
    enhancerName,
    success: true,
  };
}
