// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import type { StringSimpleType } from 'metaed-plugin-edfi-xsd';
import { newAnnotation, newStringSimpleType } from 'metaed-plugin-edfi-xsd';
import { createDefaultHandbookEntry } from './BaseSimpleTypeMetaEdHandbookEnhancer';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'CurrencyMetaEdHandbookEnhancer';
const timeIntervalName: string = 'TimeInterval';
const timeIntervalDocumentation: string = 'A period of time with fixed, well-defined limits.';
const timeIntervalEdfiId: string = '110';

function createCurrentySimpleType(name: string, documentation: string): StringSimpleType {
  return Object.assign(newStringSimpleType(), {
    name,
    annotation: Object.assign(newAnnotation(), { documentation, typeGroup: 'Simple' }),
    baseType: 'xs:duration',
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const result: HandbookEntry = createDefaultHandbookEntry(createCurrentySimpleType(timeIntervalName, timeIntervalDocumentation), timeIntervalEdfiId, timeIntervalName, timeIntervalDocumentation);
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(result);

  return {
    enhancerName,
    success: true,
  };
}
