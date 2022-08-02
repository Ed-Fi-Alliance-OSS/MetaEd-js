import { Column, newColumn, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  DeleteTrackingTable,
  getPrimaryKeys,
  hasRequiredNonIdentityNamespaceColumn,
  newDeleteTrackingTable,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { MetaEdEnvironment, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { changeDataColumnsFor, hardcodedOldColumnFor, TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';

function createDeleteTrackingTableModelV3dot3(table: Table): DeleteTrackingTable {
  const tableName = `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TrackedDelete`;

  const changeVersionColumn: Column = {
    ...newColumn(),
    columnId: 'ChangeVersion',
    data: { edfiOdsSqlServer: { columnName: 'ChangeVersion', dataType: 'bigint' } },
    isNullable: false,
  };

  const deleteTrackingTable: DeleteTrackingTable = {
    ...newDeleteTrackingTable(),
    schema: 'changes',
    tableName,
    primaryKeyName: `PK_${tableName}`,
    columns: [...getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME)],
    primaryKeyColumns: [changeVersionColumn],
  };

  deleteTrackingTable.columns.push({
    ...newColumn(),
    columnId: 'Id',
    data: { edfiOdsSqlServer: { columnName: 'Id', dataType: 'uniqueidentifier' } },
    isNullable: false,
  });

  deleteTrackingTable.columns.push(changeVersionColumn);

  return deleteTrackingTable;
}

function createDeleteTrackingTableModelV3dot4(table: Table): DeleteTrackingTable {
  const trackingTableName: string = table.data.edfiOdsSqlServer.tableName;

  const changeVersionColumn: Column = {
    ...newColumn(),
    columnId: 'ChangeVersion',
    data: { edfiOdsSqlServer: { columnName: 'ChangeVersion', dataType: 'bigint' } },
    isNullable: false,
  };

  const deleteTrackingTable: DeleteTrackingTable = {
    ...newDeleteTrackingTable(),
    schema: `tracked_deletes_${table.schema}`,
    tableName: trackingTableName,
    primaryKeyName: `PK_${trackingTableName}`,
    columns: [...getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME)],
    primaryKeyColumns: [changeVersionColumn],
  };

  deleteTrackingTable.columns.push({
    ...newColumn(),
    columnId: 'Id',
    data: { edfiOdsSqlServer: { columnName: 'Id', dataType: 'uniqueidentifier' } },
    isNullable: false,
  });

  deleteTrackingTable.columns.push(changeVersionColumn);

  return deleteTrackingTable;
}

function createDeleteTrackingTableModelV6dot0(table: Table): DeleteTrackingTable {
  const trackingTableName: string = table.data.edfiOdsSqlServer.tableName;

  const changeVersionColumn: Column = {
    ...newColumn(),
    columnId: 'ChangeVersion',
    data: { edfiOdsSqlServer: { columnName: 'ChangeVersion', dataType: 'bigint' } },
    isNullable: false,
  };

  const deleteTrackingTable: DeleteTrackingTable = {
    ...newDeleteTrackingTable(),
    schema: `tracked_changes_${table.schema}`,
    tableName: trackingTableName,
    primaryKeyName: `PK_${trackingTableName}`,
    columns: [...getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME)],
    primaryKeyColumns: [changeVersionColumn],
    isStyle6dot0: true,
    isDescriptorTable: table.existenceReason.parentEntity?.type === 'descriptor',
    isIgnored: table.existenceReason.isSubclassTable,
    changeDataColumns: changeDataColumnsFor(table),
    hardcodedOldColumn: hardcodedOldColumnFor(table),
    omitDiscriminator: table.schema === 'edfi' && table.tableId === 'SchoolYearType',
    includeNamespace: hasRequiredNonIdentityNamespaceColumn(table),
  };

  deleteTrackingTable.columns.push({
    ...newColumn(),
    columnId: 'Id',
    data: { edfiOdsSqlServer: { columnName: 'Id', dataType: 'uniqueidentifier' } },
    isNullable: false,
  });

  deleteTrackingTable.columns.push(changeVersionColumn);

  return deleteTrackingTable;
}

export function createDeleteTrackingTableModel(metaEd: MetaEdEnvironment, table: Table): DeleteTrackingTable {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;

  if (versionSatisfies(targetTechnologyVersion, '<3.4.0')) {
    return createDeleteTrackingTableModelV3dot3(table);
  }

  if (versionSatisfies(targetTechnologyVersion, '<6.0.0')) {
    return createDeleteTrackingTableModelV3dot4(table);
  }

  return createDeleteTrackingTableModelV6dot0(table);
}
