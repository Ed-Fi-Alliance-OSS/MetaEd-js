// @flow
import { addColumnNamePair, newForeignKey } from '../../../src/model/database/ForeignKey';
import { newColumnNamePair } from '../../../src/model/database/ColumnNamePair';
import type { ForeignKey } from '../../../src/model/database/ForeignKey';

describe('when using add column name pair to a foreign key with no existing duplicates', () => {
  const parentTableColumnName: string = 'ParentTableColumnName';
  const foreignTableColumnName: string = 'ForeignTableColumnName';
  let foreignKey: ForeignKey;

  beforeAll(() => {
    foreignKey = Object.assign(newForeignKey(), { name: 'ForeignKeyName' });
    addColumnNamePair(foreignKey, Object.assign(newColumnNamePair(), {
      parentTableColumnName,
      foreignTableColumnName,
    }));
  });

  it('should successfully add column name pair', () => {
    expect(foreignKey.columnNames).toHaveLength(1);
    expect(foreignKey.columnNames[0].parentTableColumnName).toBe(parentTableColumnName);
    expect(foreignKey.columnNames[0].foreignTableColumnName).toBe(foreignTableColumnName);
  });
});

describe('when using add column name pair to a foreign key with existing duplicate', () => {
  const parentTableColumnName: string = 'ParentTableColumnName';
  const foreignTableColumnName: string = 'ForeignTableColumnName';
  let foreignKey: ForeignKey;

  beforeAll(() => {
    foreignKey = Object.assign(newForeignKey(), { name: 'ForeignKeyName' });
    addColumnNamePair(foreignKey, Object.assign(newColumnNamePair(), {
      parentTableColumnName,
      foreignTableColumnName,
    }));
    addColumnNamePair(foreignKey, Object.assign(newColumnNamePair(), {
      parentTableColumnName,
      foreignTableColumnName,
    }));
  });

  it('should reject incoming column name pair', () => {
    expect(foreignKey.columnNames).toHaveLength(1);
    expect(foreignKey.columnNames[0].parentTableColumnName).toBe(parentTableColumnName);
    expect(foreignKey.columnNames[0].foreignTableColumnName).toBe(foreignTableColumnName);
  });
});
