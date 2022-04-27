import {
  ChangeDataColumn,
  DeleteTrackingTrigger,
  getPrimaryKeys,
  hasRequiredNonIdentityNamespaceColumn,
  newDeleteTrackingTrigger,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { MetaEdEnvironment, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { TARGET_DATABASE_PLUGIN_NAME, postgresqlTriggerName, changeDataColumnsFor } from './EnhancerHelper';

export function createDeleteTrackingTriggerModelV3dot4(table: Table): DeleteTrackingTrigger {
  return {
    ...newDeleteTrackingTrigger(),
    triggerSchema: `tracked_deletes_${table.schema}`,
    triggerName: postgresqlTriggerName(table, 'TR_DelTrkg'),
    targetTableSchema: table.schema,
    targetTableName: table.data.edfiOdsPostgresql.tableName,
    deleteTrackingTableSchema: `tracked_deletes_${table.schema}`,
    deleteTrackingTableName: table.data.edfiOdsPostgresql.tableName,
    primaryKeyColumnNames: getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsPostgresql.columnName,
    ),
  };
}

export function createDeleteTrackingTriggerModelV5dot4(table: Table): DeleteTrackingTrigger {
  const changeDataColumns: ChangeDataColumn[] = changeDataColumnsFor(table);
  return {
    ...newDeleteTrackingTrigger(),
    triggerSchema: `tracked_changes_${table.schema}`,
    triggerName: postgresqlTriggerName(table, 'deleted').toLowerCase(),
    targetTableSchema: table.schema,
    targetTableName: table.data.edfiOdsPostgresql.tableName.toLowerCase(),
    targetTableNameCasePreserved: table.data.edfiOdsPostgresql.tableName,
    deleteTrackingTableSchema: `tracked_changes_${table.schema}`,
    deleteTrackingTableName: table.data.edfiOdsPostgresql.tableName.toLowerCase(),
    primaryKeyColumnNames: getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsPostgresql.columnName,
    ),
    isDescriptorTable: table.existenceReason.isEntityMainTable && table.existenceReason.parentEntity?.type === 'descriptor',
    isStyle5dot4: true,
    changeDataColumns,
    needsDeclare: changeDataColumns.some((c) => c.isUsi || c.isDescriptorId),
    isIgnored: table.existenceReason.isSubclassTable || table.existenceReason.isBaseDescriptor,
    omitDiscriminator: table.schema === 'edfi' && table.tableId === 'SchoolYearType',
    includeNamespace: hasRequiredNonIdentityNamespaceColumn(table),
  };
}

export function createDeleteTrackingTriggerModel(metaEd: MetaEdEnvironment, table: Table): DeleteTrackingTrigger {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;

  if (versionSatisfies(targetTechnologyVersion, '<5.4.0')) {
    return createDeleteTrackingTriggerModelV3dot4(table);
  }

  return createDeleteTrackingTriggerModelV5dot4(table);
}
