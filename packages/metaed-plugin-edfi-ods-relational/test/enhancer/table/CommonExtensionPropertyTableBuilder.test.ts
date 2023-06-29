import {
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newDomainEntityExtension,
  newIntegerProperty,
  newNamespace,
  addEntityForNamespace,
  SemVer,
} from '@edfi/metaed-core';
import {
  Common,
  CommonExtension,
  CommonProperty,
  DomainEntityExtension,
  IntegerProperty,
  Namespace,
} from '@edfi/metaed-core';
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

describe('when building common property extension table', (): void => {
  const tableName = 'TableName';
  const tableSchema = 'TableSchema';
  const entityPkName = 'EntityPkName';
  const commonName = 'CommonName';
  const commonPkName = 'CommonPkName';
  const commonExtensionPropertyName = 'CommonExtensionPropertyName';
  const extensionNamespaceName = 'Extension';
  const tables: Table[] = [];
  const coreNamespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: extensionNamespaceName };
  extensionNamespace.dependencies.push(coreNamespace);

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      namespace: coreNamespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkName,
      namespace: coreNamespace,
      parentEntity: common,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);

    const commonExtension: CommonExtension = Object.assign(newCommonExtension(), {
      metaEdName: commonName,
      baseEntityName: common.metaEdName,
      baseEntityNamespaceName: coreNamespace.namespaceName,
      baseEntity: common,
      namespace: extensionNamespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    addEntityForNamespace(commonExtension);
    const commonExtensionProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonExtensionPropertyName,
      parentEntity: commonExtension,
      namespace: extensionNamespace,
      data: {
        edfiOdsRelational: {
          odsName: '',
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });
    commonExtension.data.edfiOdsRelational.odsProperties.push(commonExtensionProperty);

    const entity: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkName,
      namespace: extensionNamespace,
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
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      namespace: extensionNamespace,
      referencedNamespaceName: extensionNamespace.namespaceName,
      parentEntity: entity,
      referencedEntity: common,
      isExtensionOverride: true,
      data: {
        edfiOdsRelational: {
          odsName: commonName,
        },
      },
    });

    entity.data.edfiOdsRelational.odsProperties.push(entityPkProperty, commonProperty);
    entity.data.edfiOdsRelational.odsIdentityProperties.push(entityPkProperty);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(entityPkProperty, '6.1.0');
    const primaryKeys: Column[] = columnCreator.createColumns(entityPkProperty, BuildStrategyDefault);

    const mainTable: Table = { ...newTable(), schema: tableSchema, tableId: tableName };
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(commonProperty);
    tableBuilder.buildTables(
      commonProperty,
      TableStrategy.default(mainTable),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      null,
    );
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(`${tableName}${commonName}Extension`);
    expect(tables[0].schema).toBe(extensionNamespaceName.toLowerCase());
  });

  it('should have three columns with two primary keys', (): void => {
    expect(tables[0].columns).toHaveLength(3);
    expect(tables[0].columns[0].columnId).toBe(commonPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(entityPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[2].columnId).toBe(commonExtensionPropertyName);
    expect(tables[0].columns[2].isPartOfPrimaryKey).toBe(false);
  });

  it('should have one foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(2);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(`${tableName + commonName}Extension`);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(commonPkName);
    expect(tables[0].foreignKeys[0].columnPairs[1].parentTableColumnId).toBe(entityPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName + commonName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(commonPkName);
    expect(tables[0].foreignKeys[0].columnPairs[1].foreignTableColumnId).toBe(entityPkName);
  });
});
