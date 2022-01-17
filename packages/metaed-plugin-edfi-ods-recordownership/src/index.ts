import { MetaEdPlugin } from '@edfi/metaed-core';
import { newMetaEdPlugin } from '@edfi/metaed-core';

import { enhance as recordOwnershipTableSetupEnhancer } from './model/Table';

import { enhance as addOwnershipTokenColumnTableEnhancer } from './enhancer/AddOwnershipTokenColumnTableEnhancer';

export { TableEdfiOdsRecordOwnership } from './model/Table';
export { recordOwnershipIndicated } from './enhancer/RecordOwnershipIndicator';

export function initialize(): MetaEdPlugin {
  return {
    ...newMetaEdPlugin(),
    enhancer: [recordOwnershipTableSetupEnhancer, addOwnershipTokenColumnTableEnhancer],
  };
}
