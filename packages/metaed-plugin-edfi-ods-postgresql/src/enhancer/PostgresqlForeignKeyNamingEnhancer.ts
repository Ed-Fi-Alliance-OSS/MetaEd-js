import { EnhancerResult, MetaEdEnvironment, Namespace, orderByPath } from 'metaed-core';
import {
  tableEntities,
  Table,
  ForeignKey,
  getParentTableColumns,
  getForeignTableColumns,
  Column,
} from 'metaed-plugin-edfi-ods-relational';
import { ForeignKeyEdfiOdsPostgresql } from '../model/ForeignKey';
import { TableEdfiOdsPostgresql } from '../model/Table';

const enhancerName = 'PostgresqlForeignKeyNamingEnhancer';

function suffixDuplicates(foreignKeysWithDuplicateForeignTables: ForeignKey[]) {
  foreignKeysWithDuplicateForeignTables.forEach((foreignKey, index) => {
    if (index > 0) {
      (foreignKey.data.edfiOdsPostgresql as ForeignKeyEdfiOdsPostgresql).nameSuffix = `${index}`;
    }
  });
}

function generateSuffixes(foreignKeys: ForeignKey[]) {
  foreignKeys.forEach((foreignKey) => {
    const foreignKeysWithDuplicateForeignTables: ForeignKey[] = foreignKeys.filter(
      (fk) =>
        fk.foreignTableId === foreignKey.foreignTableId &&
        (foreignKey.data.edfiOdsPostgresql as ForeignKeyEdfiOdsPostgresql).nameSuffix === '',
    );
    if (foreignKeysWithDuplicateForeignTables.length > 1) suffixDuplicates(foreignKeysWithDuplicateForeignTables);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      // foreign key numeric suffixes to resolve duplicate names
      generateSuffixes(table.foreignKeys);

      // add column names
      table.foreignKeys.forEach((foreignKey) => {
        (foreignKey.data.edfiOdsPostgresql as ForeignKeyEdfiOdsPostgresql).foreignKeyName = `FK_${
          (foreignKey.parentTable.data.edfiOdsPostgresql as TableEdfiOdsPostgresql).truncatedTableNameHash
        }_${(foreignKey.foreignTable.data.edfiOdsPostgresql as TableEdfiOdsPostgresql).tableName}${
          (foreignKey.data.edfiOdsPostgresql as ForeignKeyEdfiOdsPostgresql).nameSuffix
        }`;

        const foreignTable: Table | undefined = tableEntities(metaEd, foreignKey.foreignTableNamespace).get(
          foreignKey.foreignTableId,
        );
        (foreignKey.data.edfiOdsPostgresql as ForeignKeyEdfiOdsPostgresql).parentTableColumnNames = getParentTableColumns(
          foreignKey,
          foreignTable,
        ).map((c: Column) => c.data.edfiOdsPostgresql.columnName);
        (foreignKey.data.edfiOdsPostgresql as ForeignKeyEdfiOdsPostgresql).foreignTableColumnNames = getForeignTableColumns(
          foreignKey,
          foreignTable,
        ).map((c: Column) => c.data.edfiOdsPostgresql.columnName);
      });

      // sort foreign keys in order
      table.foreignKeys = orderByPath(['data', 'edfiOdsPostgresql', 'foreignKeyName'])(table.foreignKeys);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
