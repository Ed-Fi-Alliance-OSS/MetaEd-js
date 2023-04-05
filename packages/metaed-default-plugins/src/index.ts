import type { MetaEdPlugin } from '@edfi/metaed-core';

import { initialize as edfiApiSchema } from '@edfi/metaed-plugin-edfi-api-schema';
import { initialize as edfiHandbook } from '@edfi/metaed-plugin-edfi-handbook';
import { initialize as edfiOdsChangequery } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { initialize as edfiOdsChangequeryPostgresql } from '@edfi/metaed-plugin-edfi-ods-changequery-postgresql';
import { initialize as edfiOdsChangequerySqlserver } from '@edfi/metaed-plugin-edfi-ods-changequery-sqlserver';
import { initialize as edfiOdsPostgresql } from '@edfi/metaed-plugin-edfi-ods-postgresql';
import { initialize as edfiOdsRecordownership } from '@edfi/metaed-plugin-edfi-ods-recordownership';
import { initialize as edfiOdsRecordownershipPostgresql } from '@edfi/metaed-plugin-edfi-ods-recordownership-postgresql';
import { initialize as edfiOdsRecordownershipSqlserver } from '@edfi/metaed-plugin-edfi-ods-recordownership-sqlserver';
import { initialize as edfiOdsRelational } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as edfiOdsSqlserver } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { initialize as edfiOdsapi } from '@edfi/metaed-plugin-edfi-odsapi';
import { initialize as edfiSqlDictionary } from '@edfi/metaed-plugin-edfi-sql-dictionary';
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';
import { initialize as edfiXmlDictionary } from '@edfi/metaed-plugin-edfi-xml-dictionary';
import { initialize as edfiXsd } from '@edfi/metaed-plugin-edfi-xsd';

let cachedPlugins: MetaEdPlugin[] = [];

/**
 * Returns all of the default MetaEd plugins in dependency order
 */
export function defaultPlugins(): MetaEdPlugin[] {
  if (cachedPlugins.length > 0) return cachedPlugins;

  cachedPlugins = [
    edfiUnified(),
    edfiUnifiedAdvanced(),

    edfiApiSchema(),

    edfiXsd(),

    edfiOdsRelational(),
    edfiOdsSqlserver(),
    edfiOdsPostgresql(),

    edfiOdsChangequery(),
    edfiOdsChangequerySqlserver(),
    edfiOdsChangequeryPostgresql(),

    edfiOdsRecordownership(),
    edfiOdsRecordownershipSqlserver(),
    edfiOdsRecordownershipPostgresql(),

    edfiOdsapi(),

    edfiXmlDictionary(),
    edfiSqlDictionary(),
    edfiHandbook(),
  ];

  return cachedPlugins;
}
