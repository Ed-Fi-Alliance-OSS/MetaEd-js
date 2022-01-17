import { EntityProperty, newBooleanProperty } from '@edfi/metaed-core';
import { newColumn } from '../../../src/model/database/Column';
import {
  ColumnTransform,
  ColumnTransformUnchanged,
  ColumnTransformPrimaryKey,
  ColumnTransformNotNull,
  ColumnTransformNull,
} from '../../../src/model/database/ColumnTransform';
import { Column } from '../../../src/model/database/Column';

describe('when using default column transform strategy', (): void => {
  const columns: Column[] = [];

  beforeAll(() => {
    columns.push(
      ...ColumnTransformUnchanged.transform([
        { ...newColumn(), type: 'integer', columnId: 'PrimaryKey', isPartOfPrimaryKey: true, isNullable: false },
        { ...newColumn(), type: 'integer', columnId: 'NotNull', isPartOfPrimaryKey: false, isNullable: false },
        { ...newColumn(), type: 'integer', columnId: 'Null', isPartOfPrimaryKey: false, isNullable: true },
      ]),
    );
  });

  it('should not change primary key column', (): void => {
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should not change not null column', (): void => {
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].isNullable).toBe(false);
  });

  it('should not change null column', (): void => {
    expect(columns[2].isPartOfPrimaryKey).toBe(false);
    expect(columns[2].isNullable).toBe(true);
  });
});

describe('when using primary key column transform strategy', (): void => {
  const columns: Column[] = [];

  beforeAll(() => {
    columns.push(
      ...ColumnTransformPrimaryKey.transform([
        { ...newColumn(), type: 'integer', columnId: 'Null', isPartOfPrimaryKey: false, isNullable: true },
      ]),
    );
  });

  it('should convert column to primary key', (): void => {
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].isNullable).toBe(false);
  });
});

describe('when using not null column transform strategy', (): void => {
  const columns: Column[] = [];

  beforeAll(() => {
    columns.push(
      ...ColumnTransformNotNull.transform([
        { ...newColumn(), type: 'integer', columnId: 'PrimaryKey', isPartOfPrimaryKey: true, isNullable: false },
        { ...newColumn(), type: 'integer', columnId: 'Null', isPartOfPrimaryKey: false, isNullable: true },
      ]),
    );
  });

  it('should convert primary key column to not null', (): void => {
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should convert null column to not null', (): void => {
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].isNullable).toBe(false);
  });
});

describe('when using null column transform strategy', (): void => {
  const columns: Column[] = [];

  beforeAll(() => {
    columns.push(
      ...ColumnTransformNull.transform([
        { ...newColumn(), type: 'integer', columnId: 'PrimaryKey', isPartOfPrimaryKey: true, isNullable: false },
      ]),
    );
  });

  it('should convert column to nullable', (): void => {
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].isNullable).toBe(true);
  });
});

describe('when using primary key role name column transform strategy', (): void => {
  const columns: Column[] = [];
  const nullName = 'NullName';
  const contextName = 'ContextName';
  const contextProperty: EntityProperty = {
    ...newBooleanProperty(),
    metaEdName: 'PropertyName',
    roleName: contextName,
    data: { edfiOdsRelational: { odsContextPrefix: contextName } },
  };

  beforeAll(() => {
    columns.push(
      ...ColumnTransform.primaryKeyRoleName(contextProperty).transform([
        { ...newColumn(), type: 'integer', columnId: nullName, isPartOfPrimaryKey: false, isNullable: true },
      ]),
    );
  });

  it('should convert column to primary key', (): void => {
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should prefix column name role name', (): void => {
    expect(columns[0].columnId).toBe(contextName + nullName);
  });
});

describe('when using not null role name column transform strategy', (): void => {
  const columns: Column[] = [];
  const primaryKeyName = 'PrimaryKeyName';
  const nullName = 'NullName';
  const contextName = 'ContextName';
  const contextProperty: EntityProperty = {
    ...newBooleanProperty(),
    metaEdName: 'PropertyName',
    roleName: contextName,
    data: { edfiOdsRelational: { odsContextPrefix: contextName } },
  };

  beforeAll(() => {
    columns.push(
      ...ColumnTransform.notNullRoleName(contextProperty).transform([
        { ...newColumn(), type: 'integer', columnId: primaryKeyName, isPartOfPrimaryKey: true, isNullable: false },
        { ...newColumn(), type: 'integer', columnId: nullName, isPartOfPrimaryKey: false, isNullable: true },
      ]),
    );
  });

  it('should convert primary key column to not nullable', (): void => {
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].isNullable).toBe(false);
  });

  it('should prefix primary key column name role name', (): void => {
    expect(columns[0].columnId).toBe(contextName + primaryKeyName);
  });

  it('should convert null column to not nullable', (): void => {
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].isNullable).toBe(false);
  });

  it('should prefix null column name role name', (): void => {
    expect(columns[1].columnId).toBe(contextName + nullName);
  });
});

describe('when using null role name column transform strategy', (): void => {
  const columns: Column[] = [];
  const primaryKeyName = 'PrimaryKeyName';
  const contextName = 'ContextName';
  const contextProperty: EntityProperty = {
    ...newBooleanProperty(),
    metaEdName: 'PropertyName',
    roleName: contextName,
    data: { edfiOdsRelational: { odsContextPrefix: contextName } },
  };

  beforeAll(() => {
    columns.push(
      ...ColumnTransform.nullRoleName(contextProperty).transform([
        { ...newColumn(), type: 'integer', columnId: primaryKeyName, isPartOfPrimaryKey: true, isNullable: false },
      ]),
    );
  });

  it('should convert primary key column to nullable', (): void => {
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].isNullable).toBe(true);
  });

  it('should prefix primary key column name role name', (): void => {
    expect(columns[0].columnId).toBe(contextName + primaryKeyName);
  });
});

describe('when using primary key role name collapsible column transform strategy', (): void => {
  const columns: Column[] = [];
  const primaryKeyName = 'PrimaryKeyName';
  const contextName = 'ContextName';
  const contextProperty: EntityProperty = {
    ...newBooleanProperty(),
    metaEdName: 'PropertyName',
    roleName: contextName,
    data: { edfiOdsRelational: { odsContextPrefix: contextName } },
  };

  beforeAll(() => {
    columns.push(
      ...ColumnTransform.primaryKeyRoleNameCollapsible(contextProperty).transform([
        { ...newColumn(), type: 'integer', columnId: primaryKeyName, isPartOfPrimaryKey: true, isNullable: false },
      ]),
    );
  });

  it('should prefix primary key column name role name', (): void => {
    expect(columns[0].columnId).toBe(contextName + primaryKeyName);
  });
});
