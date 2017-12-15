// @flow
import {
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newDomainEntity,
  newDomainEntityExtension,
  newIntegerProperty,
  newNamespaceInfo,
} from 'metaed-core';
import type {
  Common,
  CommonExtension,
  CommonProperty,
  DomainEntity,
  DomainEntityExtension,
  IntegerProperty,
} from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { newTable } from '../../../src/model/database/Table';
import { tableBuilderFactory } from '../../../src/enhancer/table/TableBuilderFactory';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';
import type { Table } from '../../../src/model/database/Table';
import type { TableBuilder } from '../../../src/enhancer/table/TableBuilder';

describe('when building common property table', () => {
  const tableName: string = 'TableName';
  const tableSchema: string = 'TableSchema';
  const entityPkName: string = 'EntityPkName';
  const commonPropertyName: string = 'CommonPropertyName';
  const commonPkName: string = 'CommonPkName';
  const tables: Array<Table> = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);

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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      parentEntity: entity,
      referencedEntity: common,
      data: {
        edfiOds: {
          ods_Name: commonPropertyName,
        },
      },
    });
    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const mainTable: Table = Object.assign(newTable(), { schema: tableSchema, name: tableName });
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(commonProperty);
    tableBuilder.buildTables(commonProperty, TableStrategy.default(mainTable), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return join table', () => {
    expect(tables).toHaveLength(1);
    expect(tables[0].name).toBe(tableName + commonPropertyName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should have two primary key columns', () => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].name).toBe(commonPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].name).toBe(entityPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should have one foreign key', () => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', () => {
    expect(tables[0].foreignKeys[0].columnNames).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTableName).toBe(tableName + commonPropertyName);
    expect(tables[0].foreignKeys[0].columnNames[0].parentTableColumnName).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableName).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnNames[0].foreignTableColumnName).toBe(entityPkName);
  });
});

describe('when building optional common property table', () => {
  const tableName: string = 'TableName';
  const tableSchema: string = 'TableSchema';
  const entityPkName: string = 'EntityPkName';
  const commonName: string = 'CommonName';
  const commonPkName: string = 'CommonPkName';
  const tables: Array<Table> = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);

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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      parentEntity: entity,
      referencedEntity: common,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: commonName,
        },
      },
    });
    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const mainTable: Table = Object.assign(newTable(), { schema: tableSchema, name: tableName });
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(commonProperty);
    tableBuilder.buildTables(commonProperty, TableStrategy.default(mainTable), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return join table table', () => {
    expect(tables).toHaveLength(1);
    expect(tables[0].name).toBe(tableName + commonName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should have two columns with one primary key', () => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].name).toBe(commonPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(false);
    expect(tables[0].columns[1].name).toBe(entityPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should have one foreign key', () => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', () => {
    expect(tables[0].foreignKeys[0].columnNames).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTableName).toBe(tableName + commonName);
    expect(tables[0].foreignKeys[0].columnNames[0].parentTableColumnName).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableName).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnNames[0].foreignTableColumnName).toBe(entityPkName);
  });
});

describe('when building required collection common property table', () => {
  const tableName: string = 'TableName';
  const tableSchema: string = 'TableSchema';
  const entityPkName: string = 'EntityPkName';
  const commonPropertyName: string = 'CommonPropertyName';
  const commonPkName: string = 'CommonPkName';
  const tables: Array<Table> = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);

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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      parentEntity: entity,
      referencedEntity: common,
      isRequiredCollection: true,
      data: {
        edfiOds: {
          ods_Name: commonPropertyName,
        },
      },
    });
    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const mainTable: Table = Object.assign(newTable(), { schema: tableSchema, name: tableName });
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(commonProperty);
    tableBuilder.buildTables(commonProperty, TableStrategy.default(mainTable), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return required collection table', () => {
    expect(tables).toHaveLength(1);
    expect(tables[0].name).toBe(tableName + commonPropertyName);
    expect(tables[0].schema).toBe(tableSchema);
    expect(tables[0].isRequiredCollectionTable).toBe(true);
  });
});

