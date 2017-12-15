// @flow
import {
  addColumn,
  addColumns,
  addForeignKey,
  createForeignKey,
  hasAlternateKeys,
  isForeignKey,
  getAllColumns,
  getAlternateKeys,
  getColumnView,
  getColumnWithStrongestConstraint,
  getForeignKeys,
  getNonPrimaryKeys,
  getPrimaryKeys,
  getUniqueIndexes,
  newTable,
 } from '../../../src/model/database/Table';
import {
  newBooleanColumn,
  newCurrencyColumn,
  newDateColumn,
  newDecimalColumn,
  newDurationColumn,
  newIntegerColumn,
  newPercentColumn,
  newShortColumn,
  newStringColumn,
  newTimeColumn,
  newYearColumn,
 } from '../../../src/model/database/Column';
import { newColumnNamePair } from '../../../src/model/database/ColumnNamePair';
import { ColumnTransformUnchanged } from '../../../src/model/database/ColumnTransform';
import { newForeignKey } from '../../../src/model/database/ForeignKey';
import { ForeignKeyStrategyDefault } from '../../../src/model/database/ForeignKeyStrategy';
import type { Column } from '../../../src/model/database/Column';
import type { Table } from '../../../src/model/database/Table';
import type { ForeignKey } from '../../../src/model/database/ForeignKey';

describe('when getting strongest constrain column with no existing column', () => {
  const mockStrategy = jest.fn((existing: Column) => existing);
  const columnName: string = 'ColumnName';
  let column: Column;

  beforeAll(() => {
    column = getColumnWithStrongestConstraint(
      newTable(),
      Object.assign(newBooleanColumn(), { name: columnName }),
      mockStrategy,
    );
  });

  it('should not call strategy', () => {
    expect(mockStrategy).not.toBeCalled();
  });

  it('should return the column', () => {
    expect(column.name).toBe(columnName);
    expect(column.type).toBe('boolean');
  });
});

describe('when getting strongest constrain column with an existing column', () => {
  const mockStrategy = jest.fn((existing: Column) => existing);
  const columnName: string = 'ColumnName';
  let existingColumn: Column;
  let receivedColumn: Column;
  let column: Column;
  let table: Table;

  beforeAll(() => {
    table = Object.assign(newTable(), { name: 'TableName' });
    existingColumn = Object.assign(newBooleanColumn(), { name: columnName });
    table.columns.push(existingColumn);

    receivedColumn = Object.assign(newBooleanColumn(), { name: columnName });
    column = getColumnWithStrongestConstraint(table, receivedColumn, mockStrategy);
  });

  it('should call strategy with both columns', () => {
    expect(mockStrategy).toBeCalled();
    expect(mockStrategy).toBeCalledWith(existingColumn, receivedColumn);
    expect(column).toBe(existingColumn);
  });

  it('should remove existing column from table', () => {
    expect(table.columns).toHaveLength(0);
  });
});

describe('when using add column', () => {
  const columnName: string = 'ColumnName';
  let table: Table;

  beforeAll(() => {
    table = newTable();
    addColumn(table, Object.assign(newBooleanColumn(), { name: columnName }));
  });

  it('should add column to table', () => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(columnName);
    expect(table.columns[0].type).toBe('boolean');
  });
});

describe('when using add column range', () => {
  let table: Table;

  beforeAll(() => {
    table = Object.assign(newTable(), { name: 'TableName' });
    table.columns.push(Object.assign(newBooleanColumn(), { name: 'BooleanColumnName' }));

    addColumns(table, [
      Object.assign(newBooleanColumn(), { name: 'BooleanColumnName' }),
      Object.assign(newCurrencyColumn(), { name: 'CurrencyColumnName' }),
      Object.assign(newDateColumn(), { name: 'DateColumnName' }),
      Object.assign(newDecimalColumn('10', '4'), { name: 'DecimalColumnName' }),
      Object.assign(newDurationColumn(), { name: 'DurationColumnName' }),
      Object.assign(newIntegerColumn(), { name: 'IntegerColumnName' }),
      Object.assign(newPercentColumn(), { name: 'PercentColumnName' }),
      Object.assign(newShortColumn(), { name: 'ShortColumnName' }),
      Object.assign(newStringColumn('100'), { name: 'StringColumnName' }),
      Object.assign(newTimeColumn(), { name: 'TimeColumnName' }),
      Object.assign(newYearColumn(), { name: 'YearColumnName' }),
    ], ColumnTransformUnchanged);
  });

  it('should add all columns except existing', () => {
    expect(table.columns).toHaveLength(11);
  });
});

