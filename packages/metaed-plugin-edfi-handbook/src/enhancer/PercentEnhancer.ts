import { randomUUID } from 'node:crypto';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { ColumnDataTypes } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { createDefaultHandbookEntry } from './BaseSimpleTypeHandbookEntryCreator';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { edfiHandbookRepositoryForNamespace } from './EnhancerHelper';

const enhancerName = 'PercentMetaEdHandbookEnhancer';
const percentName = 'Percent';
const percentDocumentation = 'A proportion in relation to the whole (as measured in parts per one hundred).';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, coreNamespace);
  if (handbookRepository == null) return { enhancerName, success: false };

  handbookRepository.handbookEntries.push(
    createDefaultHandbookEntry({
      entityUuid: randomUUID(),
      name: percentName,
      definition: percentDocumentation,
      columnDefinition: ColumnDataTypes.percent,
    }),
  );

  return {
    enhancerName,
    success: true,
  };
}
