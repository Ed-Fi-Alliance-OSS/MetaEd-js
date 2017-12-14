// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
  StringType,
} from 'metaed-core';
import { createDefaultHandbookEntry } from './SimpleTypeMetaEdHandbookEnhancerBase';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName = 'StringMetaEdHandbookEnhancer';

function getTypeCharacteristsFor(entity: StringType): Array<string> {
  const results = [];
  if (entity.minLength) results.push(`min length: ${entity.minLength}`);
  if (entity.maxLength) results.push(`max length: ${entity.maxLength}`);

  return results;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const results: Array<HandbookEntry> = Array.from(metaEd.entity.stringType.values()).map(entity =>
    Object.assign(createDefaultHandbookEntry(entity, 'Decimal Type'), { typeCharacteristics: getTypeCharacteristsFor(entity) }));

  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(...results);

  return {
    enhancerName,
    success: true,
  };
}
