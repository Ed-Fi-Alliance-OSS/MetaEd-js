import { DomainEntity, DomainEntityProperty, IntegerProperty } from '@edfi/metaed-core';
import { newDomainEntity, newDomainEntityProperty, newIntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { newTable } from '../../../src/model/database/Table';
import { tableBuilderFactory } from '../../../src/enhancer/table/TableBuilderFactory';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';
import { Table } from '../../../src/model/database/Table';
import { TableBuilder } from '../../../src/enhancer/table/TableBuilder';

describe('when building domain entity property table that is not an identity, required, optional, or a collection', (): void => {
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: 'TableSchema', tableId: 'TableName' };

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
    const entityDomainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsIsCollection: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [],
        },
      },
    });
    const domainEntityEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'DomainEntityPropertyName1',
    });
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityEntityProperty1);
    entityDomainEntityProperty.referencedEntity = domainEntity;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDomainEntityProperty);
    tableBuilder.buildTables(
      entityDomainEntityProperty,
      TableStrategy.default(table),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      null,
    );
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should create no columns', (): void => {
    expect(table.columns).toHaveLength(0);
  });
});

describe('when building identity domain entity property table', (): void => {
  const domainEntityPkName = 'DomainEntityPkName';
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: 'TableSchema', tableId: 'TableName' };

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
    const entityDomainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      parentEntity: entity,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          ods_name: 'EntityDomainEntityProperty',
          odsContextPrefix: '',
          odsIsCollection: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          ods_DomainEntityName: 'DomainEntityName',
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPk: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkName,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsIdentityProperties.push(domainEntityPk);
    entityDomainEntityProperty.referencedEntity = domainEntity;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDomainEntityProperty);
    tableBuilder.buildTables(
      entityDomainEntityProperty,
      TableStrategy.default(table),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      null,
    );
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should create one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(domainEntityPkName);
  });

  it('should create no foreign keys', (): void => {
    expect(table.foreignKeys).toHaveLength(0);
  });
});

describe('when building required domain entity property table', (): void => {
  const domainEntityPkName = 'DomainEntityPkName';
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: 'TableSchema', tableId: 'TableName' };

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
    const entityDomainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      parentEntity: entity,
      isRequired: true,
      data: {
        edfiOdsRelational: {
          ods_name: 'EntityDomainEntityProperty',
          odsContextPrefix: '',
          odsIsCollection: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          ods_DomainEntityName: 'DomainEntityName',
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPk: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkName,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsIdentityProperties.push(domainEntityPk);
    entityDomainEntityProperty.referencedEntity = domainEntity;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDomainEntityProperty);
    tableBuilder.buildTables(
      entityDomainEntityProperty,
      TableStrategy.default(table),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      null,
    );
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should create one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(domainEntityPkName);
  });

  it('should create no foreign keys', (): void => {
    expect(table.foreignKeys).toHaveLength(0);
  });
});

describe('when building optional domain entity property table', (): void => {
  const domainEntityPkName = 'DomainEntityPkName';
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: 'TableSchema', tableId: 'TableName' };

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
    const entityDomainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      parentEntity: entity,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          ods_name: 'EntityDomainEntityProperty',
          odsContextPrefix: '',
          odsIsCollection: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          ods_DomainEntityName: 'DomainEntityName',
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPk: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkName,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsIdentityProperties.push(domainEntityPk);
    entityDomainEntityProperty.referencedEntity = domainEntity;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDomainEntityProperty);
    tableBuilder.buildTables(
      entityDomainEntityProperty,
      TableStrategy.default(table),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      null,
    );
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should create one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(domainEntityPkName);
  });

  it('should create no foreign keys', (): void => {
    expect(table.foreignKeys).toHaveLength(0);
  });
});

describe('when building collection domain entity property table', (): void => {
  const domainEntityName = 'DomainEntityName';
  const domainEntityPkName = 'domainEntityPkName';
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
    const entityDomainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName,
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsCollection: true,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          ods_DomainEntityName: domainEntityName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkName,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityEntityProperty1);
    domainEntity.data.edfiOdsRelational.odsIdentityProperties.push(domainEntityEntityProperty1);
    entityDomainEntityProperty.referencedEntity = domainEntity;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityDomainEntityProperty);
    tableBuilder.buildTables(
      entityDomainEntityProperty,
      TableStrategy.default(table),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      null,
    );
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + domainEntityName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should create two primary key columns', (): void => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(domainEntityPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should create one foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(tableName + domainEntityName);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(entityPkName);
  });
});
