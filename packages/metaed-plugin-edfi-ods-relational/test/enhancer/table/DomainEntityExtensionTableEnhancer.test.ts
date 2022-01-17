import {
  addEntityForNamespace,
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newDomainEntity,
  newDomainEntityExtension,
  newDomainEntityProperty,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import {
  Common,
  CommonExtension,
  CommonProperty,
  DomainEntity,
  DomainEntityExtension,
  DomainEntityProperty,
  IntegerProperty,
  MetaEdEnvironment,
  Namespace,
} from '@edfi/metaed-core';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { enhance } from '../../../src/enhancer/table/DomainEntityExtensionTableEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../../src/model/EdFiOdsRelationalEntityRepository';
import { Table } from '../../../src/model/database/Table';

describe('when DomainEntityExtensionTableEnhancer enhances domain entity extension', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const documentation = 'Documentation';
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const domainEntityExtensionTableName = 'DomainEntityExtensionNameExtension';
  const domainEntityExtensionPropertyName = 'DomainEntityExtensionPropertyName';

  beforeAll(() => {
    const domainEntityName = 'DomainEntityName';
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      documentation,
      metaEdName: domainEntityName,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityPkProperty);
    addEntityForNamespace(domainEntity);

    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      documentation,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionPropertyName,
      isPartOfIdentity: false,
      parentEntity: domainEntityExtension,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityExtensionPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionProperty);
    addEntityForNamespace(domainEntityExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName)).toBeDefined();
  });

  it('should have schema equal to namespace', (): void => {
    expect((tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName) as Table).schema).toBe(
      'extension',
    );
  });

  it('should have description equal to documentation', (): void => {
    expect((tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName) as Table).description).toBe(
      documentation,
    );
  });

  it('should have two columns', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(domainEntityExtensionPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });
});

describe('when DomainEntityExtensionTableEnhancer enhances domain entity extension with primary key', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const domainEntityExtensionTableName = 'DomainEntityExtensionNameExtension';
  const domainEntityExtensionPkPropertyName = 'DomainEntityExtensionPkPropertyName';

  beforeAll(() => {
    const domainEntityName = 'DomainEntityName';
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityPkProperty);
    addEntityForNamespace(domainEntity);

    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntityExtension,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityExtensionPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionPkProperty);
    addEntityForNamespace(domainEntityExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName)).toBeDefined();
  });

  it('should have one primary key column', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(domainEntityExtensionPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should include create date column', (): void => {
    expect(
      (tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName) as Table).includeCreateDateColumn,
    ).toBe(true);
  });
});

describe('when DomainEntityExtensionTableEnhancer enhances domain entity extension with common extension override', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName = 'CommonName';
  const commonExtensionName = 'CommonExtensionName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const domainEntityExtensionTableName = 'DomainEntityExtensionNameExtension';

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      namespace,
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkPropertyName = 'CommonPkPropertyName';
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: common,
      data: {
        edfiOdsRelational: {
          odsName: commonPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);
    addEntityForNamespace(common);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityPkProperty);
    addEntityForNamespace(domainEntity);

    const commonExtension: CommonExtension = Object.assign(newCommonExtension(), {
      namespace: extensionNamespace,
      metaEdName: commonExtensionName,
      baseEntityName: common.metaEdName,
      baseEntity: common,
      data: {
        edfiOdsRelational: {
          odsTableId: commonExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonExtensionRequiredPropertyName = 'CommonExtensionRequiredPropertyName';
    const commonExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: commonExtension,
      data: {
        edfiOdsRelational: {
          odsName: commonExtensionRequiredPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    commonExtension.data.edfiOdsRelational.odsProperties.push(commonExtensionRequiredProperty);
    addEntityForNamespace(commonExtension);

    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionRequiredPropertyName = 'DomainEntityExtensionRequiredPropertyName';
    const domainEntityExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: domainEntityExtension,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityExtensionRequiredPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionRequiredProperty);
    const domainEntityExtensionReferencePropertyName = 'DomainEntityExtensionReferencePropertyName';
    const domainEntityExtensionReferenceProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionReferencePropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntityExtension,
      referencedEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityExtensionReferencePropertyName,
          odsContextPrefix: '',
          odsDeleteCascadePrimaryKey: true,
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionReferenceProperty);
    domainEntityExtension.data.edfiOdsRelational.odsIdentityProperties.push(domainEntityExtensionReferenceProperty);
    const domainEntityExtensionCommonExtensionOverrideProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonExtensionName,
      isRequired: true,
      parentEntity: domainEntityExtension,
      referencedEntity: commonExtension,
      isExtensionOverride: true,
      data: {
        edfiOdsRelational: {
          odsName: commonExtensionName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionCommonExtensionOverrideProperty);
    addEntityForNamespace(domainEntityExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(2);
  });

  it('should create table for domain entity extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName)).toBeDefined();
  });

  it('should include create date column', (): void => {
    expect(
      (tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName) as Table).includeCreateDateColumn,
    ).toBe(true);
  });

  it('should create common extension override join table', (): void => {
    expect(
      tableEntities(metaEd, extensionNamespace).get(`${domainEntityName + commonExtensionName}Extension`),
    ).toBeDefined();
  });
});

describe('when DomainEntityExtensionTableEnhancer enhances domain entity extension with common', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName = 'CommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const domainEntityExtensionTableName = 'DomainEntityExtensionNameExtension';

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      namespace,
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkPropertyName = 'CommonPkPropertyName';
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: common,
      data: {
        edfiOdsRelational: {
          odsName: commonPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);
    addEntityForNamespace(common);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityPkProperty);
    addEntityForNamespace(domainEntity);

    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionRequiredPropertyName = 'DomainEntityExtensionRequiredPropertyName';
    const domainEntityExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: domainEntityExtension,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityExtensionRequiredPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionRequiredProperty);
    const domainEntityExtensionReferencePropertyName = 'DomainEntityExtensionReferencePropertyName';
    const domainEntityExtensionReferenceProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionReferencePropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntityExtension,
      referencedEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityExtensionReferencePropertyName,
          odsContextPrefix: '',
          odsDeleteCascadePrimaryKey: true,
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionReferenceProperty);
    domainEntityExtension.data.edfiOdsRelational.odsIdentityProperties.push(domainEntityExtensionReferenceProperty);
    const domainEntityExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName,
      isRequired: true,
      parentEntity: domainEntityExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionCommonProperty);
    addEntityForNamespace(domainEntityExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(2);
  });

  it('should create a table for domain entity extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName)).toBeDefined();
  });

  it('should include create date column', (): void => {
    expect(
      (tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName) as Table).includeCreateDateColumn,
    ).toBe(true);
  });

  it('should create join table from domain entity and common', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityName + commonName)).toBeDefined();
  });
});

