// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import { createDefaultHandbookEntry } from './TopLevelEntityMetaEdHandbookEnhancerBase';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'DescriptorMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const results: Array<HandbookEntry> = Array.from(metaEd.entity.descriptor.values()).map(entity => createDefaultHandbookEntry(entity, 'Descriptor', metaEd));
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(...results);

  return {
    enhancerName,
    success: true,
  };
}
