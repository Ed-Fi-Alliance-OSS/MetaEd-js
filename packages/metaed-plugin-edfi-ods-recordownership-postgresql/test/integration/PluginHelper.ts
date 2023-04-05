import type { MetaEdPlugin } from '@edfi/metaed-core';

import { initialize as edfiOdsRelational } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';
import { initialize as edfiOdsPostgresql } from '@edfi/metaed-plugin-edfi-ods-postgresql';
import { initialize as edfiOdsRecordOwnership } from '@edfi/metaed-plugin-edfi-ods-recordownership';

import { initialize as edfiOdsRecordOwnershipPostgresql } from '../../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [
    edfiUnified(),
    edfiUnifiedAdvanced(),
    edfiOdsRelational(),
    edfiOdsPostgresql(),
    edfiOdsRecordOwnership(),
    edfiOdsRecordOwnershipPostgresql(),
  ];
}
