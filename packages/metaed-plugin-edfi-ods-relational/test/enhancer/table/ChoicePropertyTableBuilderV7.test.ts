// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DomainEntity, Choice, ChoiceProperty, IntegerProperty, SemVer, MetaEdPropertyPath } from '@edfi/metaed-core';
import { newDomainEntity, newChoice, newChoiceProperty, newIntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { newTable } from '../../../src/model/database/Table';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { Table } from '../../../src/model/database/Table';
import { buildTableFor } from '../../../src/enhancer/table/TableBuilder';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';

const targetTechnologyVersion: SemVer = '7.1.0';

describe('when building choice property table with two integer properties', (): void => {
  const choiceName = 'ChoiceName';
  const choiceEntityPropertyName1 = 'ChoiceEntityPropertyName1';
  const choiceEntityPropertyName2 = 'ChoiceEntityPropertyName2';
  const entityPkName = 'EntityPkName';
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: 'TableSchema', tableId: 'TableName' };

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
    const entityChoiceProperty: ChoiceProperty = Object.assign(newChoiceProperty(), {
      metaEdName: choiceName,
      fullPropertyName: choiceName,
      parentEntity: entity,
      data: {
        edfiOdsRelational: {},
      },
    });

    const choice: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
        },
      },
    });
    const choiceEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: choiceEntityPropertyName1,
      fullPropertyName: choiceEntityPropertyName1,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    const choiceEntityProperty2: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: choiceEntityPropertyName2,
      fullPropertyName: choiceEntityPropertyName2,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    choice.data.edfiOdsRelational.odsProperties.push(...[choiceEntityProperty1, choiceEntityProperty2]);
    entityChoiceProperty.referencedEntity = choice;

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    buildTableFor({
      originalEntity: entity,
      property: entityChoiceProperty,
      parentTableStrategy: TableStrategy.default(table),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: entityChoiceProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should have two columns', (): void => {
    expect(table.columns).toHaveLength(2);
    expect(table.columns[0].columnId).toBe(choiceEntityPropertyName1);
    expect(table.columns[1].columnId).toBe(choiceEntityPropertyName2);

    expect(table.columns[0].propertyPath).toMatchInlineSnapshot(`"ChoiceName.ChoiceEntityPropertyName1"`);
    expect(table.columns[1].propertyPath).toMatchInlineSnapshot(`"ChoiceName.ChoiceEntityPropertyName2"`);

    expect(table.columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(table.columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});
