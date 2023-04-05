import deepFreeze from 'deep-freeze';
import { Validator } from '../validator/Validator';
import { Enhancer } from '../enhancer/Enhancer';
import { Generator } from '../generator/Generator';

/**
 *
 */
export type MetaEdPlugin = {
  validator: Validator[];
  enhancer: Enhancer[];
  generator: Generator[];
  shortName: string;
};

/**
 *
 */
function newMetaEdPlugin(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [],
    shortName: '',
  };
}

/**
 *
 */
export const NoMetaEdPlugin = deepFreeze(newMetaEdPlugin());
