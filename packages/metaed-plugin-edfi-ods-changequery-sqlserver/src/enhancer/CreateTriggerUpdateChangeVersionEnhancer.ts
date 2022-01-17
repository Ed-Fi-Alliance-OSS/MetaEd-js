import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  CreateTriggerUpdateChangeVersion,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function createModel(table: Table): CreateTriggerUpdateChangeVersion {
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsSqlServer.tableName,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_UpdateChangeVersion`,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performCreateTriggerUpdateChangeVersionEnhancement(metaEd, PLUGIN_NAME, createModel);
  return {
    enhancerName,
    success: true,
  };
}
