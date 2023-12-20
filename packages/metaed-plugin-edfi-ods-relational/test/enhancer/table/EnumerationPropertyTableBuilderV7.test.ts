import {
  DomainEntity,
  Enumeration,
  EnumerationProperty,
  IntegerProperty,
  MetaEdPropertyPath,
  SemVer,
} from '@edfi/metaed-core';
import { newDomainEntity, newEnumeration, newEnumerationProperty, newIntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { newTable } from '../../../src/model/database/Table';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { Table } from '../../../src/model/database/Table';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';
import { buildTableFor } from '../../../src/enhancer/table/TableBuilder';

const targetTechnologyVersion: SemVer = '7.1.0';

describe('when building enumeration property table', (): void => {
  const enumerationName = 'EnumerationName';
  const enumerationPropertyName = 'EnumerationPropertyName';
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
    const entityEnumerationProperty: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsTypeifiedBaseName: enumerationPropertyName,
          odsIsCollection: false,
        },
      },
    });

    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      data: {
        edfiOdsRelational: {
          odsTableId: enumerationName,
          ods_EnumerationName: enumerationName,
          odsProperties: [],
        },
      },
    });
    const enumerationEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'EnumerationPropertyName1',
      isPartOfIdentity: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    enumeration.data.edfiOdsRelational.odsProperties.push(enumerationEntityProperty1);
    entityEnumerationProperty.referencedEntity = enumeration;

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      '' as MetaEdPropertyPath,
      '7.0.0',
    );

    buildTableFor({
      originalEntity: entity,
      property: entityEnumerationProperty,
      parentTableStrategy: TableStrategy.default(table),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: '' as MetaEdPropertyPath,
    });
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should create one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(`${enumerationPropertyName}Id`);
  });

  it('should create one foreign key', (): void => {
    expect(table.foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(table.foreignKeys[0].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[0].parentTable.tableId).toBe(tableName);
    expect(table.foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(`${enumerationPropertyName}Id`);

    expect(table.foreignKeys[0].foreignTableId).toBe(enumerationName);
    expect(table.foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(`${enumerationPropertyName}Id`);
  });
});

describe('when building collection enumeration property table', (): void => {
  const enumerationName = 'EnumerationName';
  const enumerationEntityPropertyName1 = 'EnumerationEntityPropertyName1';
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
    const entityEnumerationProperty: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: enumerationName,
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsTypeifiedBaseName: enumerationName,
          odsIsCollection: true,
        },
      },
    });

    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      data: {
        edfiOdsRelational: {
          odsTableId: enumerationName,
          ods_EnumerationName: enumerationName,
          odsProperties: [],
        },
      },
    });
    const enumerationEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: enumerationEntityPropertyName1,
      isPartOfIdentity: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    enumeration.data.edfiOdsRelational.odsProperties.push(enumerationEntityProperty1);
    entityEnumerationProperty.referencedEntity = enumeration;

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      '' as MetaEdPropertyPath,
      '7.0.0',
    );

    buildTableFor({
      originalEntity: entity,
      property: entityEnumerationProperty,
      parentTableStrategy: TableStrategy.default(table),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: '' as MetaEdPropertyPath,
    });
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + enumerationName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should create two primary key columns', (): void => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(`${enumerationName}Id`);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should create one foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(2);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(tableName + enumerationName);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[1].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[1].parentTable.tableId).toBe(tableName + enumerationName);
    expect(tables[0].foreignKeys[1].columnPairs[0].parentTableColumnId).toBe(`${enumerationName}Id`);

    expect(tables[0].foreignKeys[1].foreignTableId).toBe(enumerationName);
    expect(tables[0].foreignKeys[1].columnPairs[0].foreignTableColumnId).toBe(`${enumerationName}Id`);
  });
});
