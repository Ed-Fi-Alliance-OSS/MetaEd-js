import { newNamespace, Namespace } from '@edfi/metaed-core';
import {
  addColumn,
  addColumns,
  getAllColumns,
  getColumnWithStrongestConstraint,
  getNonPrimaryKeys,
  getPrimaryKeys,
  newTable,
  Table,
} from '../../../src/model/database/Table';
import { newColumn, Column, StringColumn, DecimalColumn, newColumnNameComponent } from '../../../src/model/database/Column';
import { ColumnTransformUnchanged } from '../../../src/model/database/ColumnTransform';
import {
  ForeignKey,
  createForeignKeyUsingSourceReference,
  newForeignKey,
  newForeignKeySourceReference,
} from '../../../src/model/database/ForeignKey';
import { ForeignKeyStrategyDefault } from '../../../src/model/database/ForeignKeyStrategy';

describe('when getting strongest constrain column with no existing column', (): void => {
  const mockStrategy = jest.fn((existing: Column) => existing);
  const columnName = 'ColumnName';
  let column: Column;

  beforeAll(() => {
    column = getColumnWithStrongestConstraint(
      newTable(),
      { ...newColumn(), type: 'boolean', columnId: columnName },
      mockStrategy,
    );
  });

  it('should not call strategy', (): void => {
    expect(mockStrategy).not.toBeCalled();
  });

  it('should return the column', (): void => {
    expect(column.columnId).toBe(columnName);
    expect(column.type).toBe('boolean');
  });
});

describe('when getting strongest constrain column with an existing column', (): void => {
  const mockStrategy = jest.fn((existing: Column) => existing);
  const columnName = 'ColumnName';
  let existingColumn: Column;
  let receivedColumn: Column;
  let column: Column;
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), tableId: 'TableName' };
    existingColumn = { ...newColumn(), type: 'boolean', columnId: columnName };
    table.columns.push(existingColumn);

    receivedColumn = { ...newColumn(), type: 'boolean', columnId: columnName };
    column = getColumnWithStrongestConstraint(table, receivedColumn, mockStrategy);
  });

  it('should call strategy with both columns', (): void => {
    expect(mockStrategy).toBeCalled();
    expect(mockStrategy).toBeCalledWith(existingColumn, receivedColumn);
    expect(column).toBe(existingColumn);
  });

  it('should remove existing column from table', (): void => {
    expect(table.columns).toHaveLength(0);
  });
});

describe('when using add column', (): void => {
  const columnName = 'ColumnName';
  let table: Table;

  beforeAll(() => {
    table = newTable();
    addColumn(table, { ...newColumn(), type: 'boolean', columnId: columnName });
  });

  it('should add column to table', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(columnName);
    expect(table.columns[0].type).toBe('boolean');
  });
});

describe('when using add column range', (): void => {
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), tableId: 'TableName' };
    table.columns.push({ ...newColumn(), type: 'boolean', columnId: 'BooleanColumnName' });

    addColumns(
      table,
      [
        { ...newColumn(), type: 'boolean', columnId: 'BooleanColumnName' },
        { ...newColumn(), type: 'currency', columnId: 'CurrencyColumnName' },
        { ...newColumn(), type: 'date', columnId: 'DateColumnName' },
        { ...newColumn(), type: 'decimal', scale: '10', precision: '4', columnId: 'DecimalColumnName' } as DecimalColumn,
        { ...newColumn(), type: 'duration', columnId: 'DurationColumnName' },
        { ...newColumn(), type: 'integer', columnId: 'IntegerColumnName' },
        { ...newColumn(), type: 'percent', columnId: 'PercentColumnName' },
        { ...newColumn(), type: 'short', columnId: 'ShortColumnName' },
        { ...newColumn(), type: 'string', length: '100', columnId: 'StringColumnName' } as StringColumn,
        { ...newColumn(), type: 'time', columnId: 'TimeColumnName' },
        { ...newColumn(), type: 'year', columnId: 'YearColumnName' },
      ],
      ColumnTransformUnchanged,
    );
  });

  it('should add all columns except existing', (): void => {
    expect(table.columns).toHaveLength(11);
  });
});

