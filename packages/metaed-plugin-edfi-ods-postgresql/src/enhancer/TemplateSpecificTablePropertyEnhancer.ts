import { EnhancerResult, MetaEdEnvironment, Namespace, versionSatisfies, V3OrGreater } from '@edfi/metaed-core';
import { tableEntities, Column, Table, escapeSqlSingleQuote } from '@edfi/metaed-plugin-edfi-ods-relational';
import { hasAlternateKeys, getAlternateKeys, getUniqueIndexes, getAllColumns, getPrimaryKeys } from './ColumnOrdering';

// Sets sorted table properties for use by the generator template
const enhancerName = 'TemplateSpecificTablePropertyEnhancer';
const targetVersions: string = V3OrGreater;

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      table.columns.forEach((column: Column) =>
        Object.assign(column, {
          sqlEscapedDescription: escapeSqlSingleQuote(column.description),
        }),
      );
      Object.assign(table, {
        sqlEscapedDescription: escapeSqlSingleQuote(table.description),
        hasAlternateKeys: hasAlternateKeys(table),
        alternateKeys: getAlternateKeys(table),
        columns: getAllColumns(table),
        primaryKeys: table.primaryKeys.length === 0 ? getPrimaryKeys(table) : table.primaryKeys,
        uniqueIndexes: getUniqueIndexes(table),
        isTypeTable: table.tableId.endsWith('Type'), // TODO: this shouldn't rely on table ID, instead look at table parent entity
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
