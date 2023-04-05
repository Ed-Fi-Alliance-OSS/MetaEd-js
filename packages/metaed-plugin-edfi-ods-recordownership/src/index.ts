import type { MetaEdPlugin } from '@edfi/metaed-core';
import { enhance as recordOwnershipTableSetupEnhancer } from './model/Table';
import { enhance as addOwnershipTokenColumnTableEnhancer } from './enhancer/AddOwnershipTokenColumnTableEnhancer';

export { TableEdfiOdsRecordOwnership } from './model/Table';
export { recordOwnershipIndicated } from './enhancer/RecordOwnershipIndicator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [recordOwnershipTableSetupEnhancer, addOwnershipTokenColumnTableEnhancer],
    generator: [],
    shortName: 'edfiOdsRecordOwnership',
  };
}
