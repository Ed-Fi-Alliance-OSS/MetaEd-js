// @flow
import type { MetaEdPlugin } from 'metaed-core';
import { enhance as edfiHandbookRepositorySetup } from './model/EdfiHandbookRepository';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [edfiHandbookRepositorySetup],
    generator: [],
  };
}
