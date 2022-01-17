import { MetaEdPlugin } from '@edfi/metaed-core';
import { enhance as modelBaseSetup } from './model/ModelBase';
import { generate as udmGenerator } from './generator/UdmGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [modelBaseSetup],
    generator: [udmGenerator],
    configurationSchemas: new Map(),
  };
}
