// @flow
import { newIntegerColumn } from '../../../src/model/database/Column';
import {
  ColumnTransform,
  ColumnTransformUnchanged,
  ColumnTransformPrimaryKey,
  ColumnTransformNotNull,
  ColumnTransformNull,
} from '../../../src/model/database/ColumnTransform';
import type { Column } from '../../../src/model/database/Column';

describe('when using default column transform strategy', () => {
  const columns: Array<Column> = [];

  beforeAll(() => {
    columns.push(...ColumnTransformUnchanged.transform([
      Object.assign(newIntegerColumn(), { name: 'PrimaryKey', isPartOfPrimaryKey: true, isNullable: false }),
      Object.assign(newIntegerColumn(), { name: 'NotNull', isPartOfPrimaryKey: false, isNullable: false }),
      Object.assign(newIntegerColumn(), { name: 'Null', isPartOfPrimaryKey: false, isNullable: true }),
    ]));
  });

  it('should not change primary key column', () => {
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should not change not null column', () => {
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].isNullable).toBe(false);
  });

  it('should not change null column', () => {
    expect(columns[2].isPartOfPrimaryKey).toBe(false);
    expect(columns[2].isNullable).toBe(true);
  });
});

describe('when using primary key column transform strategy', () => {
  const columns: Array<Column> = [];

  beforeAll(() => {
    columns.push(...ColumnTransformPrimaryKey.transform([
      Object.assign(newIntegerColumn(), { name: 'Null', isPartOfPrimaryKey: false, isNullable: true }),
    ]));
  });

  it('should convert column to primary key', () => {
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].isNullable).toBe(false);
  });
});

describe('when using not null column transform strategy', () => {
  const columns: Array<Column> = [];

  beforeAll(() => {
    columns.push(...ColumnTransformNotNull.transform([
      Object.assign(newIntegerColumn(), { name: 'PrimaryKey', isPartOfPrimaryKey: true, isNullable: false }),
      Object.assign(newIntegerColumn(), { name: 'Null', isPartOfPrimaryKey: false, isNullable: true }),
    ]));
  });

  it('should convert primary key column to not null', () => {
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should convert null column to not null', () => {
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].isNullable).toBe(false);
  });
});

describe('when using null column transform strategy', () => {
  const columns: Array<Column> = [];

  beforeAll(() => {
    columns.push(...ColumnTransformNull.transform([
      Object.assign(newIntegerColumn(), { name: 'PrimaryKey', isPartOfPrimaryKey: true, isNullable: false }),
    ]));
  });

  it('should convert column to nullable', () => {
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].isNullable).toBe(true);
  });
});

describe('when using with context column transform strategy', () => {
  const columns: Array<Column> = [];
  const primaryKeyName: string = 'PrimaryKeyName';
  const notNullName: string = 'NotNullName';
  const nullName: string = 'NullName';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    columns.push(...ColumnTransform.withContext(contextName).transform([
      Object.assign(newIntegerColumn(), { name: primaryKeyName, isPartOfPrimaryKey: true, isNullable: false }),
      Object.assign(newIntegerColumn(), { name: notNullName, isPartOfPrimaryKey: false, isNullable: false }),
      Object.assign(newIntegerColumn(), { name: nullName, isPartOfPrimaryKey: false, isNullable: true }),
    ]));
  });

  it('should not change primary key column', () => {
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should prefix primary key column name with context', () => {
    expect(columns[0].name).toBe(contextName + primaryKeyName);
  });

  it('should not change not null column', () => {
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].isNullable).toBe(false);
  });

  it('should prefix not null column name with context', () => {
    expect(columns[1].name).toBe(contextName + notNullName);
  });

  it('should not change null column', () => {
    expect(columns[2].isPartOfPrimaryKey).toBe(false);
    expect(columns[2].isNullable).toBe(true);
  });

  it('should prefix null column name with context', () => {
    expect(columns[2].name).toBe(contextName + nullName);
  });
});

describe('when using primary key with context column transform strategy', () => {
  const columns: Array<Column> = [];
  const nullName: string = 'NullName';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    columns.push(...ColumnTransform.primaryKeyWithContext(contextName).transform([
      Object.assign(newIntegerColumn(), { name: nullName, isPartOfPrimaryKey: false, isNullable: true }),
    ]));
  });

  it('should convert column to primary key', () => {
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should prefix column name with context', () => {
    expect(columns[0].name).toBe(contextName + nullName);
  });
});

describe('when using not null with context column transform strategy', () => {
  const columns: Array<Column> = [];
  const primaryKeyName: string = 'PrimaryKeyName';
  const nullName: string = 'NullName';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    columns.push(...ColumnTransform.notNullWithContext(contextName).transform([
      Object.assign(newIntegerColumn(), { name: primaryKeyName, isPartOfPrimaryKey: true, isNullable: false }),
      Object.assign(newIntegerColumn(), { name: nullName, isPartOfPrimaryKey: false, isNullable: true }),
    ]));
  });

  it('should convert primary key column to not nullable', () => {
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should prefix primary key column name with context', () => {
    expect(columns[0].name).toBe(contextName + primaryKeyName);
  });

  it('should convert null column to not nullable', () => {
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].isNullable).toBe(false);
  });

  it('should prefix null column name with context', () => {
    expect(columns[1].name).toBe(contextName + nullName);
  });
});

describe('when using null with context column transform strategy', () => {
  const columns: Array<Column> = [];
  const primaryKeyName: string = 'PrimaryKeyName';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    columns.push(...ColumnTransform.nullWithContext(contextName).transform([
      Object.assign(newIntegerColumn(), { name: primaryKeyName, isPartOfPrimaryKey: true, isNullable: false }),
    ]));
  });

  it('should convert primary key column to nullable', () => {
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].isNullable).toBe(true);
  });

  it('should prefix primary key column name with context', () => {
    expect(columns[0].name).toBe(contextName + primaryKeyName);
  });
});

describe('when using primary key with context collapsible column transform strategy', () => {
  const columns: Array<Column> = [];
  const primaryKeyName: string = 'PrimaryKeyName';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    columns.push(...ColumnTransform.primaryKeyWithContextCollapsible(contextName).transform([
      Object.assign(newIntegerColumn(), { name: primaryKeyName, isPartOfPrimaryKey: true, isNullable: false }),
    ]));
  });

  it('should prefix primary key column name with context', () => {
    expect(columns[0].name).toBe(contextName + primaryKeyName);
  });
});
