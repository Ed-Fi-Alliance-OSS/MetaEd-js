import { MetaEdPlugin } from '@edfi/metaed-core';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [],
    shortName: 'edfiTest',
  };
}