describe('when using table column getters', () => {
  const booleanColumnName: string = 'BooleanColumnName';
  const currencyColumnName: string = 'CurrencyColumnName';
  const dateColumnName: string = 'DateColumnName';
  const decimalColumnName: string = 'DecimalColumnName';
  const durationColumnName: string = 'DurationColumnName';
  const integerColumnName: string = 'IntegerColumnName';
  const percentColumnName: string = 'PercentColumnName';
  const shortColumnName: string = 'ShortColumnName';
  const stringColumnName: string = 'StringColumnName';
  const timeColumnName: string = 'TimeColumnName';
  const yearColumnName: string = 'YearColumnName';
  const ForeignKeyName1: string = 'ForeignKeyName1';
  const ForeignKeyName2: string = 'ForeignKeyName2';
  let table: Table;

  beforeAll(() => {
    table = newTable();
    table.columns.push(...[
      Object.assign(newBooleanColumn(), {
        name: booleanColumnName,
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
      }),
      Object.assign(newCurrencyColumn(), {
        name: currencyColumnName,
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
      }),
      Object.assign(newDateColumn(), {
        name: dateColumnName,
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
      }),
      Object.assign(newDecimalColumn('10',
      '4'), {
        name: decimalColumnName,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: true,
        isUniqueIndex: false,
      }),
      Object.assign(newDurationColumn(), {
        name: durationColumnName,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: true,
        isUniqueIndex: false,
      }),
      Object.assign(newIntegerColumn(), {
        name: integerColumnName,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: true,
        isUniqueIndex: false,
      }),
      Object.assign(newPercentColumn(), {
        name: percentColumnName,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: true,
      }),
      Object.assign(newShortColumn(), {
        name: shortColumnName,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: true,
      }),
      Object.assign(newStringColumn('100'), {
        name: stringColumnName,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: true,
      }),
      Object.assign(newTimeColumn(), {
        name: timeColumnName,
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: true,
        isUniqueIndex: false,
      }),
      Object.assign(newYearColumn(), {
        name: yearColumnName,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: true,
        isUniqueIndex: true,
      }),
    ]);

    table.foreignKeys.push(...[
      Object.assign(newForeignKey(), {
        name: ForeignKeyName1,
      }),
      Object.assign(newForeignKey(), {
        name: ForeignKeyName2,
      }),
    ]);
  });

  it('should get all columns with primary keys first', () => {
    const expectedOrder = [
      decimalColumnName,
      durationColumnName,
      integerColumnName,
      timeColumnName,
      yearColumnName,
      booleanColumnName,
      currencyColumnName,
      dateColumnName,
      percentColumnName,
      shortColumnName,
      stringColumnName,
    ];
    const columns = getAllColumns(table);
    expect(columns).toHaveLength(11);
    expect(columns.map(x => x.name)).toEqual(expectedOrder);
  });

  it('should get all alternate keys', () => {
    const expectedOrder = [
      booleanColumnName,
      currencyColumnName,
      dateColumnName,
      timeColumnName,
    ];
    const columns = getAlternateKeys(table);
    expect(columns).toHaveLength(4);
    expect(columns.map(x => x.name)).toEqual(expectedOrder);
  });

  it('should get column view with primary keys first', () => {
    const expectedOrder = [
      decimalColumnName,
      durationColumnName,
      integerColumnName,
      timeColumnName,
      yearColumnName,
      booleanColumnName,
      currencyColumnName,
      dateColumnName,
      percentColumnName,
      shortColumnName,
      stringColumnName,
    ];
    const columns = getColumnView(table);
    expect(columns).toHaveLength(11);
    expect(columns.map(x => x.name)).toEqual(expectedOrder);
  });

  it('should get all foreign keys', () => {
    const expectedOrder = [
      ForeignKeyName1,
      ForeignKeyName2,
    ];
    const columns = getForeignKeys(table);
    expect(columns).toHaveLength(2);
    expect(columns.map(x => x.name)).toEqual(expectedOrder);
  });

  it('should get all non primary keys', () => {
    const expectedOrder = [
      booleanColumnName,
      currencyColumnName,
      dateColumnName,
      percentColumnName,
      shortColumnName,
      stringColumnName,
    ];
    const columns = getNonPrimaryKeys(table);
    expect(columns).toHaveLength(6);
    expect(columns.map(x => x.name)).toEqual(expectedOrder);
  });

  it('should get all primary keys', () => {
    const expectedOrder = [
      decimalColumnName,
      durationColumnName,
      integerColumnName,
      timeColumnName,
      yearColumnName,
    ];
    const columns = getPrimaryKeys(table);
    expect(columns).toHaveLength(5);
    expect(columns.map(x => x.name)).toEqual(expectedOrder);
  });

  it('should get all unique indexes', () => {
    const expectedOrder = [
      percentColumnName,
      shortColumnName,
      stringColumnName,
      yearColumnName,
    ];
    const columns = getUniqueIndexes(table);
    expect(columns).toHaveLength(4);
    expect(columns.map(x => x.name)).toEqual(expectedOrder);
  });
});

