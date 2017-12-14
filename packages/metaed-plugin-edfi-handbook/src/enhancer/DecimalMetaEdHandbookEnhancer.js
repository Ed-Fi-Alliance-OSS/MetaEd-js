// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
  DecimalType,
} from 'metaed-core';
import { createDefaultHandbookEntry } from './SimpleTypeMetaEdHandbookEnhancerBase';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'DecimalMetaEdHandbookEnhancer';

function getTypeCharacteristicsFor(entity: DecimalType): Array<string> {
  const results: Array<string> = [];
  if (entity.totalDigits) results.push(`total digits: ${entity.totalDigits}`);
  if (entity.decimalPlaces) results.push(`decimal places: ${entity.decimalPlaces}`);

  if (entity.minValue) results.push(`min value: ${entity.minValue}`);
  if (entity.maxValue) results.push(`max value: ${entity.maxValue}`);

  return results;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const results: Array<HandbookEntry> = Array.from(metaEd.entity.decimalType.values()).map(entity =>
    Object.assign(createDefaultHandbookEntry(entity, 'Decimal Type', metaEd), { typeCharacteristics: getTypeCharacteristicsFor(entity) }));

  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(...results);

  return {
    enhancerName,
    success: true,
  };
}
