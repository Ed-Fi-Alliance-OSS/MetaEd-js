import {
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newDomainEntityExtension,
  newIntegerProperty,
  newNamespace,
  addEntityForNamespace,
  SemVer,
  MetaEdPropertyPath,
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
import { newTable } from '../../../src/model/database/Table';
import { TableStrategy } from '../../../src/model/database/TableStrategy';
import { Column } from '../../../src/model/database/Column';
import { Table } from '../../../src/model/database/Table';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';
import { buildTableFor } from '../../../src/enhancer/table/TableBuilder';

const targetTechnologyVersion: SemVer = '7.1.0';

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
      fullPropertyName: commonPkName,
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
      fullPropertyName: commonExtensionPropertyName,
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
      metaEdName: 'Entity',
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
      fullPropertyName: entityPkName,
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
      fullPropertyName: commonName,
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

    const primaryKeys: Column[] = createColumnFor(
      entity,
      entityPkProperty,
      BuildStrategyDefault,
      entityPkProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );

    const mainTable: Table = { ...newTable(), schema: tableSchema, tableId: tableName };

    buildTableFor({
      originalEntity: entity,
      property: commonProperty,
      parentTableStrategy: TableStrategy.default(mainTable),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: commonProperty.fullPropertyName as MetaEdPropertyPath,
    });
  });

  it('should return join table', (): void => {
    expect(tables).toHaveLength(1);
    expect(tables[0].tableId).toBe(`${tableName}${commonName}Extension`);
    expect(tables[0].schema).toBe(extensionNamespaceName.toLowerCase());
  });

  it('should have three columns with two primary keys', (): void => {
    expect(tables[0].columns).toHaveLength(3);
    expect(tables[0].columns[0].columnId).toBe(entityPkName);
    expect(tables[0].columns[0].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[1].columnId).toBe(commonPkName);
    expect(tables[0].columns[1].isPartOfPrimaryKey).toBe(true);
    expect(tables[0].columns[2].columnId).toBe(commonExtensionPropertyName);
    expect(tables[0].columns[2].isPartOfPrimaryKey).toBe(false);
  });

  it('should have correct column property paths', (): void => {
    expect(tables[0].columns[0].propertyPath).toMatchInlineSnapshot(`"EntityPkName"`);
    expect(tables[0].columns[1].propertyPath).toMatchInlineSnapshot(`"CommonName.CommonPkName"`);
    expect(tables[0].columns[2].propertyPath).toMatchInlineSnapshot(`"CommonName.CommonExtensionPropertyName"`);
  });

  it('should have correct original entitie', (): void => {
    expect(tables[0].columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(tables[0].columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
    expect(tables[0].columns[2].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });

  it('should have one foreign key', (): void => {
    expect(tables[0].foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    expect(tables[0].foreignKeys[0].columnPairs).toHaveLength(2);
    expect(tables[0].foreignKeys[0].parentTable.tableId).toBe(`${tableName + commonName}Extension`);
    expect(tables[0].foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(entityPkName);
    expect(tables[0].foreignKeys[0].columnPairs[1].parentTableColumnId).toBe(commonPkName);

    expect(tables[0].foreignKeys[0].foreignTableId).toBe(tableName + commonName);
    expect(tables[0].foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(entityPkName);
    expect(tables[0].foreignKeys[0].columnPairs[1].foreignTableColumnId).toBe(commonPkName);
  });
});
