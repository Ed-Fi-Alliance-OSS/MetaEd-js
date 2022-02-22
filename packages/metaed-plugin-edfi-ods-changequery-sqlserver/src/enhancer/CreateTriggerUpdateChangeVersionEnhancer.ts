import { MetaEdEnvironment, EnhancerResult, versionSatisfies, SemVer } from '@edfi/metaed-core';
import { Column, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  CreateTriggerUpdateChangeVersion,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function createModel(table: Table, targetTechnologyVersion: SemVer): CreateTriggerUpdateChangeVersion {
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsSqlServer.tableName,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_UpdateChangeVersion`,
    primaryKeyColumnNames: table.primaryKeys.map((pkColumn: Column) => pkColumn.data.edfiOdsSqlServer.columnName),
    includeKeyChanges: versionSatisfies(targetTechnologyVersion, '>=5.4.0') && table.hasUpdateCascadingForeignKey,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performCreateTriggerUpdateChangeVersionEnhancement(metaEd, PLUGIN_NAME, createModel);
  return {
    enhancerName,
    success: true,
  };
}
