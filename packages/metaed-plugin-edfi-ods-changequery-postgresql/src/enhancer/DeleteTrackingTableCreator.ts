import { Column, newColumn, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { DeleteTrackingTable, newDeleteTrackingTable, getPrimaryKeys } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';

export function createDeleteTrackingTableModel(_metaEd: MetaEdEnvironment, mainTable: Table): DeleteTrackingTable {
  const trackingTableName: string = mainTable.data.edfiOdsPostgresql.tableName;

  const changeVersionColumn: Column = {
    ...newColumn(),
    columnId: 'ChangeVersion',
    data: { edfiOdsPostgresql: { columnName: 'ChangeVersion', dataType: 'BIGINT' } },
    isNullable: false,
  };

  const deleteTrackingTable: DeleteTrackingTable = {
    ...newDeleteTrackingTable(),
    schema: `tracked_deletes_${mainTable.schema}`,
    tableName: trackingTableName,
    primaryKeyName: mainTable.data.edfiOdsPostgresql.primaryKeyName,
    columns: [...getPrimaryKeys(mainTable, TARGET_DATABASE_PLUGIN_NAME)],
    primaryKeyColumns: [changeVersionColumn],
  };

  deleteTrackingTable.columns.push({
    ...newColumn(),
    columnId: 'Id',
    data: { edfiOdsPostgresql: { columnName: 'Id', dataType: 'UUID' } },
    isNullable: false,
  });

  deleteTrackingTable.columns.push(changeVersionColumn);

  return deleteTrackingTable;
}
