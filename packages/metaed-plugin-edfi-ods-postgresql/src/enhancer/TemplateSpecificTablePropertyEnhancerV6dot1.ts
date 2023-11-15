import {
  defaultPluginTechVersion,
  EnhancerResult,
  MetaEdEnvironment,
  Namespace,
  versionSatisfies,
  PluginEnvironment,
} from '@edfi/metaed-core';
import { tableEntities, Column, Table, escapeSqlSingleQuote } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  hasAlternateKeys,
  getAlternateKeys,
  getUniqueIndexes,
  getAllColumnsV6dot1,
  getPrimaryKeysV6dot1,
} from './ColumnOrdering';

// Sets sorted table properties for use by the generator template
const enhancerName = 'TemplateSpecificTablePropertyEnhancerV6dot1';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, `>=${defaultPluginTechVersion} <7.1.0`))
    return { enhancerName, success: true };

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
        columns: getAllColumnsV6dot1(table),
        primaryKeys: table.primaryKeys.length === 0 ? getPrimaryKeysV6dot1(table) : table.primaryKeys,
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
