import { DomainEntity, Choice, ChoiceProperty, IntegerProperty, SemVer } from '@edfi/metaed-core';
import { newDomainEntity, newChoice, newChoiceProperty, newIntegerProperty } from '@edfi/metaed-core';
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

describe('when building choice property table with two integer properties', (): void => {
  const choiceEntityPropertyName1 = 'ChoiceEntityPropertyName1';
  const choiceEntityPropertyName2 = 'ChoiceEntityPropertyName2';
  const entityPkName = 'EntityPkName';
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
    const entityChoiceProperty: ChoiceProperty = Object.assign(newChoiceProperty(), {
      parentEntity: entity,
      data: {
        edfiOdsRelational: {},
      },
    });

    const choice: Choice = Object.assign(newChoice(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [],
        },
      },
    });
    const choiceEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: choiceEntityPropertyName1,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    const choiceEntityProperty2: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: choiceEntityPropertyName2,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    choice.data.edfiOdsRelational.odsProperties.push(...[choiceEntityProperty1, choiceEntityProperty2]);
    entityChoiceProperty.referencedEntity = choice;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty, '6.1.0');
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(entityChoiceProperty);
    tableBuilder.buildTables(
      entityChoiceProperty,
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

  it('should have two columns', (): void => {
    expect(table.columns).toHaveLength(2);
    expect(table.columns[0].columnId).toBe(choiceEntityPropertyName1);
    expect(table.columns[1].columnId).toBe(choiceEntityPropertyName2);
  });
});
