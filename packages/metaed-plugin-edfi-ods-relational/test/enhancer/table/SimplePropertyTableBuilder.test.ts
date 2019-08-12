import { newDomainEntity, newIntegerProperty } from 'metaed-core';
import { DomainEntity, IntegerProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { newTable } from '../../../src/model/database/Table';
import { tableBuilderFactory } from '../../../src/enhancer/table/TableBuilderFactory';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';
import { Table } from '../../../src/model/database/Table';
import { TableBuilder } from '../../../src/enhancer/table/TableBuilder';

describe('when building simple entity property table with collection property and identity property', (): void => {
  const tableName = 'TableName';
  const tableSchema = 'tableschema';
  const entityPropertyName = 'EntityPropertyName';
  const entityPkName = 'EntityPkName';
  const entityPropertyDocumentation = 'EntityPropertyDocumentation';
  const tables: Table[] = [];

  beforeAll(() => {
    const table: Table = Object.assign(newTable(), {
      schema: tableSchema,
      name: tableName,
      nameComponents: [tableName],
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOds: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });

    const entityProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPropertyName,
      documentation: entityPropertyDocumentation,
      parentEntity: entity,
      isPartOfIdentity: false,
      data: {
        edfiOds: {
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
      parentEntity: entity,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
          odsIsCollection: false,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityProperty);
    tableBuilder.buildTables(entityProperty, TableStrategy.default(table), primaryKeys, BuildStrategyDefault, tables, null);
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].name).toBe(tableName + entityPropertyName);
    expect(tables[0].schema).toBe(tableSchema);
    expect(tables[0].description).toBe(entityPropertyDocumentation);
    expect(tables[0].isRequiredCollectionTable).toBe(false);
  });

  it('should have two columns', (): void => {
    expect(tables[0].columns).toHaveLength(2);
  });

  it('should have primary key', (): void => {
    expect(tables[0].columns[0].name).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should convert collection to primary key', (): void => {
    expect(tables[0].columns[1].name).toBe(entityPropertyName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should have foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnNames).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTableName).toBe(tableName + entityPropertyName);
    expect(tables[0].foreignKeys[0].columnNames[0].parentTableColumnName).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableName).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnNames[0].foreignTableColumnName).toBe(entityPkName);
  });
});
