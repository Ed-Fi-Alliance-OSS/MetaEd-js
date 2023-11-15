import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { tableEntities, Column, Table, escapeSqlSingleQuote } from '@edfi/metaed-plugin-edfi-ods-relational';
import { hasAlternateKeys, getAlternateKeys, getPrimaryKeys, getUniqueIndexes, getAllColumns } from './ColumnOrdering';

// Sets sorted table properties for use by the generator template
const enhancerName = 'TemplateSpecificTablePropertyEnhancer';

/** Returns the column name for a column that should be INCLUDEd in the unique index, if any */
function findUniqueIndexIncludeColumnName(table: Table): string | undefined {
  const uniqueIndexIncludeColumn: Column | undefined = table.columns.find((c: Column) => c.isFromUsiProperty);
  return uniqueIndexIncludeColumn ? uniqueIndexIncludeColumn.data.edfiOdsSqlServer.columnName : undefined;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, '>=7.1.0')) return { enhancerName, success: true };

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
      table.data.edfiOdsSqlServer.uniqueIndexIncludeColumnName = findUniqueIndexIncludeColumnName(table);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
