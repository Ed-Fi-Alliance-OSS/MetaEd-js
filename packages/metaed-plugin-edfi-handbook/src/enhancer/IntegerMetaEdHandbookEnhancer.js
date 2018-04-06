// @flow
import type { EnhancerResult, MetaEdEnvironment, PluginEnvironment, IntegerType } from 'metaed-core';
import { createDefaultHandbookEntry } from './SimpleTypeMetaEdHandbookEnhancerBase';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'IntegerMetaEdHandbookEnhancer';

function getTypeCharacteristicsFor(entity: IntegerType): Array<string> {
  const results = [];
  if (entity.minValue) results.push(`min value: ${entity.minValue}`);
  if (entity.maxValue) results.push(`max value: ${entity.maxValue}`);

  return results;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const results: Array<HandbookEntry> = Array.from(metaEd.entity.integerType.values()).map(entity =>
    Object.assign(createDefaultHandbookEntry(entity, '', metaEd), {
      entityType: entity.isShort ? 'ShortType' : 'IntegerType',
      typeCharacteristics: getTypeCharacteristicsFor(entity),
    }),
  );

  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(
    ...results,
  );

  return {
    enhancerName,
    success: true,
  };
}
