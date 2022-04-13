import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  appendOverlapCollapsing,
  tableEntities,
  Table,
  Column,
  ColumnNameComponent,
  DecimalColumn,
  StringColumn,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { ColumnDataTypes } from '../model/ColumnDataTypes';

const enhancerName = 'SqlServerColumnNamingEnhancer';

function simpleColumnNameComponentCollapse(columnNameComponent: ColumnNameComponent[]): string {
  return columnNameComponent.map((nameComponent) => nameComponent.name).reduce(appendOverlapCollapsing, '');
}

export function constructColumnNameFrom(columnNameComponent: ColumnNameComponent[]): string {
  return simpleColumnNameComponentCollapse(columnNameComponent);
}

export function resolveDataType(column: Column): string {
  switch (column.type) {
    case 'decimal':
      return ColumnDataTypes.decimal((column as DecimalColumn).precision, (column as DecimalColumn).scale);
    case 'string':
      // SQL Server supports up to 4000 characters in an NVARCHAR, for anything bigger it needs to be an NVARCHAR(MAX)
      if (parseInt((column as StringColumn).length, 10) > 4000) {
        return ColumnDataTypes.string('MAX');
      }
      return ColumnDataTypes.string((column as StringColumn).length);
    default:
      return ColumnDataTypes[column.type];
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      table.columns.forEach((column: Column) => {
        column.data.edfiOdsSqlServer.columnName = constructColumnNameFrom(column.nameComponents);
        column.data.edfiOdsSqlServer.dataType = resolveDataType(column);
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
