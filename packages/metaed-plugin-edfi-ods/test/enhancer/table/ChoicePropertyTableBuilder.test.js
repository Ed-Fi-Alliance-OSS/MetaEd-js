// @flow
import type { DomainEntity, Choice, ChoiceProperty, IntegerProperty } from 'metaed-core';
import { newDomainEntity, newChoice, newChoiceProperty, newIntegerProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { newTable } from '../../../src/model/database/Table';
import { tableBuilderFactory } from '../../../src/enhancer/table/TableBuilderFactory';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';
import type { Table } from '../../../src/model/database/Table';
import type { TableBuilder } from '../../../src/enhancer/table/TableBuilder';

describe('when building choice property table with two integer properties', () => {
  const choiceEntityPropertyName1: string = 'ChoiceEntityPropertyName1';
  const choiceEntityPropertyName2: string = 'ChoiceEntityPropertyName2';
  const entityPkName: string = 'EntityPkName';
  const tables: Array<Table> = [];
  let table: Table;

  beforeAll(() => {
    table = Object.assign(newTable(), {
      schema: 'TableSchema',
      name: 'TableName',
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
    const entityChoiceProperty: ChoiceProperty = Object.assign(newChoiceProperty(), {
      parentEntity: entity,
      data: {
        edfiOds: {
        },
      },
    });

    const choice: Choice = Object.assign(newChoice(), {
      data: {
        edfiOds: {
          ods_Properties: [],
        },
      },
    });
    const choiceEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: choiceEntityPropertyName1,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsUniqueIndex: false,
        },
      },
    });
    const choiceEntityProperty2: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: choiceEntityPropertyName2,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsUniqueIndex: false,
        },
      },
    });
    choice.data.edfiOds.ods_Properties.push(...[choiceEntityProperty1, choiceEntityProperty2]);
    entityChoiceProperty.referencedEntity = choice;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityChoiceProperty);
    tableBuilder.buildTables(entityChoiceProperty, TableStrategy.default(table), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return no join table', () => {
    expect(tables).toHaveLength(0);
  });

  it('should have two columns', () => {
    expect(table.columns).toHaveLength(2);
    expect(table.columns[0].name).toBe(choiceEntityPropertyName1);
    expect(table.columns[1].name).toBe(choiceEntityPropertyName2);
  });
});
