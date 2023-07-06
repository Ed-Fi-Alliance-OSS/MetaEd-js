import { DomainEntity, Common, InlineCommonProperty, IntegerProperty, SemVer } from '@edfi/metaed-core';
import { newDomainEntity, newInlineCommon, newInlineCommonProperty, newIntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { newTable } from '../../../src/model/database/Table';
import { tableBuilderFactory } from '../../../src/enhancer/table/TableBuilderFactory';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';
import { Table } from '../../../src/model/database/Table';
import { TableBuilder } from '../../../src/enhancer/table/TableBuilder';

const targetTechnologyVersion: SemVer = '7.0.0';

describe('when building inline common property table', (): void => {
  const inlineCommonEntityPropertyName1 = 'InlineCommonEntityPropertyName1';
  const contextName = 'ContextName';
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
    const inlineCommonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
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
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    inlineCommon.data.edfiOdsRelational.odsProperties.push(inlineCommonEntityProperty1);
    inlineCommonProperty.referencedEntity = inlineCommon;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty, '7.0.0');
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(inlineCommonProperty);
    tableBuilder.buildTables(
      inlineCommonProperty,
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

  it('should have one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(contextName + inlineCommonEntityPropertyName1);
  });
});

describe('when building optional inline common property table', (): void => {
  const inlineCommonEntityPropertyName1 = 'InlineCommonEntityPropertyName1';
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
    const inlineCommonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
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
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsUniqueIndex: false,
        },
      },
    });
    inlineCommon.data.edfiOdsRelational.odsProperties.push(inlineCommonEntityProperty1);
    inlineCommonProperty.referencedEntity = inlineCommon;

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty, '7.0.0');
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(inlineCommonProperty);
    tableBuilder.buildTables(
      inlineCommonProperty,
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

  it('should have one column', (): void => {
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(inlineCommonEntityPropertyName1);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
    expect(table.columns[0].isNullable).toBe(true);
    expect(table.columns[0].isIdentityDatabaseType).toBe(false);
  });
});
