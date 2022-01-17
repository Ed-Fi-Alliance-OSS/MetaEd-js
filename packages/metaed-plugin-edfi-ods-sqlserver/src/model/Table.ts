import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities, Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ColumnEdfiOdsSqlServer } from './Column';
import { ForeignKeyEdfiOdsSqlServer } from './ForeignKey';

export interface TableEdfiOdsSqlServer {
  tableName: string;
}

const enhancerName = 'SqlServerTableSetupEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      // initialize table
      if (table.data.edfiOdsSqlServer == null) (table.data.edfiOdsSqlServer as TableEdfiOdsSqlServer) = { tableName: '' };

      table.columns.forEach((column: Column) => {
        // initialize column
        if (column.data.edfiOdsSqlServer == null)
          (column.data.edfiOdsSqlServer as ColumnEdfiOdsSqlServer) = { columnName: '', dataType: 'unknown' };
      });

      table.foreignKeys.forEach((foreignKey) => {
        // initialize foreign key
        if (foreignKey.data.edfiOdsSqlServer == null)
          (foreignKey.data.edfiOdsSqlServer as ForeignKeyEdfiOdsSqlServer) = {
            nameSuffix: '',
            foreignKeyName: '',
            parentTableColumnNames: [],
            foreignTableColumnNames: [],
          };
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
