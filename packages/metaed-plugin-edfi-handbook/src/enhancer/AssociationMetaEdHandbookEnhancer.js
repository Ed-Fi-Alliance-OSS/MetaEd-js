// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityMetaEdHandbookEnhancerBase';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'AssociationMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const results: Array<HandbookEntry> = Array.from(metaEd.entity.association.values()).map(association => createDefaultHandbookEntry(association, 'Association', metaEd));
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(...results);

  return {
    enhancerName,
    success: true,
  };
}
