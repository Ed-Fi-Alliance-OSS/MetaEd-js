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
const enhancerName = 'ForeignKeyReverseIndexEnhancer';

function fkColumnsDifferFromPkColumns(fk: ForeignKey, primaryKeyColumnIds: string[]): boolean {
  return R.not(R.equals(getParentTableColumnIds(fk), primaryKeyColumnIds));
}

/**
 * Checks whether a foreign key is solely that of an USI column.
 */
function fkIsOfUsiColumn(fk: ForeignKey): boolean {
  const fkColumnIds: string[] = getParentTableColumnIds(fk);
  if (fkColumnIds.length !== 1) return false;

  if (fk.parentTable.usiColumns.length !== 1) return false;

  return fk.parentTable.usiColumns[0].columnId === fkColumnIds[0];
}

/**
 * Checks whether a foreign key reverse index is unnecessary because one will already be
 * created for its table's education organization id column elsewhere.
 */
function fkIndexCoveredByEducationOrganizationIdColumn(fk: ForeignKey): boolean {
  if (!fk.parentTable.hasEducationOrganizationIdColumns) return false;

  const fkColumnIds: string[] = getParentTableColumnIds(fk);
  if (fkColumnIds.length !== 1) return false;

  const educationOrganizationIdColumnIds: string[] = fk.parentTable.educationOrganizationIdColumns.map(
    (c: Column) => c.columnId,
  );

  return educationOrganizationIdColumnIds.includes(fkColumnIds[0]);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfies(targetTechnologyVersionFor('edfiOdsRelational', metaEd), '>=7.1.0')) {
    metaEd.namespace.forEach((namespace: Namespace) => {
      const tables: Map<string, Table> = tableEntities(metaEd, namespace);
      tables.forEach((table: Table) => {
        const primaryKeyColumnIds: string[] = getPrimaryKeys(table).map((pk: Column) => pk.columnId);

        table.foreignKeys
          .filter((fk: ForeignKey) => fkColumnsDifferFromPkColumns(fk, primaryKeyColumnIds))
          .filter((fk: ForeignKey) => !fkIndexCoveredByEducationOrganizationIdColumn(fk))
          .filter((fk: ForeignKey) => !fkIsOfUsiColumn(fk))
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
