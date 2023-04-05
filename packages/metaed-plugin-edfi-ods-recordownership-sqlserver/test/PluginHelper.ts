import type { MetaEdPlugin } from '@edfi/metaed-core';

import { initialize as edfiOdsRelational } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';
import { initialize as edfiOdsSqlserver } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { initialize as edfiOdsRecordOwnership } from '@edfi/metaed-plugin-edfi-ods-recordownership';

import { initialize as edfiOdsRecordOwnershipSqlserver } from '../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [
    edfiUnified(),
    edfiUnifiedAdvanced(),
    edfiOdsRelational(),
    edfiOdsSqlserver(),
    edfiOdsRecordOwnership(),
    edfiOdsRecordOwnershipSqlserver(),
  ];
}