describe('when using table column getters', (): void => {
  const booleanColumnName = 'BooleanColumnName';
  const currencyColumnName = 'CurrencyColumnName';
  const dateColumnName = 'DateColumnName';
  const decimalColumnName = 'DecimalColumnName';
  const durationColumnName = 'DurationColumnName';
  const integerColumnName = 'IntegerColumnName';
  const percentColumnName = 'PercentColumnName';
  const shortColumnName = 'ShortColumnName';
  const stringColumnName = 'StringColumnName';
  const timeColumnName = 'TimeColumnName';
  const yearColumnName = 'YearColumnName';
  const ForeignKeyName1 = 'ForeignKeyName1';
  const ForeignKeyName2 = 'ForeignKeyName2';
  let table: Table;

  beforeAll(() => {
    table = newTable();
    table.columns.push(
      {
        ...newColumn(),
        type: 'boolean',
        columnId: booleanColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: booleanColumnName }],
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
      },
      {
        ...newColumn(),
        type: 'currency',
        columnId: currencyColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: currencyColumnName }],
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
      },
      {
        ...newColumn(),
        type: 'date',
        columnId: dateColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: dateColumnName }],
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
      },
      {
        ...newColumn(),
        type: 'decimal',
        scale: '10',
        precision: '4',
        columnId: decimalColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: decimalColumnName }],
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: true,
        isUniqueIndex: false,
      } as DecimalColumn,
      {
        ...newColumn(),
        type: 'duration',
        columnId: durationColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: durationColumnName }],
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: true,
        isUniqueIndex: false,
      },
      {
        ...newColumn(),
        type: 'integer',
        columnId: integerColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: integerColumnName }],
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: true,
        isUniqueIndex: false,
      },
      {
        ...newColumn(),
        type: 'percent',
        columnId: percentColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: percentColumnName }],
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: true,
      },
      {
        ...newColumn(),
        type: 'short',
        columnId: shortColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: shortColumnName }],
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: true,
      },
      {
        ...newColumn(),
        type: 'string',
        length: '100',
        columnId: stringColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: stringColumnName }],
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: true,
      } as StringColumn,
      {
        ...newColumn(),
        type: 'time',
        columnId: timeColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: timeColumnName }],
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: true,
        isUniqueIndex: false,
      },
      {
        ...newColumn(),
        type: 'year',
        columnId: yearColumnName,
        nameComponents: [{ ...newColumnNameComponent(), name: yearColumnName }],
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: true,
        isUniqueIndex: true,
      },
    );

    table.foreignKeys.push({ ...newForeignKey(), name: ForeignKeyName1 }, { ...newForeignKey(), name: ForeignKeyName2 });
  });

  it('should get all columns with primary keys first', (): void => {
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
    expect(columns.map((x) => x.columnId)).toEqual(expectedOrder);
  });

  it('should get all alternate keys', (): void => {
    const expectedOrder = [booleanColumnName, currencyColumnName, dateColumnName, timeColumnName];
    const columns = table.columns.filter((x) => x.isPartOfAlternateKey);
    expect(columns).toHaveLength(4);
    expect(columns.map((x) => x.columnId)).toEqual(expectedOrder);
  });

  it('should get column view with primary keys first', (): void => {
    const expectedOrder = [
      booleanColumnName,
      currencyColumnName,
      dateColumnName,
      decimalColumnName,
      durationColumnName,
      integerColumnName,
      percentColumnName,
      shortColumnName,
      stringColumnName,
      timeColumnName,
      yearColumnName,
    ];
    expect(table.columns).toHaveLength(11);
    expect(table.columns.map((x) => x.columnId)).toEqual(expectedOrder);
  });

  it('should get all foreign keys', (): void => {
    const expectedOrder = [ForeignKeyName1, ForeignKeyName2];
    const columns = table.foreignKeys;
    expect(columns).toHaveLength(2);
    expect(columns.map((x) => x.name)).toEqual(expectedOrder);
  });

  it('should get all non primary keys', (): void => {
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
    expect(columns.map((x) => x.columnId)).toEqual(expectedOrder);
  });

  it('should get all primary keys', (): void => {
    const expectedOrder = [decimalColumnName, durationColumnName, integerColumnName, timeColumnName, yearColumnName];
    const columns = getPrimaryKeys(table);
    expect(columns).toHaveLength(5);
    expect(columns.map((x) => x.columnId)).toEqual(expectedOrder);
  });

  it('should get all unique indexes', (): void => {
    const expectedOrder = [percentColumnName, shortColumnName, stringColumnName, yearColumnName];
    const columns = table.columns.filter((x) => x.isUniqueIndex);
    expect(columns).toHaveLength(4);
    expect(columns.map((x) => x.columnId)).toEqual(expectedOrder);
  });
});

