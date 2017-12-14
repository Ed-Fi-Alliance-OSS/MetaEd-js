// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import { createPercentSimpleType } from 'metaed-plugin-edfi-xsd';
import { createDefaultHandbookEntry } from './BaseSimpleTypeMetaEdHandbookEnhancer';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'PercentMetaEdHandbookEnhancer';
const percentName: string = 'Percent';
const percentyDocumentation: string = 'A proportion in relation to the whole (as measured in parts per one hundred).';
const percentEdfiId: string = '80';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const result: HandbookEntry = createDefaultHandbookEntry(createPercentSimpleType(), percentEdfiId, percentName, percentyDocumentation);
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(result);

  return {
    enhancerName,
    success: true,
  };
}
