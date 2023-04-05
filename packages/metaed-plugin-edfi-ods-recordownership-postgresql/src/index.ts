import type { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as addCreatedByOwnershipColumnForTableGenerator } from './generator/AddCreatedByOwnershipColumnForTableGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [addCreatedByOwnershipColumnForTableGenerator],
    shortName: 'edfiOdsRecordOwnershipPostgresql',
  };
}
