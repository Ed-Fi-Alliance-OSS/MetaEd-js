// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities, Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';

export interface TableEdfiOdsPostgresql {
  tableName: string;
  primaryKeyName: string;
  truncatedTableNameHash: string;
  // If the table has an additional "INCLUDE" column for the unique index, this is the column name
  uniqueIndexIncludeColumnName?: string;
}

const enhancerName = 'PostgresqlTableSetupEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      if (table.data.edfiOdsPostgresql == null)
        table.data.edfiOdsPostgresql = {
          tableName: '',
          primaryKeyName: '',
          tableNameHash: '',
        };

      table.columns.forEach((column: Column) => {
        if (column.data.edfiOdsPostgresql == null) column.data.edfiOdsPostgresql = { columnName: '', dataType: 'unknown' };
      });

      table.foreignKeys.forEach((foreignKey) => {
        if (foreignKey.data.edfiOdsPostgresql == null)
          foreignKey.data.edfiOdsPostgresql = {
            nameSuffix: '',
            name: '',
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
