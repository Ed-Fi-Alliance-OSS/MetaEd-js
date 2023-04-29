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
import { ColumnEdfiOdsPostgresql } from '../model/Column';

const enhancerName = 'PostgresqlTableNamingEnhancer';

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
      return ColumnDataTypes.string((column as StringColumn).maxLength);
    default:
      return ColumnDataTypes[column.type];
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      table.columns.forEach((column: Column) => {
        (column.data.edfiOdsPostgresql as ColumnEdfiOdsPostgresql).columnName = constructColumnNameFrom(
          column.nameComponents,
        );
        (column.data.edfiOdsPostgresql as ColumnEdfiOdsPostgresql).dataType = resolveDataType(column);
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
