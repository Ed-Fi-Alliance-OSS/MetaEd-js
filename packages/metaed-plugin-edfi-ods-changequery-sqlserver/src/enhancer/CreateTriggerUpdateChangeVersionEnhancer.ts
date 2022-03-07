import { MetaEdEnvironment, EnhancerResult, versionSatisfies, SemVer } from '@edfi/metaed-core';
import { Column, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  CreateTriggerUpdateChangeVersion,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { changeDataColumnsFor } from './EnhancerHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function createTriggerModel(table: Table, targetTechnologyVersion: SemVer): CreateTriggerUpdateChangeVersion {
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsSqlServer.tableName,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_UpdateChangeVersion`,
    primaryKeyColumnNames: table.primaryKeys.map((pkColumn: Column) => pkColumn.data.edfiOdsSqlServer.columnName),
    changeDataColumns: changeDataColumnsFor(table),
    includeKeyChanges:
      versionSatisfies(targetTechnologyVersion, '>=5.4.0') &&
      table.parentEntity?.data?.edfiOdsRelational?.odsCascadePrimaryKeyUpdates,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performCreateTriggerUpdateChangeVersionEnhancement(metaEd, PLUGIN_NAME, createTriggerModel);
  return {
    enhancerName,
    success: true,
  };
}