describe('when using has alternate keys on table with no alternate keys', () => {
  let result: boolean;

  beforeAll(() => {
    const table: Table = newTable();
    table.columns.push(...[
      Object.assign(newBooleanColumn(), { name: 'BooleanColumnName', isPartOfAlternateKey: false }),
      Object.assign(newCurrencyColumn(), { name: 'CurrencyColumnName', isPartOfAlternateKey: true }),
    ]);
    result = hasAlternateKeys(table);
  });

  it('should return true', () => {
    expect(result).toBe(true);
  });
});

describe('when using has alternate keys on table with no alternate keys', () => {
  let result: boolean;

  beforeAll(() => {
    const table: Table = newTable();
    table.columns.push(...[
      Object.assign(newBooleanColumn(), { name: 'BooleanColumnName', isPartOfAlternateKey: false }),
      Object.assign(newCurrencyColumn(), { name: 'CurrencyColumnName', isPartOfAlternateKey: false }),
    ]);
    result = hasAlternateKeys(table);
  });

  it('should return false', () => {
    expect(result).toBe(false);
  });
});

describe('when using is foreign key', () => {
  let booleanColumnResult: boolean;
  let currencyColumnResult: boolean;

  beforeAll(() => {
    const booleanColumnName: string = 'BooleanColumnName';

    const booleanForeignKey: ForeignKey = Object.assign(newForeignKey(), {
      name: booleanColumnName,
      columnNames: [
        Object.assign(newColumnNamePair(), { parentTableColumnName: booleanColumnName }),
      ],
    });

    const table: Table = Object.assign(newTable(), {
      foreignKeys: [
        booleanForeignKey,
        Object.assign(newForeignKey(), { name: 'CurrencyColumnName' }),
      ],
    });

    const booleanColumn: Column = Object.assign(newBooleanColumn(), { name: booleanColumnName, isPartOfAlternateKey: false });
    const currencyColumn: Column = Object.assign(newCurrencyColumn(), { name: 'CurrencyColumnName', isPartOfAlternateKey: false });
    booleanColumnResult = isForeignKey(table, booleanColumn);
    currencyColumnResult = isForeignKey(table, currencyColumn);
  });

  it('should return true when column is a foreign key', () => {
    expect(booleanColumnResult).toBe(true);
  });

  it('should return false when column is not a foreign key', () => {
    expect(currencyColumnResult).toBe(false);
  });
});

describe('when adding a foreign key with no existing foreign keys', () => {
  const tableName: string = 'TableName';
  const tableSchema: string = 'TableSchema';
  const foreignTableName: string = 'ForeignTableName';
  let table: Table;

  beforeAll(() => {
    table = Object.assign(newTable(), { name: tableName, schema: tableSchema });
    addForeignKey(table, Object.assign(newForeignKey(), { foreignTableName }));
  });

  it('should add foreign key', () => {
    expect(table.foreignKeys).toHaveLength(1);
    expect(table.foreignKeys[0].parentTable).toBe(table);
    expect(table.foreignKeys[0].parentTableName).toBe(tableName);
    expect(table.foreignKeys[0].parentTableSchema).toBe(tableSchema);
    expect(table.foreignKeys[0].foreignKeyNameSuffix).toBe('');
  });
});

