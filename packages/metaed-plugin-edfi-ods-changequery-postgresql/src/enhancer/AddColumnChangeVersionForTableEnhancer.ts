import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  AddColumnChangeVersionForTable,
  performAddColumnChangeVersionForTableEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { versionSatisfiesForPostgresChangeQuerySupport } from './EnhancerHelper';

const enhancerName = 'AddColumnChangeVersionForTableEnhancer';

// TODO: Separate into AddIndexForChangeVersion model?
function createModel(table: Table): AddColumnChangeVersionForTable {
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsPostgresql.tableName,
    tableNameHash: table.data.edfiOdsPostgresql.truncatedTableNameHash,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfiesForPostgresChangeQuerySupport(metaEd)) {
    performAddColumnChangeVersionForTableEnhancement(metaEd, PLUGIN_NAME, createModel);
  }
  return {
    enhancerName,
    success: true,
  };
}
