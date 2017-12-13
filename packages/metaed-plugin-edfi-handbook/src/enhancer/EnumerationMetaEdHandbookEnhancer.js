// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityMetaEdHandbookEnhancerBase';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'EnumerationMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const enumerationResults: Array<HandbookEntry> = Array.from(metaEd.entity.enumeration.values()).map(entity => createDefaultHandbookEntry(entity, 'Enumeration', metaEd));
  const mapResults: Array<HandbookEntry> = Array.from(metaEd.entity.mapTypeEnumeration.values()).map(entity => createDefaultHandbookEntry(entity, 'Enumeration', metaEd));
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(...enumerationResults, ...mapResults);

  return {
    enhancerName,
    success: true,
  };
}
