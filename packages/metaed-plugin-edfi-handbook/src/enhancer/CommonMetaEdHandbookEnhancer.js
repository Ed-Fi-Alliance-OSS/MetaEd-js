// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
  Common,
} from 'metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityMetaEdHandbookEnhancerBase';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'CommonMetaEdHandbookEnhancer';

function notInlineCommon(entity: Common): boolean {
  return !entity.inlineInOds;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const results: Array<HandbookEntry> = Array.from(metaEd.entity.common.values()).filter(notInlineCommon).map(entity => createDefaultHandbookEntry(entity, 'Common', metaEd));
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(...results);

  return {
    enhancerName,
    success: true,
  };
}
