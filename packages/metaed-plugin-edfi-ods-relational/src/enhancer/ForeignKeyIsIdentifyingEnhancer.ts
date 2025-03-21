// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { Column } from '../model/database/Column';
import { ForeignKey, getParentTableColumns } from '../model/database/ForeignKey';
import { Table, getPrimaryKeys } from '../model/database/Table';
import { tableEntities } from './EnhancerHelper';

const enhancerName = 'ForeignKeyIsIdentifyingEnhancer';

// For some reason, this is where all of the source columns in the foreign key are part of the PK
function isIdentifyingForeignKey(foreignKey: ForeignKey): boolean {
  const parentPrimaryKeyColumnIds: string[] = getPrimaryKeys(foreignKey.parentTable).map((c: Column) => c.columnId);

  const foreignKeyToParentColumnIds = getParentTableColumns(foreignKey, foreignKey.foreignTable).map(
    (c: Column) => c.columnId,
  );

  return foreignKeyToParentColumnIds.every((foreignKeyToParentColumnId) =>
    parentPrimaryKeyColumnIds.includes(foreignKeyToParentColumnId),
  );
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);
    tables.forEach((table: Table) => {
      table.foreignKeys.forEach((foreignKey: ForeignKey) => {
        foreignKey.sourceReference.isIdentifying = isIdentifyingForeignKey(foreignKey);
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
