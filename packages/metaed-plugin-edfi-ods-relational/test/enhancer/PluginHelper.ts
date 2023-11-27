import type { Enhancer } from '@edfi/metaed-core';
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';
import { preTableCreationEnhancerList } from '../../src/enhancer/EnhancerList';

export function allEnhancersBeforeTableCreation(): Enhancer[] {
  return [...edfiUnified().enhancer, ...edfiUnifiedAdvanced().enhancer, ...preTableCreationEnhancerList()];
}
