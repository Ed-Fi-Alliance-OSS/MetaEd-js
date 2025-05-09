// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  EnhancerResult,
  MetaEdEnvironment,
  Namespace,
  targetTechnologyVersionFor,
  versionSatisfies,
} from '@edfi/metaed-core';
import { getPrimaryKeys } from '../model/database/Table';
import { getParentTableColumnIds } from '../model/database/ForeignKey';
import { tableEntities } from './EnhancerHelper';
import { Column } from '../model/database/Column';
import { ForeignKey } from '../model/database/ForeignKey';
import { Table } from '../model/database/Table';

// Calculate if a reverse foreign key index is required for each Foreign Key
const enhancerName = 'ForeignKeyReverseIndexEnhancerV7';

function fkColumnsDifferFromPkColumns(fk: ForeignKey, primaryKeyColumnIds: string[]): boolean {
  return R.not(R.equals(getParentTableColumnIds(fk), primaryKeyColumnIds));
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfies(targetTechnologyVersionFor('edfiOdsRelational', metaEd), '>6.2.0 <=7.0.0')) {
    metaEd.namespace.forEach((namespace: Namespace) => {
      const tables: Map<string, Table> = tableEntities(metaEd, namespace);
      tables.forEach((table: Table) => {
        const primaryKeyColumnIds: string[] = getPrimaryKeys(table).map((pk: Column) => pk.columnId);

        table.foreignKeys
          .filter((fk: ForeignKey) => fkColumnsDifferFromPkColumns(fk, primaryKeyColumnIds))
          .filter((fk: ForeignKey) => !fk.sourceReference.isSubtableRelationship)
          .forEach((fk: ForeignKey) => {
            fk.withReverseForeignKeyIndex = true;
          });
      });
    });
  }
  return {
    enhancerName,
    success: true,
  };
}
