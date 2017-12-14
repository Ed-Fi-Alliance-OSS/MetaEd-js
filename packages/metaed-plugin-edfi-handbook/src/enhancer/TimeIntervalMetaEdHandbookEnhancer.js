// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import { createTimeIntervalSimpleType } from 'metaed-plugin-edfi-xsd';
import { createDefaultHandbookEntry } from './BaseSimpleTypeMetaEdHandbookEnhancer';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'TimeIntervalMetaEdHandbookEnhancer';
const timeIntervalName: string = 'TimeInterval';
const timeIntervalDocumentation: string = 'A period of time with fixed, well-defined limits.';
const timeIntervalEdfiId: string = '110';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const result: HandbookEntry = createDefaultHandbookEntry(createTimeIntervalSimpleType(), timeIntervalEdfiId, timeIntervalName, timeIntervalDocumentation);
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(result);

  return {
    enhancerName,
    success: true,
  };
}
