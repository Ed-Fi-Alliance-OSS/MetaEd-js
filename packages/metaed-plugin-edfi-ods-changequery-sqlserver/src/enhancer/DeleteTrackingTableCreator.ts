import { Column, newColumn, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { DeleteTrackingTable, getPrimaryKeys } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { MetaEdEnvironment, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';

function createDeleteTrackingTableModelV3dot3(mainTable: Table): DeleteTrackingTable {
  const tableName = `${mainTable.schema}_${mainTable.data.edfiOdsSqlServer.tableName}_TrackedDelete`;

  const changeVersionColumn: Column = {
    ...newColumn(),
    columnId: 'ChangeVersion',
    data: { edfiOdsSqlServer: { columnName: 'ChangeVersion', dataType: 'bigint' } },
    isNullable: false,
  };

  const deleteTrackingTable: DeleteTrackingTable = {
    schema: 'changes',
    tableName,
    primaryKeyName: `PK_${tableName}`,
    columns: [...getPrimaryKeys(mainTable, TARGET_DATABASE_PLUGIN_NAME)],
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

function createDeleteTrackingTableModelV3dot4(mainTable: Table): DeleteTrackingTable {
  const trackingTableName: string = mainTable.data.edfiOdsSqlServer.tableName;

  const changeVersionColumn: Column = {
    ...newColumn(),
    columnId: 'ChangeVersion',
    data: { edfiOdsSqlServer: { columnName: 'ChangeVersion', dataType: 'bigint' } },
    isNullable: false,
  };

  const deleteTrackingTable: DeleteTrackingTable = {
    schema: `tracked_deletes_${mainTable.schema}`,
    tableName: trackingTableName,
    primaryKeyName: `PK_${trackingTableName}`,
    columns: [...getPrimaryKeys(mainTable, TARGET_DATABASE_PLUGIN_NAME)],
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

export function createDeleteTrackingTableModel(metaEd: MetaEdEnvironment, mainTable: Table): DeleteTrackingTable {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;

  if (versionSatisfies(targetTechnologyVersion, '<3.4.0')) {
    return createDeleteTrackingTableModelV3dot3(mainTable);
  }

  return createDeleteTrackingTableModelV3dot4(mainTable);
}
