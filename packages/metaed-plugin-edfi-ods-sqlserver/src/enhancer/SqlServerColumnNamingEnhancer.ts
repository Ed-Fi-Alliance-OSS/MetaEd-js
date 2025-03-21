// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
      if (parseInt((column as StringColumn).maxLength, 10) > 4000) {
        return ColumnDataTypes.string('MAX');
      }
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
