// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import {
  hasAlternateKeys,
  getAllColumns,
  getPrimaryKeys,
  getAlternateKeys,
  getUniqueIndexes,
  getForeignKeys,
  getForeignKeyName,
} from '../model/database/Table';
import { escapeSqlSingleQuote } from '../shared/Utility';
import { getForeignTableColumnNames, getParentTableColumnNames } from '../model/database/ForeignKey';
import { insertUpdateDelete } from '../model/database/Trigger';
import { pluginEnvironment } from './EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';
import type { Trigger } from '../model/database/Trigger';

// Sets sorted table properties for use by the generator template
const enhancerName: string = 'TemplateSpecificTablePropertyEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  pluginEnvironment(metaEd).entity.table.forEach((table: Table) => {
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
      isTypeTable: table.name.endsWith('Type'),
    });

    table.foreignKeys.forEach((foreignKey: ForeignKey) => {
      const foreignTable: Table = pluginEnvironment(metaEd).entity.table.get(foreignKey.foreignTableName);
      Object.assign(foreignKey, {
        name: getForeignKeyName(foreignKey),
        parentTableColumnNames: getParentTableColumnNames(foreignKey, foreignTable),
        foreignTableColumnNames: getForeignTableColumnNames(foreignKey, foreignTable),
      });
      table.foreignKeys = getForeignKeys(table);
    });
  });

  pluginEnvironment(metaEd).entity.trigger.forEach((trigger: Trigger) => {
    trigger.insertUpdateDelete = insertUpdateDelete(trigger);
  });

  return {
    enhancerName,
    success: true,
  };
}
