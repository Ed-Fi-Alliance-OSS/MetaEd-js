import { DeleteTrackingTrigger, getPrimaryKeys } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { MetaEdEnvironment, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';

function createDeleteTrackingTriggerModelV3dot3(mainTable: Table): DeleteTrackingTrigger {
  return {
    triggerSchema: mainTable.schema,
    triggerName: `${mainTable.schema}_${mainTable.data.edfiOdsSqlServer.tableName}_TR_DeleteTracking`,
    targetTableSchema: mainTable.schema,
    targetTableName: mainTable.data.edfiOdsSqlServer.tableName,
    deleteTrackingTableSchema: 'changes',
    deleteTrackingTableName: `${mainTable.schema}_${mainTable.data.edfiOdsSqlServer.tableName}_TrackedDelete`,
    primaryKeyColumnNames: getPrimaryKeys(mainTable, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsSqlServer.columnName,
    ),
    targetTableIsSubclass: false,
    foreignKeyToSuperclass: null,
  };
}

function createDeleteTrackingTriggerModelV3dot4(mainTable: Table): DeleteTrackingTrigger {
  return {
    triggerSchema: mainTable.schema,
    triggerName: `${mainTable.schema}_${mainTable.data.edfiOdsSqlServer.tableName}_TR_DeleteTracking`,
    targetTableSchema: mainTable.schema,
    targetTableName: mainTable.data.edfiOdsSqlServer.tableName,
    deleteTrackingTableSchema: `tracked_deletes_${mainTable.schema}`,
    deleteTrackingTableName: mainTable.data.edfiOdsSqlServer.tableName,
    primaryKeyColumnNames: getPrimaryKeys(mainTable, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsSqlServer.columnName,
    ),
    targetTableIsSubclass: false,
    foreignKeyToSuperclass: null,
  };
}

export function createDeleteTrackingTriggerModel(metaEd: MetaEdEnvironment, mainTable: Table): DeleteTrackingTrigger {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;

  if (versionSatisfies(targetTechnologyVersion, '<3.4.0')) {
    return createDeleteTrackingTriggerModelV3dot3(mainTable);
  }

  return createDeleteTrackingTriggerModelV3dot4(mainTable);
}
