import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { EdFiXsdEntityRepository } from '@edfi/metaed-plugin-edfi-xsd';
import { edfiXsdRepositoryForNamespace } from '@edfi/metaed-plugin-edfi-xsd';
import { escapeForMarkdownNewLine } from './Shared';
import { MergedInterchangeEdfiInterchangeBrief } from '../model/MergedInterchange';

const enhancerName = 'MergedInterchangeDocumentationEnhancer';

export function enhance(metaEd: MetaEdEnvironment) {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (xsdRepository == null) return;
    xsdRepository.mergedInterchange.forEach((mergedInterchange) => {
      (
        mergedInterchange.data.edfiInterchangeBrief as MergedInterchangeEdfiInterchangeBrief
      ).interchangeBriefMarkdownEscapedDocumentation = escapeForMarkdownNewLine(mergedInterchange.documentation);
    });
  });
  return {
    enhancerName,
    success: true,
  };
}
