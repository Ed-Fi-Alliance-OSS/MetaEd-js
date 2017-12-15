// @flow
import R from 'ramda';
import type { MetaEdEnvironment } from 'metaed-core';
import { newMetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/enhancer/TemplateSpecificTablePropertyEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnNamePair } from '../../src/model/database/ColumnNamePair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { newTrigger } from '../../src/model/database/Trigger';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { Column } from '../../src/model/database/Column';
import type { Table } from '../../src/model/database/Table';
import type { Trigger } from '../../src/model/database/Trigger';

describe('when TemplateSpecificTablePropertyEnhancer enhances table with alternate keys', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const tableName: string = 'TableName';
  const alternateKeyName1: string = 'AlternateKeyName1';
  const alternateKeyName2: string = 'AlternateKeyName2';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: tableName,
      columns: [
        Object.assign(newColumn(), {
          name: alternateKeyName2,
          isPartOfAlternateKey: true,
        }),
        Object.assign(newColumn(), {
          name: 'ColumnName',
        }),
        Object.assign(newColumn(), {
          name: alternateKeyName1,
          isPartOfAlternateKey: true,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have hasAlternateKeys property set to true', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).hasAlternateKeys).toBe(true);
  });

  it('should have correct alternate key order', () => {
    const alternateKeys: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).alternateKeys;
    expect(alternateKeys).toHaveLength(2);
    expect(alternateKeys.map(x => x.name)).toEqual([alternateKeyName1, alternateKeyName2]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table with primary keys', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const tableName: string = 'TableName';
  const primaryKeyName1: string = 'PrimaryKeyName1';
  const primaryKeyName2: string = 'PrimaryKeyName2';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: tableName,
      columns: [
        Object.assign(newColumn(), {
          name: primaryKeyName2,
          isPartOfPrimaryKey: true,
        }),
        Object.assign(newColumn(), {
          name: 'ColumnName',
        }),
        Object.assign(newColumn(), {
          name: primaryKeyName1,
          isPartOfPrimaryKey: true,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have correct primary key order', () => {
    const primaryKeys: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).primaryKeys;
    expect(primaryKeys).toHaveLength(2);
    expect(primaryKeys.map(x => x.name)).toEqual([primaryKeyName1, primaryKeyName2]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table with foreign keys', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const tableName: string = 'TableName';
  const parentTableName1: string = 'ParentTableName1';
  const foreignTableName1: string = 'ForeignTableName1';
  const parentTableName2: string = 'ParentTableName2';
  const foreignTableName2: string = 'ForeignTableName2';
  const foreignTableColumnName1: string = 'ForeignTableColumnName1';
  const foreignTableColumnName2: string = 'ForeignTableColumnName2';
  const parentTableColumnName1: string = 'ParentTableColumnName1';
  const parentTableColumnName2: string = 'ParentTableColumnName2';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: tableName,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          parentTableName: parentTableName1,
          foreignTableName: foreignTableName1,
        }),
        Object.assign(newForeignKey(), {
          parentTableName: parentTableName2,
          foreignTableName: foreignTableName2,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: parentTableColumnName2,
              foreignTableColumnName: foreignTableColumnName2,
            }),
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: parentTableColumnName1,
              foreignTableColumnName: foreignTableColumnName1,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have correct foreign key order', () => {
    const foreignKeys: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).foreignKeys;
    expect(foreignKeys).toHaveLength(2);
    expect(foreignKeys.map(x => x.name)).toEqual([`FK_${parentTableName1}_${foreignTableName1}`, `FK_${parentTableName2}_${foreignTableName2}`]);
  });

  it('should have correct foreign key column order', () => {
    const parentTableColumnNames: Array<string> = R.last(
      (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).foreignKeys,
    ).parentTableColumnNames;
    expect(parentTableColumnNames).toHaveLength(2);
    expect(parentTableColumnNames).toEqual([parentTableColumnName1, parentTableColumnName2]);

    const foreignTableColumnNames: Array<string> = R.last(
      (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).foreignKeys,
    ).foreignTableColumnNames;
    expect(foreignTableColumnNames).toHaveLength(2);
    expect(foreignTableColumnNames).toEqual([foreignTableColumnName1, foreignTableColumnName2]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table with unique indexes', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const tableName: string = 'TableName';
  const uniqueIndexName1: string = 'UniqueIndexName1';
  const uniqueIndexName2: string = 'UniqueIndexName2';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: tableName,
      columns: [
        Object.assign(newColumn(), {
          name: uniqueIndexName2,
          isUniqueIndex: true,
        }),
        Object.assign(newColumn(), {
          name: 'ColumnName',
        }),
        Object.assign(newColumn(), {
          name: uniqueIndexName1,
          isUniqueIndex: true,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have correct unique index order', () => {
    const uniqueIndexes: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).uniqueIndexes;
    expect(uniqueIndexes).toHaveLength(2);
    expect(uniqueIndexes.map(x => x.name)).toEqual([uniqueIndexName1, uniqueIndexName2]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table with primary and non primary keys', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const tableName: string = 'TableName';
  const primaryKeyName1: string = 'PrimaryKeyName1';
  const primaryKeyName2: string = 'PrimaryKeyName2';
  const columnName1: string = 'ColumnName1';
  const columnName2: string = 'ColumnName2';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: tableName,
      columns: [
        Object.assign(newColumn(), {
          name: columnName2,
        }),
        Object.assign(newColumn(), {
          name: primaryKeyName2,
          isPartOfPrimaryKey: true,
        }),
        Object.assign(newColumn(), {
          name: columnName1,
        }),
        Object.assign(newColumn(), {
          name: primaryKeyName1,
          isPartOfPrimaryKey: true,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have correct column order with primary keys first', () => {
    const primaryKeys: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).columns;
    expect(primaryKeys).toHaveLength(4);
    expect(primaryKeys.map(x => x.name)).toEqual([primaryKeyName1, primaryKeyName2, columnName2, columnName1]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table and columns with sql escaped description', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const tableName: string = 'TableName';
  const expectedDescription: string = 'Test \'\'description\'\' with \'\'quotes\'\'';

  beforeAll(() => {
    const description: string = 'Test \'description\' with \'quotes\'';
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: tableName,
      description,
      columns: [
        Object.assign(newColumn(), {
          description,
        }),
        Object.assign(newColumn(), {
          description,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have correct sql escaped descriptions for table', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName);
    expect(table).toBeDefined();
    expect(table.sqlEscapedDescription).toEqual(expectedDescription);
  });

  it('should have correct sql escaped descriptions for columns', () => {
    const columns: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).columns;
    expect(columns).toHaveLength(2);
    expect(columns.map(x => x.sqlEscapedDescription)).toEqual([expectedDescription, expectedDescription]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances triggers with insert, update, and/or delete', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const triggerName: string = 'TriggerName';
  const expectedInsertUpdateDelete: Array<string> = ['INSERT', 'UPDATE', 'DELETE'];

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const trigger: Trigger = Object.assign(newTrigger(), {
      name: triggerName,
      onInsert: true,
      onUpdate: true,
      onDelete: true,
    });
    pluginEnvironment(metaEd).entity.trigger.set(trigger.name, trigger);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have correct insert update delete', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(triggerName);
    expect(trigger).toBeDefined();
    expect(trigger.insertUpdateDelete).toEqual(expectedInsertUpdateDelete);
  });
});
