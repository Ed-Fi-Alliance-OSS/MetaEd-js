import { MetaEdPlugin } from '@edfi/metaed-core';
import { newMetaEdPlugin } from '@edfi/metaed-core';

import { generate as addCreatedByOwnershipColumnForTableGenerator } from './generator/AddCreatedByOwnershipColumnForTableGenerator';

export function initialize(): MetaEdPlugin {
  return {
    ...newMetaEdPlugin(),
    generator: [addCreatedByOwnershipColumnForTableGenerator],
  };
}
