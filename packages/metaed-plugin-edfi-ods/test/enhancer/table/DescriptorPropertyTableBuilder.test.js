// @flow
import type { DomainEntity, Descriptor, DescriptorProperty, IntegerProperty } from 'metaed-core';
import { newDomainEntity, newDescriptor, newDescriptorProperty, newIntegerProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { newTable } from '../../../src/model/database/Table';
import { tableBuilderFactory } from '../../../src/enhancer/table/TableBuilderFactory';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';
import type { Table } from '../../../src/model/database/Table';
import type { TableBuilder } from '../../../src/enhancer/table/TableBuilder';

describe('when building descriptor property table', () => {
  const descriptorName: string = 'DescriptorName';
  const descriptorPropertyName: string = 'DescriptorPropertyName';
  const tableName: string = 'TableName';
  const tables: Array<Table> = [];
  let table: Table;

  beforeAll(() => {
    table = Object.assign(newTable(), {
      schema: 'TableSchema',
      name: tableName,
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOds: {
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'EntityPkName',
      parentEntity: entity,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
          ods_IsCollection: false,
        },
      },
    });
    const entityDescriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_DescriptorifiedBaseName: descriptorPropertyName,
          ods_IsCollection: false,
        },
      },
    });

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      data: {
        edfiOds: {
          ods_DescriptorName: descriptorName,
          ods_Properties: [],
        },
      },
    });
    const descriptorEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'DescriptorEntityPropertyName1',
      isPartOfIdentity: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsUniqueIndex: false,
        },
      },
    });
    descriptor.data.edfiOds.ods_Properties.push(descriptorEntityProperty1);
    entityDescriptorProperty.referencedEntity = descriptor;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDescriptorProperty);
    tableBuilder.buildTables(entityDescriptorProperty, TableStrategy.default(table), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return no join table', () => {
    expect(tables).toHaveLength(0);
  });

  it('should create one column', () => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(`${descriptorPropertyName}Id`);
  });

  it('should create one foreign key', () => {
    expect(table.foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', () => {
    expect(table.foreignKeys[0].columnNames).toHaveLength(1);
    expect(table.foreignKeys[0].parentTableName).toBe(tableName);
    expect(table.foreignKeys[0].columnNames[0].parentTableColumnName).toBe(`${descriptorPropertyName}Id`);

    expect(table.foreignKeys[0].foreignTableName).toBe(descriptorName);
    expect(table.foreignKeys[0].columnNames[0].foreignTableColumnName).toBe(`${descriptorPropertyName}Id`);
  });
});

describe('when building collection descriptor property table', () => {
  const descriptorName: string = 'DescriptorName';
  const descriptorEntityPropertyName1: string = 'DescriptorEntityPropertyName1';
  const entityPkName: string = 'EntityPkName';
  const tableSchema: string = 'TableSchema';
  const tableName: string = 'TableName';
  const tables: Array<Table> = [];
  let table: Table;

  beforeAll(() => {
    table = Object.assign(newTable(), {
      schema: tableSchema,
      name: tableName,
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOds: {
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkName,
      parentEntity: entity,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
          ods_IsCollection: false,
        },
      },
    });
    const entityDescriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorName,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_DescriptorifiedBaseName: descriptorName,
          ods_IsCollection: true,
        },
      },
    });

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      data: {
        edfiOds: {
          ods_DescriptorName: descriptorName,
          ods_Properties: [],
        },
      },
    });
    const descriptorEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: descriptorEntityPropertyName1,
      isPartOfIdentity: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsUniqueIndex: false,
        },
      },
    });
    descriptor.data.edfiOds.ods_Properties.push(descriptorEntityProperty1);
    entityDescriptorProperty.referencedEntity = descriptor;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDescriptorProperty);
    tableBuilder.buildTables(entityDescriptorProperty, TableStrategy.default(table), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return join table', () => {
    expect(tables).toHaveLength(1);
    expect(tables[0].name).toBe(tableName + descriptorName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should create two primary key columns', () => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].name).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].name).toBe(`${descriptorName}Id`);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should create one foreign key', () => {
    expect(tables[0].foreignKeys).toHaveLength(2);
  });

  it('should have correct foreign key relationship', () => {
    expect(tables[0].foreignKeys[0].columnNames).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTableName).toBe(tableName + descriptorName);
    expect(tables[0].foreignKeys[0].columnNames[0].parentTableColumnName).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableName).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnNames[0].foreignTableColumnName).toBe(entityPkName);

    expect(tables[0].foreignKeys[1].columnNames).toHaveLength(1);
    expect(tables[0].foreignKeys[1].parentTableName).toBe(tableName + descriptorName);
    expect(tables[0].foreignKeys[1].columnNames[0].parentTableColumnName).toBe(`${descriptorName}Id`);

    expect(tables[0].foreignKeys[1].foreignTableName).toBe(descriptorName);
    expect(tables[0].foreignKeys[1].columnNames[0].foreignTableColumnName).toBe(`${descriptorName}Id`);
  });
});
