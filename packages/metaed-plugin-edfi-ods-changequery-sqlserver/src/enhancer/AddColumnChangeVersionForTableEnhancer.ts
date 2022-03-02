import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  AddColumnChangeVersionForTable,
  performAddColumnChangeVersionForTableEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'AddColumnChangeVersionForTableEnhancer';

function createAddColumnModel(table: Table): AddColumnChangeVersionForTable {
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsSqlServer.tableName,
    tableNameHash: null,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performAddColumnChangeVersionForTableEnhancement(metaEd, PLUGIN_NAME, createAddColumnModel);

  return {
    enhancerName,
    success: true,
  };
}
