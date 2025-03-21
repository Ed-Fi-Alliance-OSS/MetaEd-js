// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DomainEntity, Common, InlineCommonProperty, IntegerProperty, SemVer, MetaEdPropertyPath } from '@edfi/metaed-core';
import { newDomainEntity, newInlineCommon, newInlineCommonProperty, newIntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { newTable } from '../../../src/model/database/Table';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { Table } from '../../../src/model/database/Table';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';
import { buildTableFor } from '../../../src/enhancer/table/TableBuilder';

const targetTechnologyVersion: SemVer = '6.1.0';

describe('when building inline common property table', (): void => {
  const inlineCommonEntityPropertyName1 = 'InlineCommonEntityPropertyName1';
  const inlineCommonPropertyName = 'InlineCommonPropertyName';
  const contextName = 'ContextName';
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
    const inlineCommonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      metaEdName: inlineCommonPropertyName,
      fullPropertyName: inlineCommonPropertyName,
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: contextName,
        },
      },
    });

    const inlineCommon: Common = Object.assign(newInlineCommon(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [],
        },
      },
    });
    const inlineCommonEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: inlineCommonEntityPropertyName1,
      fullPropertyName: inlineCommonEntityPropertyName1,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    inlineCommon.data.edfiOdsRelational.odsProperties.push(inlineCommonEntityProperty1);
    inlineCommonProperty.referencedEntity = inlineCommon;

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '6.1.0',
    );

    buildTableFor({
      originalEntity: entity,
      property: inlineCommonProperty,
      parentTableStrategy: TableStrategy.default(table),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: inlineCommonProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should have one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(contextName + inlineCommonEntityPropertyName1);
  });

  it('should have correct property paths', (): void => {
    expect(table.columns[0].propertyPath).toMatchInlineSnapshot(
      `"InlineCommonPropertyName.InlineCommonEntityPropertyName1"`,
    );
  });

  it('should have correct original entities', (): void => {
    expect(table.columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when building optional inline common property table', (): void => {
  const inlineCommonEntityPropertyName1 = 'InlineCommonEntityPropertyName1';
  const inlineCommonPropertyName = 'InlineCommonPropertyName';
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
    const inlineCommonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      metaEdName: inlineCommonPropertyName,
      fullPropertyName: inlineCommonPropertyName,
      parentEntity: entity,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
        },
      },
    });

    const inlineCommon: Common = Object.assign(newInlineCommon(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [],
        },
      },
    });
    const inlineCommonEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: inlineCommonEntityPropertyName1,
      fullPropertyName: inlineCommonEntityPropertyName1,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    inlineCommon.data.edfiOdsRelational.odsProperties.push(inlineCommonEntityProperty1);
    inlineCommonProperty.referencedEntity = inlineCommon;

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '6.1.0',
    );

    buildTableFor({
      originalEntity: entity,
      property: inlineCommonProperty,
      parentTableStrategy: TableStrategy.default(table),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: inlineCommonProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should have one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(inlineCommonEntityPropertyName1);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
    expect(table.columns[0].isNullable).toBe(true);
    expect(table.columns[0].isIdentityDatabaseType).toBe(false);
  });

  it('should have correct property paths', (): void => {
    expect(table.columns[0].propertyPath).toMatchInlineSnapshot(
      `"InlineCommonPropertyName.InlineCommonEntityPropertyName1"`,
    );
  });

  it('should have correct original entities', (): void => {
    expect(table.columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});
