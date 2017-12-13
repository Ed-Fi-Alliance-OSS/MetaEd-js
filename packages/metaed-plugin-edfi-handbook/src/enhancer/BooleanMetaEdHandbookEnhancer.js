// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import { createDefaultHandbookEntry } from './XsdBuiltinTypeMetaEdHandbookEnhancerBase';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'BooleanMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const results: Array<HandbookEntry> = metaEd.propertyIndex.boolean.map(property => createDefaultHandbookEntry(property, 'Boolean Type'));
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(...results);

  return {
    enhancerName,
    success: true,
  };
}
