import { MetaEdEnvironment, EnhancerResult } from 'metaed-core';
import { Table } from 'metaed-plugin-edfi-ods-relational';
import {
  AddColumnChangeVersionForTable,
  performAddColumnChangeVersionForTableEnhancement,
} from 'metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'AddColumnChangeVersionForTableEnhancer';

function createModel(table: Table): AddColumnChangeVersionForTable {
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsSqlServer.tableName,
    tableNameHash: null,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performAddColumnChangeVersionForTableEnhancement(metaEd, PLUGIN_NAME, createModel);

  return {
    enhancerName,
    success: true,
  };
}
