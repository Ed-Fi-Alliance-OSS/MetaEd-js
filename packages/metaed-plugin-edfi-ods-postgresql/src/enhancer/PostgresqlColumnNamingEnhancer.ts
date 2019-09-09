import { EnhancerResult, MetaEdEnvironment, Namespace } from 'metaed-core';
import {
  tableEntities,
  Table,
  Column,
  ColumnNameComponent,
  DecimalColumn,
  StringColumn,
} from 'metaed-plugin-edfi-ods-relational';
import { appendOverlapCollapsing } from './AppendOverlapCollapsing';
import { ColumnDataTypes } from '../model/ColumnDataTypes';

const enhancerName = 'PostgresqlTableNamingEnhancer';

function simpleColumnNameComponentCollapse(columnNameComponent: ColumnNameComponent[]): string {
  return columnNameComponent.map(nameComponent => nameComponent.name).reduce(appendOverlapCollapsing, '');
}

export function constructNameFrom(columnNameComponent: ColumnNameComponent[]): string {
  return simpleColumnNameComponentCollapse(columnNameComponent);
}

export function resolveDataType(column: Column): string {
  switch (column.type) {
    case 'decimal':
      return ColumnDataTypes.decimal((column as DecimalColumn).precision, (column as DecimalColumn).scale);
    case 'string':
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
        column.data.edfiOdsPostgresql.columnName = constructNameFrom(column.nameComponents);
        column.data.edfiOdsPostgresql.dataType = resolveDataType(column);
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