describe('when building common property extension table', () => {
  const tableName: string = 'TableName';
  const tableSchema: string = 'TableSchema';
  const entityPkName: string = 'EntityPkName';
  const commonName: string = 'CommonName';
  const commonPkName: string = 'CommonPkName';
  const commonExtensionPropertyName: string = 'CommonExtensionPropertyName';
  const extensionNamespace: string = 'extension';
  const tables: Array<Table> = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);

    const commonExtension: CommonExtension = Object.assign(newCommonExtension(), {
      baseEntityName: common.metaEdName,
      baseEntity: common,
      namespaceInfo: Object.assign(newNamespaceInfo(), { namespace: extensionNamespace }),
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonExtensionProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonExtensionPropertyName,
      parentEntity: common,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });
    commonExtension.data.edfiOds.ods_Properties.push(commonExtensionProperty);
    common.extender = commonExtension;

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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      parentEntity: entity,
      referencedEntity: common,
      data: {
        edfiOds: {
          ods_Name: commonName,
        },
      },
    });
    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const mainTable: Table = Object.assign(newTable(), { schema: tableSchema, name: tableName });
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(commonProperty);
    tableBuilder.buildTables(commonProperty, TableStrategy.default(mainTable), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return two join tables', () => {
    expect(tables).toHaveLength(2);
    expect(tables[0].name).toBe(tableName + commonName);
    expect(tables[0].schema).toBe(tableSchema);
    expect(tables[1].name).toBe(`${tableName}${commonName}Extension`);
    expect(tables[1].schema).toBe(extensionNamespace);
  });

  it('should have three columns with two primary keys', () => {
    expect(tables[1].columns).toHaveLength(3);
    expect(tables[1].columns[0].name).toBe(commonPkName);
    expect(tables[1].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[1].columns[1].name).toBe(entityPkName);
    expect(tables[1].columns[1].isPartOfPrimaryKey).toBe(true);
    expect(tables[1].columns[2].name).toBe(commonExtensionPropertyName);
    expect(tables[1].columns[2].isPartOfPrimaryKey).toBe(false);
  });

  it('should have one foreign key', () => {
    expect(tables[1].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', () => {
    expect(tables[1].foreignKeys[0].columnNames).toHaveLength(2);
    expect(tables[1].foreignKeys[0].parentTableName).toBe(`${tableName + commonName}Extension`);
    expect(tables[1].foreignKeys[0].columnNames[0].parentTableColumnName).toBe(commonPkName);
    expect(tables[1].foreignKeys[0].columnNames[1].parentTableColumnName).toBe(entityPkName);

    expect(tables[1].foreignKeys[0].foreignTableName).toBe(tableName + commonName);
    expect(tables[1].foreignKeys[0].columnNames[0].foreignTableColumnName).toBe(commonPkName);
    expect(tables[1].foreignKeys[0].columnNames[1].foreignTableColumnName).toBe(entityPkName);
  });
});

describe('when building common property extension table with domain entity extension with common extension override property', () => {
  const tableName: string = 'TableName';
  const tableSchema: string = 'TableSchema';
  const commonName: string = 'CommonName';
  const commonPkName: string = 'CommonPkName';
  const commonExtensionPropertyName: string = 'CommonExtensionPropertyName';
  const entityPkName: string = 'EntityPkName';
  const entityExtensionPkName: string = 'EntityExtensionPkName';
  const extensionNamespace: string = 'extension';
  const tables: Array<Table> = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);

    const commonExtension: CommonExtension = Object.assign(newCommonExtension(), {
      baseEntityName: common.metaEdName,
      baseEntity: common,
      namespaceInfo: Object.assign(newNamespaceInfo(), { namespace: extensionNamespace }),
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonExtensionProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonExtensionPropertyName,
      parentEntity: common,
      data: {
        edfiOds: {
          ods_Name: '',
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });
    commonExtension.data.edfiOds.ods_Properties.push(commonExtensionProperty);
    common.extender = commonExtension;

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
    // eslint-disable-next-line no-unused-vars
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      parentEntity: entity,
      referencedEntity: common,
      data: {
        edfiOds: {
          ods_Name: commonName,
        },
      },
    });

    const entityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      data: {
        edfiOds: {
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    // eslint-disable-next-line no-unused-vars
    const entityExtensionPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityExtensionPkName,
      parentEntity: entityExtension,
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
    const commonExtensionOverrideProperty: CommonProperty = Object.assign(newCommonProperty(), {
      parentEntity: entityExtension,
      referencedEntity: common,
      isExtensionOverride: true,
      data: {
        edfiOds: {
          ods_Name: common.metaEdName,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const mainTable: Table = Object.assign(newTable(), { schema: tableSchema, name: tableName });
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(commonExtensionOverrideProperty);
    tableBuilder.buildTables(
      commonExtensionOverrideProperty,
      TableStrategy.default(mainTable),
      primaryKeys,
      BuildStrategyDefault,
      tables,
    );
  });

  it('should return join table', () => {
    expect(tables).toHaveLength(1);
    expect(tables[0].name).toBe(`${tableName}${commonName}Extension`);
    expect(tables[0].schema).toBe(extensionNamespace);
  });

  it('should have three columns with two primary keys', () => {
    expect(tables[0].columns).toHaveLength(3);
    expect(tables[0].columns[0].name).toBe(commonPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].name).toBe(entityPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[2].name).toBe(commonExtensionPropertyName);
    expect(tables[0].columns[2].isPartOfPrimaryKey).toBe(false);
  });

  it('should have one foreign key', () => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', () => {
    expect(tables[0].foreignKeys[0].columnNames).toHaveLength(2);
    expect(tables[0].foreignKeys[0].parentTableName).toBe(`${tableName + commonName}Extension`);
    expect(tables[0].foreignKeys[0].columnNames[0].parentTableColumnName).toBe(commonPkName);
    expect(tables[0].foreignKeys[0].columnNames[1].parentTableColumnName).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableName).toBe(tableName + commonName);
    expect(tables[0].foreignKeys[0].columnNames[0].foreignTableColumnName).toBe(commonPkName);
    expect(tables[0].foreignKeys[0].columnNames[1].foreignTableColumnName).toBe(entityPkName);
  });
});
