// @flow
import type { DomainEntity, Common, InlineCommonProperty, IntegerProperty } from 'metaed-core';
import { newDomainEntity, newInlineCommon, newInlineCommonProperty, newIntegerProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { newTable } from '../../../src/model/database/Table';
import { tableBuilderFactory } from '../../../src/enhancer/table/TableBuilderFactory';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';
import type { Table } from '../../../src/model/database/Table';
import type { TableBuilder } from '../../../src/enhancer/table/TableBuilder';

describe('when building inline common property table', () => {
  const inlineCommonEntityPropertyName1: string = 'InlineCommonEntityPropertyName1';
  const contextName: string = 'ContextName';
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
    const inlineCommonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: contextName,
        },
      },
    });

    const inlineCommon: Common = Object.assign(newInlineCommon(), {
      data: {
        edfiOds: {
          ods_Properties: [],
        },
      },
    });
    const inlineCommonEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: inlineCommonEntityPropertyName1,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsUniqueIndex: false,
        },
      },
    });
    inlineCommon.data.edfiOds.ods_Properties.push(inlineCommonEntityProperty1);
    inlineCommonProperty.referencedEntity = inlineCommon;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(inlineCommonProperty);
    tableBuilder.buildTables(inlineCommonProperty, TableStrategy.default(table), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return no join table', () => {
    expect(tables).toHaveLength(0);
  });

  it('should have one column', () => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(contextName + inlineCommonEntityPropertyName1);
  });
});

describe('when building optional inline common property table', () => {
  const inlineCommonEntityPropertyName1: string = 'InlineCommonEntityPropertyName1';
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
    const inlineCommonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      parentEntity: entity,
      isOptional: true,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
        },
      },
    });

    const inlineCommon: Common = Object.assign(newInlineCommon(), {
      data: {
        edfiOds: {
          ods_Properties: [],
        },
      },
    });
    const inlineCommonEntityProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: inlineCommonEntityPropertyName1,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsUniqueIndex: false,
        },
      },
    });
    inlineCommon.data.edfiOds.ods_Properties.push(inlineCommonEntityProperty1);
    inlineCommonProperty.referencedEntity = inlineCommon;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty);
    const primaryKeys: Array<Column> = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(inlineCommonProperty);
    tableBuilder.buildTables(inlineCommonProperty, TableStrategy.default(table), primaryKeys, BuildStrategyDefault, tables);
  });

  it('should return no join table', () => {
    expect(tables).toHaveLength(0);
  });

  it('should have one column', () => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(inlineCommonEntityPropertyName1);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
    expect(table.columns[0].isNullable).toBe(true);
    expect(table.columns[0].isIdentityDatabaseType).toBe(false);
  });
});
