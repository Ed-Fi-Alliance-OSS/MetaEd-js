import R from 'ramda';
import { MetaEdEnvironment, Namespace, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import {
  initializeEdFiOdsRelationalEntityRepository,
  newColumn,
  newColumnNameComponent,
  newColumnPair,
  newForeignKey,
  newTable,
  newTableNameGroup,
  newTableNameComponent,
  tableEntities,
  Table,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../src/enhancer/TemplateSpecificTablePropertyEnhancerV2';
import { enhance as tableSetupEnhancer } from '../../src/model/Table';
import { enhance as sqlServerTableNamingEnhancer } from '../../src/enhancer/SqlServerTableNamingEnhancer';
import { enhance as sqlServerColumnNamingEnhancer } from '../../src/enhancer/SqlServerColumnNamingEnhancer';
import { enhance as sqlServerForeignKeyNamingEnhancer } from '../../src/enhancer/SqlServerForeignKeyNamingEnhancer';

describe('when TemplateSpecificTablePropertyEnhancer enhances table with alternate keys', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';
  const alternateKeyName1 = 'AlternateKeyName1';
  const alternateKeyName2 = 'AlternateKeyName2';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      columns: [
        {
          ...newColumn(),
          columnId: alternateKeyName2,
          nameComponents: [{ ...newColumnNameComponent(), name: alternateKeyName2 }],
          isPartOfAlternateKey: true,
        },
        { ...newColumn(), columnId: 'ColumnName', nameComponents: [{ ...newColumnNameComponent(), name: 'ColumnName' }] },
        {
          ...newColumn(),
          columnId: alternateKeyName1,
          nameComponents: [{ ...newColumnNameComponent(), name: alternateKeyName1 }],
          isPartOfAlternateKey: true,
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    tableSetupEnhancer(metaEd);
    sqlServerColumnNamingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have hasAlternateKeys property set to true', (): void => {
    expect((tableEntities(metaEd, namespace).get(tableName) as Table).hasAlternateKeys).toBe(true);
  });

  it('should have correct alternate key order', (): void => {
    const { alternateKeys } = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect(alternateKeys).toHaveLength(2);
    expect(alternateKeys.map((x) => x.columnId)).toEqual([alternateKeyName1, alternateKeyName2]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table with primary keys', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';
  const primaryKeyName1 = 'PrimaryKeyName1';
  const primaryKeyName2 = 'PrimaryKeyName2';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      columns: [
        {
          ...newColumn(),
          columnId: primaryKeyName2,
          nameComponents: [{ ...newColumnNameComponent(), name: primaryKeyName2 }],
          isPartOfPrimaryKey: true,
        },
        { ...newColumn(), columnId: 'ColumnName', nameComponents: [{ ...newColumnNameComponent(), name: 'ColumnName' }] },
        {
          ...newColumn(),
          columnId: primaryKeyName1,
          nameComponents: [{ ...newColumnNameComponent(), name: primaryKeyName1 }],
          isPartOfPrimaryKey: true,
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    tableSetupEnhancer(metaEd);
    sqlServerColumnNamingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have correct primary key order', (): void => {
    const { primaryKeys } = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect(primaryKeys).toHaveLength(2);
    expect(primaryKeys.map((x) => x.columnId)).toEqual([primaryKeyName1, primaryKeyName2]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table with foreign keys', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentTableName = 'ParentTableName';
  const foreignTableName1 = 'ForeignTableName1';
  const foreignTableName2 = 'ForeignTableName2';
  const foreignTableColumnName1 = 'ForeignTableColumnName1';
  const foreignTableColumnName2 = 'ForeignTableColumnName2';
  const parentTableColumnName1 = 'ParentTableColumnName1';
  const parentTableColumnName2 = 'ParentTableColumnName2';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: parentTableName,
      nameGroup: { ...newTableNameGroup(), nameElements: [{ ...newTableNameComponent(), name: parentTableName }] },
      schema: namespace.namespaceName,
      columns: [
        {
          ...newColumn(),
          columnId: parentTableColumnName1,
          nameComponents: [{ ...newColumnNameComponent(), name: parentTableColumnName1 }],
        },
        {
          ...newColumn(),
          columnId: parentTableColumnName2,
          nameComponents: [{ ...newColumnNameComponent(), name: parentTableColumnName2 }],
        },
      ],
    };
    const foreignTable1: Table = {
      ...newTable(),
      tableId: foreignTableName1,
      nameGroup: { ...newTableNameGroup(), nameElements: [{ ...newTableNameComponent(), name: foreignTableName1 }] },
      schema: namespace.namespaceName,
      columns: [
        {
          ...newColumn(),
          columnId: foreignTableColumnName1,
          nameComponents: [{ ...newColumnNameComponent(), name: foreignTableColumnName1 }],
        },
      ],
    };
    const foreignTable2: Table = {
      ...newTable(),
      tableId: foreignTableName2,
      nameGroup: { ...newTableNameGroup(), nameElements: [{ ...newTableNameComponent(), name: foreignTableName2 }] },
      schema: namespace.namespaceName,
      columns: [
        {
          ...newColumn(),
          columnId: foreignTableColumnName2,
          nameComponents: [{ ...newColumnNameComponent(), name: foreignTableColumnName2 }],
        },
      ],
    };
    table.foreignKeys = [
      {
        ...newForeignKey(),
        parentTable: table,
        foreignTable: foreignTable1,
        foreignTableId: foreignTableName1,
        foreignTableSchema: namespace.namespaceName,
        columnPairs: [
          { ...newColumnPair(), parentTableColumnId: parentTableColumnName1, foreignTableColumnId: foreignTableColumnName1 },
        ],
      },
      {
        ...newForeignKey(),
        parentTable: table,
        foreignTableId: foreignTableName2,
        foreignTable: foreignTable2,
        foreignTableSchema: namespace.namespaceName,
        columnPairs: [
          { ...newColumnPair(), parentTableColumnId: parentTableColumnName2, foreignTableColumnId: foreignTableColumnName2 },
        ],
      },
    ];
    tableEntities(metaEd, namespace).set(table.tableId, table);
    tableEntities(metaEd, namespace).set(foreignTable1.tableId, foreignTable1);
    tableEntities(metaEd, namespace).set(foreignTable2.tableId, foreignTable2);

    metaEd.dataStandardVersion = '2.0.0';
    tableSetupEnhancer(metaEd);
    sqlServerTableNamingEnhancer(metaEd);
    sqlServerColumnNamingEnhancer(metaEd);
    sqlServerForeignKeyNamingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have correct foreign key order', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(parentTableName) as Table;
    expect(foreignKeys).toHaveLength(2);
    expect(foreignKeys[0].parentTable.tableId).toBe(parentTableName);
    expect(foreignKeys[0].foreignTableId).toBe(foreignTableName1);
    expect(foreignKeys[1].parentTable.tableId).toBe(parentTableName);
    expect(foreignKeys[1].foreignTableId).toBe(foreignTableName2);
  });

  it('should have correct foreign key column order', (): void => {
    const { parentTableColumnNames } = R.last((tableEntities(metaEd, namespace).get(parentTableName) as Table).foreignKeys)
      .data.edfiOdsSqlServer;
    expect(parentTableColumnNames).toHaveLength(1);
    expect(parentTableColumnNames).toEqual([parentTableColumnName2]);

    const { foreignTableColumnNames } = R.last((tableEntities(metaEd, namespace).get(parentTableName) as Table).foreignKeys)
      .data.edfiOdsSqlServer;
    expect(foreignTableColumnNames).toHaveLength(1);
    expect(foreignTableColumnNames).toEqual([foreignTableColumnName2]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table with unique indexes', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';
  const uniqueIndexName1 = 'UniqueIndexName1';
  const uniqueIndexName2 = 'UniqueIndexName2';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      columns: [
        {
          ...newColumn(),
          columnId: uniqueIndexName2,
          nameComponents: [{ ...newColumnNameComponent(), name: uniqueIndexName2 }],
          isUniqueIndex: true,
        },
        { ...newColumn(), columnId: 'ColumnName', nameComponents: [{ ...newColumnNameComponent(), name: 'ColumnName' }] },
        {
          ...newColumn(),
          columnId: uniqueIndexName1,
          nameComponents: [{ ...newColumnNameComponent(), name: uniqueIndexName1 }],
          isUniqueIndex: true,
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    tableSetupEnhancer(metaEd);
    sqlServerColumnNamingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have correct unique index order', (): void => {
    const { uniqueIndexes } = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect(uniqueIndexes).toHaveLength(2);
    expect(uniqueIndexes.map((x) => x.columnId)).toEqual([uniqueIndexName1, uniqueIndexName2]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table with primary and non primary keys', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';
  const primaryKeyName1 = 'PrimaryKeyName1';
  const primaryKeyName2 = 'PrimaryKeyName2';
  const primaryKeyName3 = 'PrimaryKeyName3';
  const columnName1 = 'ColumnName1';
  const columnName2 = 'ColumnName2';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      columns: [
        {
          ...newColumn(),
          columnId: primaryKeyName3,
          nameComponents: [{ ...newColumnNameComponent(), name: primaryKeyName3 }],
          isPartOfPrimaryKey: true,
        },
        { ...newColumn(), columnId: columnName2, nameComponents: [{ ...newColumnNameComponent(), name: columnName2 }] },
        {
          ...newColumn(),
          columnId: primaryKeyName2,
          nameComponents: [{ ...newColumnNameComponent(), name: primaryKeyName2 }],
          isPartOfPrimaryKey: true,
        },
        { ...newColumn(), columnId: columnName1, nameComponents: [{ ...newColumnNameComponent(), name: columnName1 }] },
        {
          ...newColumn(),
          columnId: primaryKeyName1,
          nameComponents: [{ ...newColumnNameComponent(), name: primaryKeyName1 }],
          isPartOfPrimaryKey: true,
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    tableSetupEnhancer(metaEd);
    sqlServerColumnNamingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have correct column order with primary keys first', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect(columns).toHaveLength(5);
    expect(columns.map((x) => x.columnId)).toEqual([
      primaryKeyName1,
      primaryKeyName2,
      primaryKeyName3,
      columnName2,
      columnName1,
    ]);
  });
});

describe('when TemplateSpecificTablePropertyEnhancer enhances table and columns with sql escaped description', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';
  const expectedDescription = "Test ''description'' with ''quotes''";

  beforeAll(() => {
    const description = "Test 'description' with 'quotes'";
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      description,
      columns: [
        { ...newColumn(), description },
        { ...newColumn(), description },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    tableSetupEnhancer(metaEd);
    sqlServerColumnNamingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have correct sql escaped descriptions for table', (): void => {
    const table: Table = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect(table).toBeDefined();
    expect(table.sqlEscapedDescription).toEqual(expectedDescription);
  });

  it('should have correct sql escaped descriptions for columns', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect(columns).toHaveLength(2);
    expect(columns.map((x) => x.sqlEscapedDescription)).toEqual([expectedDescription, expectedDescription]);
  });
});