describe('when using has alternate keys on table with no alternate keys', (): void => {
  let result: boolean;

  beforeAll(() => {
    const table: Table = newTable();
    table.columns.push(
      { ...newColumn(), type: 'boolean', columnId: 'BooleanColumnName', isPartOfAlternateKey: false },
      { ...newColumn(), type: 'currency', columnId: 'CurrencyColumnName', isPartOfAlternateKey: true },
    );
    result = table.columns.some((x) => x.isPartOfAlternateKey);
  });

  it('should return true', (): void => {
    expect(result).toBe(true);
  });
});

describe('when using has alternate keys on table with no alternate keys', (): void => {
  let result: boolean;

  beforeAll(() => {
    const table: Table = newTable();
    table.columns.push(
      { ...newColumn(), type: 'boolean', columnId: 'BooleanColumnName', isPartOfAlternateKey: false },
      { ...newColumn(), type: 'currency', columnId: 'CurrencyColumnName', isPartOfAlternateKey: false },
    );
    result = table.columns.some((x) => x.isPartOfAlternateKey);
  });

  it('should return false', (): void => {
    expect(result).toBe(false);
  });
});

describe('when creating foreign key with single column', (): void => {
  const booleanColumnName = 'BooleanColumnName';
  const foreignTableSchema = 'ForeignTableSchema';
  const foreignTableNamespace: Namespace = { ...newNamespace(), namespaceName: foreignTableSchema };
  const foreignTableId = 'ForeignTableName';
  let foreignKey: ForeignKey;

  beforeAll(() => {
    foreignKey = createForeignKeyUsingSourceReference(
      newForeignKeySourceReference(),
      [{ ...newColumn(), type: 'boolean', columnId: booleanColumnName }],
      foreignTableSchema,
      foreignTableNamespace,
      foreignTableId,
      ForeignKeyStrategyDefault,
    );
  });

  it('should set foreign table schema', (): void => {
    expect(foreignKey.foreignTableSchema).toBe(foreignTableSchema);
  });

  it('should set foreign table name', (): void => {
    expect(foreignKey.foreignTableId).toBe(foreignTableId);
  });

  it('should set delete cascade to false', (): void => {
    expect(foreignKey.withDeleteCascade).toBe(false);
  });

  it('should set with update cascade to false', (): void => {
    expect(foreignKey.withUpdateCascade).toBe(false);
  });

  it('should have parent table column name', (): void => {
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(booleanColumnName);
  });

  it('should have foreign table column name', (): void => {
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(booleanColumnName);
  });
});

describe('when creating foreign key with multiple columns', (): void => {
  const booleanColumnName1 = 'BooleanColumnName1';
  const booleanColumnName2 = 'BooleanColumnName2';
  const foreignTableSchema = 'ForeignTableSchema';
  const foreignTableNamespace: Namespace = { ...newNamespace(), namespaceName: foreignTableSchema };
  const foreignTableId = 'ForeignTableName';
  let foreignKey: ForeignKey;

  beforeAll(() => {
    foreignKey = createForeignKeyUsingSourceReference(
      newForeignKeySourceReference(),
      [
        { ...newColumn(), type: 'boolean', columnId: booleanColumnName1 },
        { ...newColumn(), type: 'boolean', columnId: booleanColumnName2 },
      ],
      foreignTableSchema,
      foreignTableNamespace,
      foreignTableId,
      ForeignKeyStrategyDefault,
    );
  });

  it('should set foreign table schema', (): void => {
    expect(foreignKey.foreignTableSchema).toBe(foreignTableSchema);
  });

  it('should set foreign table name', (): void => {
    expect(foreignKey.foreignTableId).toBe(foreignTableId);
  });

  it('should set delete cascade to false', (): void => {
    expect(foreignKey.withDeleteCascade).toBe(false);
  });

  it('should set with update cascade to false', (): void => {
    expect(foreignKey.withUpdateCascade).toBe(false);
  });

  it('should have first parent table column name', (): void => {
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(booleanColumnName1);
  });

  it('should have first foreign table column name', (): void => {
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(booleanColumnName1);
  });

  it('should have second parent table column name', (): void => {
    expect(foreignKey.columnPairs[1].parentTableColumnId).toBe(booleanColumnName2);
  });

  it('should have second foreign table column name', (): void => {
    expect(foreignKey.columnPairs[1].foreignTableColumnId).toBe(booleanColumnName2);
  });
});