describe('when DomainEntityExtensionTableEnhancer enhances domain entity extension with only common', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName = 'CommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const domainEntityExtensionTableName = 'DomainEntityExtensionNameExtension';

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      namespace,
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkPropertyName = 'CommonPkPropertyName';
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: common,
      data: {
        edfiOdsRelational: {
          odsName: commonPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);
    addEntityForNamespace(common);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityPkProperty);
    addEntityForNamespace(domainEntity);

    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName,
      isOptional: true,
      parentEntity: domainEntityExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionCommonProperty);
    addEntityForNamespace(domainEntityExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create one tables', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
  });

  it('should not create a table for domain entity extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName)).toBeUndefined();
  });

  it('should create join table from domain entity and common', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityName + commonName)).toBeDefined();
  });
});

describe('when DomainEntityExtensionTableEnhancer enhances domain entity extension with only commons', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName1 = 'CommonName1';
  const commonName2 = 'CommonName2';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const domainEntityExtensionTableName = 'DomainEntityExtensionNameExtension';

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      namespace,
      metaEdName: commonName1,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName1,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const commonPkPropertyName = 'CommonPkPropertyName';
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: common,
      data: {
        edfiOdsRelational: {
          odsName: commonPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);
    addEntityForNamespace(common);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityPkProperty);
    addEntityForNamespace(domainEntity);

    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName1,
      isOptional: true,
      parentEntity: domainEntityExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName1,
          odsContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionCommonProperty);
    const domainEntityExtensionCommonProperty2: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName2,
      isOptional: true,
      parentEntity: domainEntityExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName2,
          odsContextPrefix: '',
          odsIsCollection: true,
        },
      },
    });
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionCommonProperty2);
    addEntityForNamespace(domainEntityExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(2);
  });

  it('should not create a table for domain entity extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName)).toBeUndefined();
  });

  it('should create join table from domain entity and common', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityName + commonName1)).toBeDefined();
  });

  it('should create join table from domain entity and common collection', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityName + commonName2)).toBeDefined();
  });
});

// METAED-763
describe('when DomainEntityExtensionTableEnhancer enhances domain entity extension with only optional common property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName = 'CommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const domainEntityExtensionTableName = 'DomainEntityExtensionNameExtension';

  beforeAll(() => {
    const common: Common = {
      ...newCommon(),
      namespace,
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    };
    const commonPkPropertyName = 'CommonPkPropertyName';
    const commonPkProperty: IntegerProperty = {
      ...newIntegerProperty(),
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: common,
      data: {
        edfiOdsRelational: {
          odsName: commonPkPropertyName,
          odsContextPrefix: '',
        },
      },
    };
    common.data.edfiOdsRelational.odsProperties.push(commonPkProperty);
    common.data.edfiOdsRelational.odsIdentityProperties.push(commonPkProperty);
    addEntityForNamespace(common);

    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    };
    const domainEntityPkPropertyName = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = {
      ...newIntegerProperty(),
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPkPropertyName,
          odsContextPrefix: '',
        },
      },
    };
    domainEntity.data.edfiOdsRelational.odsProperties.push(domainEntityPkProperty);
    addEntityForNamespace(domainEntity);

    const domainEntityExtension: DomainEntityExtension = {
      ...newDomainEntityExtension(),
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    };
    const domainEntityExtensionCommonProperty: CommonProperty = {
      ...newCommonProperty(),
      namespace: extensionNamespace,
      metaEdName: commonName,
      isOptional: true,
      parentEntity: domainEntityExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName,
          odsContextPrefix: '',
        },
      },
    };
    domainEntityExtension.data.edfiOdsRelational.odsProperties.push(domainEntityExtensionCommonProperty);
    addEntityForNamespace(domainEntityExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create one tables', (): void => {
    const x = tableEntities(metaEd, extensionNamespace);
    // expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(x.size).toBe(1);
  });

  it('should not create a table for domain entity extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityExtensionTableName)).toBeUndefined();
  });

  it('should create join table from domain entity and common', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntityName + commonName)).toBeDefined();
  });
});
