import { MetaEdPropertyPath, SemVer, newDomainEntity, newIntegerProperty } from '@edfi/metaed-core';
import { DomainEntity, IntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { newTable } from '../../../src/model/database/Table';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { Table } from '../../../src/model/database/Table';
import { buildTableFor } from '../../../src/enhancer/table/TableBuilder';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';

const targetTechnologyVersion: SemVer = '7.1.0';

describe('when building simple entity property table with collection property and identity property', (): void => {
  const tableName = 'TableName';
  const tableSchema = 'tableschema';
  const entityPropertyName = 'EntityPropertyName';
  const entityPkName = 'EntityPkName';
  const entityPropertyDocumentation = 'EntityPropertyDocumentation';
  const tables: Table[] = [];

  beforeAll(() => {
    const table: Table = { ...newTable(), schema: tableSchema, tableId: tableName };

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });

    const entityProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPropertyName,
      fullPropertyName: entityPropertyName,
      documentation: entityPropertyDocumentation,
      parentEntity: entity,
      isPartOfIdentity: false,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
          odsIsCollection: true,
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

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    buildTableFor({
      originalEntity: entity,
      property: entityProperty,
      parentTableStrategy: TableStrategy.default(table),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: entityProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + entityPropertyName);
    expect(tables[0].schema).toBe(tableSchema);
    expect(tables[0].description).toBe(entityPropertyDocumentation);
    expect(tables[0].isRequiredCollectionTable).toBe(false);
  });

  it('should have two columns', (): void => {
    expect(tables[0].columns).toHaveLength(2);
  });

  it('should have primary key', (): void => {
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should convert collection to primary key', (): void => {
    expect(tables[0].columns[1].columnId).toBe(entityPropertyName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should have correct property paths', (): void => {
    expect(tables[0].columns[0].propertyPath).toMatchInlineSnapshot(`"EntityPkName"`);
    expect(tables[0].columns[1].propertyPath).toMatchInlineSnapshot(`"EntityPropertyName"`);
  });

  it('should have correct original entities', (): void => {
    expect(tables[0].columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(tables[0].columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });

  it('should have foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(tableName + entityPropertyName);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(entityPkName);
  });
});
