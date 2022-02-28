import { DeleteTrackingTrigger, getPrimaryKeys, newDeleteTrackingTrigger } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { TARGET_DATABASE_PLUGIN_NAME, postgresqlTriggerName } from './EnhancerHelper';

export function createDeleteTrackingTriggerModel(_metaEd: MetaEdEnvironment, mainTable: Table): DeleteTrackingTrigger {
  return {
    ...newDeleteTrackingTrigger(),
    triggerSchema: `tracked_deletes_${mainTable.schema}`,
    triggerName: postgresqlTriggerName(mainTable, 'TR_DelTrkg'),
    targetTableSchema: mainTable.schema,
    targetTableName: mainTable.data.edfiOdsPostgresql.tableName,
    deleteTrackingTableSchema: `tracked_deletes_${mainTable.schema}`,
    deleteTrackingTableName: mainTable.data.edfiOdsPostgresql.tableName,
    primaryKeyColumnNames: getPrimaryKeys(mainTable, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsPostgresql.columnName,
    ),
  };
}
