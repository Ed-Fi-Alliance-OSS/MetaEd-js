import type { MetaEdPlugin } from '@edfi/metaed-core';
import { enhance as equalityConstraintEnhancer } from './enhancer/EqualityConstraintEnhancer';
import { enhance as entityApiSchemaAdvancedDataSetupEnhancer } from './model/EntityApiSchemaAdvancedData';
import { validate as mergeDirectiveMustBeAValidPath } from './validator/MergeDirectiveMustBeAValidPath';

export { enhance as entityApiSchemaAdvancedDataSetupEnhancer } from './model/EntityApiSchemaAdvancedData';
export { enhance as equalityConstraintEnhancer } from './enhancer/EqualityConstraintEnhancer';
export type { EqualityConstraint } from './model/EqualityConstraint';

export function initialize(): MetaEdPlugin {
  return {
    enhancer: [entityApiSchemaAdvancedDataSetupEnhancer, equalityConstraintEnhancer],
    validator: [mergeDirectiveMustBeAValidPath],
    generator: [],
    shortName: 'edfiApiSchemaAdvanced',
  };
}
