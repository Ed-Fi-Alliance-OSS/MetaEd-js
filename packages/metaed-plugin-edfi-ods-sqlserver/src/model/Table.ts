// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities, Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ColumnEdfiOdsSqlServer } from './Column';
import { ForeignKeyEdfiOdsSqlServer } from './ForeignKey';

export interface TableEdfiOdsSqlServer {
  tableName: string;
  // If the table has an additional "INCLUDE" column for the unique index, this is the column name
  uniqueIndexIncludeColumnName?: string;
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
