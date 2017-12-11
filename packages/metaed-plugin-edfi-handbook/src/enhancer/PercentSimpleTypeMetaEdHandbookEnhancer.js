// @flow
import type {
  EnhancerResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from 'metaed-core';
import type { DecimalSimpleType } from 'metaed-plugin-edfi-xsd';
import { newAnnotation, newDecimalSimpleType } from 'metaed-plugin-edfi-xsd';
import { createDefaultHandbookEntry } from './BaseSimpleTypeMetaEdHandbookEnhancer';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const enhancerName: string = 'PercentSimpleTypeMetaEdHandbookEnhancer';
const percentName: string = 'Percent';
const percentyDocumentation: string = 'A proportion in relation to the whole (as measured in parts per one hundred).';
const percentEdfiId: string = '80';

function createCurrentySimpleType(name: string, documentation: string): DecimalSimpleType {
  return Object.assign(newDecimalSimpleType(), {
    name,
    annotation: Object.assign(newAnnotation(), { documentation, typeGroup: 'Simple' }),
    baseType: 'xs:decimal',
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const result: HandbookEntry = createDefaultHandbookEntry(createCurrentySimpleType(percentName, percentyDocumentation), percentEdfiId, percentName, percentyDocumentation);
  (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries.push(result);

  return {
    enhancerName,
    success: true,
  };
}
