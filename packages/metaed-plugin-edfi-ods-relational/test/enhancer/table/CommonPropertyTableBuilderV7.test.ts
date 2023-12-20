import {
  MetaEdPropertyPath,
  SemVer,
  newCommon,
  newCommonProperty,
  newDomainEntity,
  newIntegerProperty,
} from '@edfi/metaed-core';
import { Common, CommonProperty, DomainEntity, IntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { newTable } from '../../../src/model/database/Table';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { Table } from '../../../src/model/database/Table';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';
import { buildTableFor } from '../../../src/enhancer/table/TableBuilder';

const targetTechnologyVersion: SemVer = '7.1.0';

describe('when building common property table', (): void => {
  const tableName = 'TableName';
  const tableSchema = 'tableschema';
  const entityPkName = 'EntityPkName';
  const commonName = 'CommonName';
  const commonPropertyName = 'CommonPropertyName';
  const commonPkName = 'CommonPkName';
  const tables: Table[] = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      fullPropertyName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkName,
      fullPropertyName: entityPkName,
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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      fullPropertyName: commonName,
      parentEntity: entity,
      referencedEntity: common,
      data: {
        edfiOdsRelational: {
          odsName: commonPropertyName,
        },
      },
    });
    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    const mainTable: Table = { ...newTable(), schema: tableSchema, tableId: tableName };

    buildTableFor({
      originalEntity: entity,
      property: commonProperty,
      parentTableStrategy: TableStrategy.default(mainTable),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: commonProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + commonPropertyName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should have two primary key columns', (): void => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(commonPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should have correct property paths', (): void => {
    expect(tables[0].columns[0].propertyPath).toMatchInlineSnapshot(`"EntityPkName"`);
    expect(tables[0].columns[1].propertyPath).toMatchInlineSnapshot(`"CommonName.CommonPkName"`);
  });

  it('should have correct original entities', (): void => {
    expect(tables[0].columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(tables[0].columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });

  it('should have one foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(tableName + commonPropertyName);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(entityPkName);
  });
});

describe('when building optional common property table', (): void => {
  const tableName = 'TableName';
  const tableSchema = 'tableschema';
  const entityPkName = 'EntityPkName';
  const commonName = 'CommonName';
  const commonPkName = 'CommonPkName';
  const tables: Table[] = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      fullPropertyName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkName,
      fullPropertyName: entityPkName,
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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      fullPropertyName: commonName,
      parentEntity: entity,
      referencedEntity: common,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: commonName,
        },
      },
    });
    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    const mainTable: Table = { ...newTable(), schema: tableSchema, tableId: tableName };

    buildTableFor({
      originalEntity: entity,
      property: commonProperty,
      parentTableStrategy: TableStrategy.default(mainTable),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: commonProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + commonName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should have two columns with one primary key', (): void => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(commonPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(false);
  });

  it('should have correct property paths', (): void => {
    expect(tables[0].columns[0].propertyPath).toMatchInlineSnapshot(`"EntityPkName"`);
    expect(tables[0].columns[1].propertyPath).toMatchInlineSnapshot(`"CommonName.CommonPkName"`);
  });

  it('should have correct original entities', (): void => {
    expect(tables[0].columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(tables[0].columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });

  it('should have one foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(tableName + commonName);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(entityPkName);
  });
});

describe('when building required collection common property table', (): void => {
  const tableName = 'TableName';
  const tableSchema = 'tableschema';
  const entityPkName = 'EntityPkName';
  const commonName = 'CommonName';
  const commonPropertyName = 'CommonPropertyName';
  const commonPkName = 'CommonPkName';
  const tables: Table[] = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      fullPropertyName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkName,
      fullPropertyName: entityPkName,
      parentEntity: entity,
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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      fullPropertyName: commonName,
      parentEntity: entity,
      referencedEntity: common,
      isRequiredCollection: true,
      data: {
        edfiOdsRelational: {
          odsName: commonPropertyName,
          odsIsCollection: true,
        },
      },
    });
    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    const mainTable: Table = { ...newTable(), schema: tableSchema, tableId: tableName };

    buildTableFor({
      originalEntity: entity,
      property: commonProperty,
      parentTableStrategy: TableStrategy.default(mainTable),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: commonProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return required collection table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + commonPropertyName);
    expect(tables[0].schema).toBe(tableSchema);
    expect(tables[0].isRequiredCollectionTable).toBe(true);
  });

  it('should have two primary keys', (): void => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(commonPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should have correct property paths', (): void => {
    expect(tables[0].columns[0].propertyPath).toMatchInlineSnapshot(`"EntityPkName"`);
    expect(tables[0].columns[1].propertyPath).toMatchInlineSnapshot(`"CommonName.CommonPkName"`);
  });

  it('should have correct original entities', (): void => {
    expect(tables[0].columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(tables[0].columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when building required collection common property table with make leaf column nullable strategy', (): void => {
  const tableName = 'TableName';
  const tableSchema = 'tableschema';
  const entityPkName = 'EntityPkName';
  const commonName = 'CommonName';
  const commonPropertyName = 'CommonPropertyName';
  const commonPkName = 'CommonPkName';
  const tables: Table[] = [];

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      fullPropertyName: commonPkName,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkName,
      fullPropertyName: entityPkName,
      parentEntity: entity,
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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      fullPropertyName: commonName,
      parentEntity: entity,
      referencedEntity: common,
      isRequiredCollection: true,
      data: {
        edfiOdsRelational: {
          odsName: commonPropertyName,
          odsIsCollection: true,
        },
      },
    });
    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    const mainTable: Table = { ...newTable(), schema: tableSchema, tableId: tableName };

    buildTableFor({
      originalEntity: entity,
      property: commonProperty,
      parentTableStrategy: TableStrategy.default(mainTable),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault.makeLeafColumnsNullable(),
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: commonProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return required collection table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + commonPropertyName);
    expect(tables[0].schema).toBe(tableSchema);
    expect(tables[0].isRequiredCollectionTable).toBe(true);
  });

  it('should have two primary keys', (): void => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(commonPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should have correct property paths', (): void => {
    expect(tables[0].columns[0].propertyPath).toMatchInlineSnapshot(`"EntityPkName"`);
    expect(tables[0].columns[1].propertyPath).toMatchInlineSnapshot(`"CommonName.CommonPkName"`);
  });

  it('should have correct original entities', (): void => {
    expect(tables[0].columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(tables[0].columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});
