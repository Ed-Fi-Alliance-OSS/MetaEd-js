import type { MetaEdPlugin } from '@edfi/metaed-core';

import { initialize as edfiOdsRelational } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';
import { initialize as edfiOdsSqlserver } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { initialize as edfiOdsChangequery } from '@edfi/metaed-plugin-edfi-ods-changequery';

import { initialize as edfiOdsChangequerySqlserver } from '../../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [
    edfiUnified(),
    edfiUnifiedAdvanced(),
    edfiOdsRelational(),
    edfiOdsSqlserver(),
    edfiOdsChangequery(),
    edfiOdsChangequerySqlserver(),
  ];
}
