import { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as sqlDataDictionaryGenerator } from './generator/SqlDataDictionaryGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [sqlDataDictionaryGenerator],
    configurationSchemas: new Map(),
  };
}
