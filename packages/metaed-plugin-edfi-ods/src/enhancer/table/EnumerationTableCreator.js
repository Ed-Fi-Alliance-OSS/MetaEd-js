// @flow
import R from 'ramda';
import { addColumns, newTable } from '../../model/database/Table';
import { ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { newIntegerColumn, newStringColumn } from '../../model/database/Column';
import { normalizeEnumerationSuffix } from '../../shared/Utility';
import type { Table } from '../../model/database/Table';

const removeTypeSuffix = R.when(R.endsWith('Type'), R.dropLast(4));

export const enumerationTableCreator: { build(name: string, namespace: string, documentation: string): Table } = {
  build(name: string, namespace: string, documentation: string): Table {
    const table: Table = Object.assign(newTable(), {
      name: normalizeEnumerationSuffix(name),
      schema: namespace,
      description: documentation,
      includeCreateDateColumn: true,
      includeLastModifiedDateAndIdColumn: true,
    });
    addColumns(table, [
      Object.assign(newIntegerColumn(), {
        name: `${table.name}Id`,
        isIdentityDatabaseType: true,
        isPartOfPrimaryKey: true,
        isNullable: false,
        description: `Key for ${removeTypeSuffix(name)}`,
      }),
      Object.assign(newStringColumn('50'), {
        name: 'CodeValue',
        isPartOfPrimaryKey: false,
        isNullable: false,
        description: 'This column is deprecated.',
      }),
      Object.assign(newStringColumn('1024'), {
        name: 'Description',
        isPartOfPrimaryKey: false,
        isNullable: false,
        description: `The description for the ${removeTypeSuffix(name)} type.`,
      }),
      Object.assign(newStringColumn('450'), {
        name: 'ShortDescription',
        isPartOfPrimaryKey: false,
        isNullable: false,
        description: `The value for the ${removeTypeSuffix(name)} type.`,
      }),
    ], ColumnTransformUnchanged);
    return table;
  },
};
