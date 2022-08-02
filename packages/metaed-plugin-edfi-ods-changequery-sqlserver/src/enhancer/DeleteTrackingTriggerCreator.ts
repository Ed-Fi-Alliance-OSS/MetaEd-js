import {
  DeleteTrackingTrigger,
  getPrimaryKeys,
  hasRequiredNonIdentityNamespaceColumn,
  newDeleteTrackingTrigger,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { MetaEdEnvironment, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { changeDataColumnsWithHardcodesFor, TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';

function createDeleteTrackingTriggerModelV3dot3(table: Table): DeleteTrackingTrigger {
  return {
    ...newDeleteTrackingTrigger(),
    triggerSchema: table.schema,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_DeleteTracking`,
    targetTableSchema: table.schema,
    targetTableName: table.data.edfiOdsSqlServer.tableName,
    deleteTrackingTableSchema: 'changes',
    deleteTrackingTableName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TrackedDelete`,
    primaryKeyColumnNames: getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsSqlServer.columnName,
    ),
  };
}

function createDeleteTrackingTriggerModelV3dot4(table: Table): DeleteTrackingTrigger {
  return {
    ...newDeleteTrackingTrigger(),
    triggerSchema: table.schema,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_DeleteTracking`,
    targetTableSchema: table.schema,
    targetTableName: table.data.edfiOdsSqlServer.tableName,
    deleteTrackingTableSchema: `tracked_deletes_${table.schema}`,
    deleteTrackingTableName: table.data.edfiOdsSqlServer.tableName,
    primaryKeyColumnNames: getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsSqlServer.columnName,
    ),
  };
}

function createDeleteTrackingTriggerModelV6dot0(table: Table): DeleteTrackingTrigger {
  return {
    ...newDeleteTrackingTrigger(),
    triggerSchema: table.schema,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_DeleteTracking`,
    targetTableSchema: table.schema,
    targetTableName: table.data.edfiOdsSqlServer.tableName,
    deleteTrackingTableSchema: `tracked_changes_${table.schema}`,
    deleteTrackingTableName: table.data.edfiOdsSqlServer.tableName,
    primaryKeyColumnNames: getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsSqlServer.columnName,
    ),
    isDescriptorTable: table.existenceReason.isEntityMainTable && table.existenceReason.parentEntity?.type === 'descriptor',
    isStyle6dot0: true,
    changeDataColumns: changeDataColumnsWithHardcodesFor(table),
    isIgnored: table.existenceReason.isSubclassTable || table.existenceReason.isBaseDescriptor,
    omitDiscriminator: table.schema === 'edfi' && table.tableId === 'SchoolYearType',
    includeNamespace: hasRequiredNonIdentityNamespaceColumn(table),
  };
}

export function createDeleteTrackingTriggerModel(metaEd: MetaEdEnvironment, mainTable: Table): DeleteTrackingTrigger {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;

  if (versionSatisfies(targetTechnologyVersion, '<3.4.0')) {
    return createDeleteTrackingTriggerModelV3dot3(mainTable);
  }

  if (versionSatisfies(targetTechnologyVersion, '<6.0.0')) {
    return createDeleteTrackingTriggerModelV3dot4(mainTable);
  }

  return createDeleteTrackingTriggerModelV6dot0(mainTable);
}
