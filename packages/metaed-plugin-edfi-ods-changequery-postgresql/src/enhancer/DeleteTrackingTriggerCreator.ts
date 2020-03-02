import { DeleteTrackingTrigger, getPrimaryKeys } from 'metaed-plugin-edfi-ods-changequery';
import { Table, Column } from 'metaed-plugin-edfi-ods-relational';
import { MetaEdEnvironment } from 'metaed-core';
import { TARGET_DATABASE_PLUGIN_NAME, postgresqlTriggerName } from './EnhancerHelper';

export function createDeleteTrackingTriggerModel(_metaEd: MetaEdEnvironment, mainTable: Table): DeleteTrackingTrigger {
  return {
    triggerSchema: `Tracked_Deletes_${mainTable.schema}`,
    triggerName: postgresqlTriggerName(mainTable, 'TR_DelTrkg'),
    targetTableSchema: mainTable.schema,
    targetTableName: mainTable.data.edfiOdsPostgresql.tableName,
    deleteTrackingTableSchema: `Tracked_Deletes_${mainTable.schema}`,
    deleteTrackingTableName: mainTable.data.edfiOdsPostgresql.tableName,
    primaryKeyColumnNames: getPrimaryKeys(mainTable, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsPostgresql.columnName,
    ),
    targetTableIsSubclass: false,
    foreignKeyToSuperclass: null,
  };
}
