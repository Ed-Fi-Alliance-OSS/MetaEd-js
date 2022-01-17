import { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as xmlDataDictionaryGenerator } from './generator/XmlDataDictionaryGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [xmlDataDictionaryGenerator],
    configurationSchemas: new Map(),
  };
}
