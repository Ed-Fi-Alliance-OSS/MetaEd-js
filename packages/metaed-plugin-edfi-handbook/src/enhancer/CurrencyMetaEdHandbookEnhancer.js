// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import { createCurrencySimpleType } from 'metaed-plugin-edfi-xsd';
import { createDefaultHandbookEntry } from './BaseSimpleTypeMetaEdHandbookEnhancer';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'CurrencyMetaEdHandbookEnhancer';
const currencyName: string = 'Currency';
const currencyDocumentation: string = 'U.S. currency in dollars and cents.';
const currencyEdfiId: string = '36';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const result: HandbookEntry = createDefaultHandbookEntry(createCurrencySimpleType(), currencyEdfiId, currencyName, currencyDocumentation);
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(result);

  return {
    enhancerName,
    success: true,
  };
}
