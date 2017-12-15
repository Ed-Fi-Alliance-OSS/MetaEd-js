// @flow
import type { Validator, MetaEdPlugin } from 'metaed-core';
import { generate as OdsGenerator } from './generator/OdsGenerator';
import { enhancerList } from './enhancer/EnhancerList';

function validatorList(): Array<Validator> {
  return [];
}

export function initialize(): MetaEdPlugin {
  return {
    validator: validatorList(),
    enhancer: enhancerList(),
    generator: [OdsGenerator],
  };
}