describe('when adding a foreign key with existing foreign key', () => {
  const parentTableName: string = 'ParentTableName';
  const parentTableSchema: string = 'ParentTableSchema';
  const foreignTableName: string = 'ForeignTableName';
  let table: Table;

  beforeAll(() => {
    table = Object.assign(newTable(), { name: parentTableName, schema: parentTableSchema });
    addForeignKey(table, Object.assign(newForeignKey(), {
      parentTableName,
      foreignTableName,
    }));
    addForeignKey(table, Object.assign(newForeignKey(), {
      parentTableName,
      foreignTableName,
    }));
    addForeignKey(table, Object.assign(newForeignKey(), {
      parentTableName,
      foreignTableName,
    }));
  });

  it('should add foreign keys', () => {
    expect(table.foreignKeys).toHaveLength(3);
    expect(table.foreignKeys[0].parentTable).toBe(table);
    expect(table.foreignKeys[0].parentTableName).toBe(parentTableName);
    expect(table.foreignKeys[0].parentTableSchema).toBe(parentTableSchema);
    expect(table.foreignKeys[0].foreignKeyNameSuffix).toBe('');

    expect(table.foreignKeys[1].parentTable).toBe(table);
    expect(table.foreignKeys[1].parentTableName).toBe(parentTableName);
    expect(table.foreignKeys[1].parentTableSchema).toBe(parentTableSchema);
    expect(table.foreignKeys[1].foreignKeyNameSuffix).toBe('1');

    expect(table.foreignKeys[2].parentTable).toBe(table);
    expect(table.foreignKeys[2].parentTableName).toBe(parentTableName);
    expect(table.foreignKeys[2].parentTableSchema).toBe(parentTableSchema);
    expect(table.foreignKeys[2].foreignKeyNameSuffix).toBe('2');
  });
});

describe('when creating foreign key with single column', () => {
  const booleanColumnName: string = 'BooleanColumnName';
  const foreignTableSchema: string = 'ForeignTableSchema';
  const foreignTableName: string = 'ForeignTableName';
  let foreignKey: ForeignKey;

  beforeAll(() => {
    foreignKey = createForeignKey(
      [Object.assign(newBooleanColumn(), { name: booleanColumnName })],
      foreignTableSchema,
      foreignTableName,
      ForeignKeyStrategyDefault,
    );
  });

  it('should set foreign table schema', () => {
    expect(foreignKey.foreignTableSchema).toBe(foreignTableSchema);
  });

  it('should set foreign table name', () => {
    expect(foreignKey.foreignTableName).toBe(foreignTableName);
  });

  it('should set delete cascade to false', () => {
    expect(foreignKey.withDeleteCascade).toBe(false);
  });

  it('should set with update cascade to false', () => {
    expect(foreignKey.withUpdateCascade).toBe(false);
  });

  it('should have parent table column name', () => {
    expect(foreignKey.columnNames[0].parentTableColumnName).toBe(booleanColumnName);
  });

  it('should have foreign table column name', () => {
    expect(foreignKey.columnNames[0].foreignTableColumnName).toBe(booleanColumnName);
  });
});

describe('when creating foreign key with multiple columns', () => {
  const booleanColumnName1: string = 'BooleanColumnName1';
  const booleanColumnName2: string = 'BooleanColumnName2';
  const foreignTableSchema: string = 'ForeignTableSchema';
  const foreignTableName: string = 'ForeignTableName';
  let foreignKey: ForeignKey;

  beforeAll(() => {
    foreignKey = createForeignKey(
      [
        Object.assign(newBooleanColumn(), { name: booleanColumnName1 }),
        Object.assign(newBooleanColumn(), { name: booleanColumnName2 }),
      ],
      foreignTableSchema,
      foreignTableName,
      ForeignKeyStrategyDefault,
    );
  });

  it('should set foreign table schema', () => {
    expect(foreignKey.foreignTableSchema).toBe(foreignTableSchema);
  });

  it('should set foreign table name', () => {
    expect(foreignKey.foreignTableName).toBe(foreignTableName);
  });

  it('should set delete cascade to false', () => {
    expect(foreignKey.withDeleteCascade).toBe(false);
  });

  it('should set with update cascade to false', () => {
    expect(foreignKey.withUpdateCascade).toBe(false);
  });

  it('should have first parent table column name', () => {
    expect(foreignKey.columnNames[0].parentTableColumnName).toBe(booleanColumnName1);
  });

  it('should have first foreign table column name', () => {
    expect(foreignKey.columnNames[0].foreignTableColumnName).toBe(booleanColumnName1);
  });

  it('should have second parent table column name', () => {
    expect(foreignKey.columnNames[1].parentTableColumnName).toBe(booleanColumnName2);
  });

  it('should have second foreign table column name', () => {
    expect(foreignKey.columnNames[1].foreignTableColumnName).toBe(booleanColumnName2);
  });
});
