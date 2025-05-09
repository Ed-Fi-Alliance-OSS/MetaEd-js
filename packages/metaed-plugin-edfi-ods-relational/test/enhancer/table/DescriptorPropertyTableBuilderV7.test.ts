// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntity,
  Descriptor,
  DescriptorProperty,
  IntegerProperty,
  SemVer,
  MetaEdPropertyPath,
} from '@edfi/metaed-core';
import { newDomainEntity, newDescriptor, newDescriptorProperty, newIntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { newTable } from '../../../src/model/database/Table';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { Table } from '../../../src/model/database/Table';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';
import { buildTableFor } from '../../../src/enhancer/table/TableBuilder';

const targetTechnologyVersion: SemVer = '7.1.0';

describe('when building descriptor property table', (): void => {
  const descriptorName = 'DescriptorName';
  const descriptorPropertyName = 'DescriptorPropertyName';
  const tableName = 'TableName';
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: 'TableSchema', tableId: tableName };

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'EntityPkName',
      fullPropertyName: 'EntityPkName',
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
    const entityDescriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorName,
      fullPropertyName: descriptorName,
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: descriptorPropertyName,
          odsIsCollection: false,
        },
      },
    });

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      data: {
        edfiOdsRelational: {
          odsDescriptorName: descriptorName,
          odsProperties: [],
        },
      },
    });
    const descriptorEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'DescriptorEntityPropertyName1',
      fullPropertyName: 'DescriptorEntityPropertyName1',
      isPartOfIdentity: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    descriptor.data.edfiOdsRelational.odsProperties.push(descriptorEntityProperty1);
    entityDescriptorProperty.referencedEntity = descriptor;

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    buildTableFor({
      originalEntity: entity,
      property: entityDescriptorProperty,
      parentTableStrategy: TableStrategy.default(table),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: entityDescriptorProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return no join table', (): void => {
    expect(tables).toHaveLength(0);
  });

  it('should create one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(`${descriptorPropertyName}Id`);
  });

  it('should have correct property paths', (): void => {
    expect(table.columns[0].propertyPath).toMatchInlineSnapshot(`"DescriptorName"`);
  });

  it('should have correct original entities', (): void => {
    expect(table.columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });

  it('should create one foreign key', (): void => {
    expect(table.foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(table.foreignKeys[0].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[0].parentTable.tableId).toBe(tableName);
    expect(table.foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(`${descriptorPropertyName}Id`);

    expect(table.foreignKeys[0].foreignTableId).toBe(descriptorName);
    expect(table.foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(`${descriptorPropertyName}Id`);
  });
});

describe('when building collection descriptor property table', (): void => {
  const descriptorName = 'DescriptorName';
  const descriptorEntityPropertyName1 = 'DescriptorEntityPropertyName1';
  const entityPkName = 'EntityPkName';
  const tableSchema = 'tableschema';
  const tableName = 'TableName';
  const tables: Table[] = [];
  let table: Table;

  beforeAll(() => {
    table = { ...newTable(), schema: tableSchema, tableId: tableName };

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
    const entityDescriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorName,
      fullPropertyName: descriptorName,
      parentEntity: entity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: descriptorName,
          odsIsCollection: true,
        },
      },
    });

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      data: {
        edfiOdsRelational: {
          odsDescriptorName: descriptorName,
          odsProperties: [],
        },
      },
    });
    const descriptorEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: descriptorEntityPropertyName1,
      fullPropertyName: descriptorEntityPropertyName1,
      isPartOfIdentity: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    descriptor.data.edfiOdsRelational.odsProperties.push(descriptorEntityProperty1);
    entityDescriptorProperty.referencedEntity = descriptor;

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    buildTableFor({
      originalEntity: entity,
      property: entityDescriptorProperty,
      parentTableStrategy: TableStrategy.default(table),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: entityDescriptorProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(tableName + descriptorName);
    expect(tables[0].schema).toBe(tableSchema);
  });

  it('should create two primary key columns', (): void => {
    expect(tables[0].columns).toHaveLength(2);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(`${descriptorName}Id`);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
  });

  it('should have correct property paths', (): void => {
    expect(tables[0].columns[0].propertyPath).toMatchInlineSnapshot(`"EntityPkName"`);
    expect(tables[0].columns[1].propertyPath).toMatchInlineSnapshot(`"DescriptorName"`);
  });

  it('should have correct original entities', (): void => {
    expect(tables[0].columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(tables[0].columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });

  it('should create one foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(2);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(tableName + descriptorName);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[1].columnPairs).toHaveLength(1);
    expect(tables[0].foreignKeys[1].parentTable.tableId).toBe(tableName + descriptorName);
    expect(tables[0].foreignKeys[1].columnPairs[0].parentTableColumnId).toBe(`${descriptorName}Id`);

    expect(tables[0].foreignKeys[1].foreignTableId).toBe(descriptorName);
    expect(tables[0].foreignKeys[1].columnPairs[0].foreignTableColumnId).toBe(`${descriptorName}Id`);
  });
});
