import { DomainEntity, Descriptor, DescriptorProperty, IntegerProperty, SemVer } from '@edfi/metaed-core';
import { newDomainEntity, newDescriptor, newDescriptorProperty, newIntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { newTable } from '../../../src/model/database/Table';
import { tableBuilderFactory } from '../../../src/enhancer/table/TableBuilderFactory';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';
import { Table } from '../../../src/model/database/Table';
import { TableBuilder } from '../../../src/enhancer/table/TableBuilder';

const targetTechnologyVersion: SemVer = '6.1.0';

describe('when building descriptor property table', (): void => {
  const descriptorName = 'DescriptorName';
  const descriptorPropertyName = 'DescriptorPropertyName';
  const tableName = 'TableName';
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: 'TableSchema', tableId: tableName };

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'EntityPkName',
      parentEntity: entity,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
          odsIsCollection: false,
        },
      },
    });
    const entityDescriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: descriptorPropertyName,
          odsIsCollection: false,
        },
      },
    });

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      data: {
        edfiOdsRelational: {
          odsDescriptorName: descriptorName,
          odsProperties: [],
        },
      },
    });
    const descriptorEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'DescriptorEntityPropertyName1',
      isPartOfIdentity: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    descriptor.data.edfiOdsRelational.odsProperties.push(descriptorEntityProperty1);
    entityDescriptorProperty.referencedEntity = descriptor;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty, '6.1.0');
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDescriptorProperty);
    tableBuilder.buildTables(
      entityDescriptorProperty,
      TableStrategy.default(table),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      null,
    );
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should create one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(`${descriptorPropertyName}Id`);
  });

  it('should create one foreign key', (): void => {
    expect(table.foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(table.foreignKeys[0].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[0].parentTable.tableId).toBe(tableName);
    expect(table.foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(`${descriptorPropertyName}Id`);

    expect(table.foreignKeys[0].foreignTableId).toBe(descriptorName);
    expect(table.foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(`${descriptorPropertyName}Id`);
  });
});

describe('when building collection descriptor property table', (): void => {
  const descriptorName = 'DescriptorName';
  const descriptorEntityPropertyName1 = 'DescriptorEntityPropertyName1';
  const entityPkName = 'EntityPkName';
  const tableSchema = 'tableschema';
  const tableName = 'TableName';
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: tableSchema, tableId: tableName };

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkName,
      parentEntity: entity,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
          odsIsCollection: false,
        },
      },
    });
    const entityDescriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorName,
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: descriptorName,
          odsIsCollection: true,
        },
      },
    });

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      data: {
        edfiOdsRelational: {
          odsDescriptorName: descriptorName,
          odsProperties: [],
        },
      },
    });
    const descriptorEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: descriptorEntityPropertyName1,
      isPartOfIdentity: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    descriptor.data.edfiOdsRelational.odsProperties.push(descriptorEntityProperty1);
    entityDescriptorProperty.referencedEntity = descriptor;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty, '6.1.0');
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDescriptorProperty);
    tableBuilder.buildTables(
      entityDescriptorProperty,
      TableStrategy.default(table),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      null,
    );
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + descriptorName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should create two primary key columns', (): void => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(`${descriptorName}Id`);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should create one foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(2);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(tableName + descriptorName);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[1].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[1].parentTable.tableId).toBe(tableName + descriptorName);
    expect(tables[0].foreignKeys[1].columnPairs[0].parentTableColumnId).toBe(`${descriptorName}Id`);

    expect(tables[0].foreignKeys[1].foreignTableId).toBe(descriptorName);
    expect(tables[0].foreignKeys[1].columnPairs[0].foreignTableColumnId).toBe(`${descriptorName}Id`);
  });
});
