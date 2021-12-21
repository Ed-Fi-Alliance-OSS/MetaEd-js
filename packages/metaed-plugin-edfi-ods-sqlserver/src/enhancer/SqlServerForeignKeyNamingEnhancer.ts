import R from 'ramda';
import { EnhancerResult, MetaEdEnvironment, Namespace, orderByPath } from 'metaed-core';
import {
  tableEntities,
  Table,
  ForeignKey,
  getParentTableColumns,
  getForeignTableColumns,
  Column,
} from 'metaed-plugin-edfi-ods-relational';

const enhancerName = 'SqlServerForeignKeyNamingEnhancer';

const maxSqlServerIdentifierLength = R.take(128);

function nameFor(foreignKey: ForeignKey): string {
  return maxSqlServerIdentifierLength(
    `FK_${foreignKey.parentTable.data.edfiOdsSqlServer.tableName}_${foreignKey.foreignTable.data.edfiOdsSqlServer.tableName}${foreignKey.data.edfiOdsSqlServer.nameSuffix}`,
  );
}

function suffixDuplicates(foreignKeysWithDuplicateForeignTables: ForeignKey[]) {
  foreignKeysWithDuplicateForeignTables.forEach((foreignKey, index) => {
    if (index > 0) {
      foreignKey.data.edfiOdsSqlServer.nameSuffix = `${index}`;
    }
  });
}

function generateSuffixes(foreignKeys: ForeignKey[]) {
  foreignKeys.forEach((foreignKey) => {
    const foreignKeysWithDuplicateForeignTables: ForeignKey[] = foreignKeys.filter(
      (fk) => fk.foreignTableId === foreignKey.foreignTableId && foreignKey.data.edfiOdsSqlServer.nameSuffix === '',
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
        foreignKey.data.edfiOdsSqlServer.foreignKeyName = nameFor(foreignKey);

        const foreignTable: Table | undefined = tableEntities(metaEd, foreignKey.foreignTableNamespace).get(
          foreignKey.foreignTableId,
        );
        foreignKey.data.edfiOdsSqlServer.parentTableColumnNames = getParentTableColumns(foreignKey, foreignTable).map(
          (c: Column) => c.data.edfiOdsSqlServer.columnName,
        );
        foreignKey.data.edfiOdsSqlServer.foreignTableColumnNames = getForeignTableColumns(foreignKey, foreignTable).map(
          (c: Column) => c.data.edfiOdsSqlServer.columnName,
        );
      });

      // sort foreign keys in order
      table.foreignKeys = orderByPath(['data', 'edfiOdsSqlServer', 'foreignKeyName'])(table.foreignKeys);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
