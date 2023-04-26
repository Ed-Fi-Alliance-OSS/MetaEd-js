import type { MetaEdPlugin } from '@edfi/metaed-core';
import { validate as edfiOdsPluginTest } from './validator/edfiOdsPluginTest';

export function initialize(): MetaEdPlugin {
  return {
    validator: [edfiOdsPluginTest],
    enhancer: [],
    generator: [],
    shortName: 'edfiOdsPluginTest',
  };
}
