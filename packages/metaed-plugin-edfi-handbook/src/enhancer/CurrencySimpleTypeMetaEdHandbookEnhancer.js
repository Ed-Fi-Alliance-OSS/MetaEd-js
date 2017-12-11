// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import { createDefaultHandbookEntry } from './BaseSimpleTypeMetaEdHandbookEnhancer';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName = 'CurrencyMetaEdHandbookEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const results: Array<HandbookEntry> = metaEd.propertyIndex.currency.map(property => createDefaultHandbookEntry(property, 'Currency Type'));
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(...results);

  return {
    enhancerName,
    success: true,
  };
}
