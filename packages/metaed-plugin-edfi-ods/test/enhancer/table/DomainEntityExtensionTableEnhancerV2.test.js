// @flow
import {
  addEntity,
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newDomainEntity,
  newDomainEntityExtension,
  newDomainEntityProperty,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from 'metaed-core';
import type {
  Common,
  CommonExtension,
  CommonProperty,
  DomainEntity,
  DomainEntityExtension,
  DomainEntityProperty,
  IntegerProperty,
  MetaEdEnvironment,
  Namespace,
} from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/DomainEntityExtensionTableEnhancerV2';
import { enhance as initializeEdFiOdsEntityRepository } from '../../../src/model/EdFiOdsEntityRepository';
import type { Table } from '../../../src/model/database/Table';

describe('when DomainEntityExtensionTableEnhancerV2 enhances domain entity extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const documentation: string = 'Documentation';
  const domainEntityExtensionName: string = 'DomainEntityExtensionName';
  const domainEntityExtensionPropertyName: string = 'DomainEntityExtensionPropertyName';

  beforeAll(() => {
    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      extensionEntitySuffix: '',
    });
    const domainEntityName: string = 'DomainEntityName';
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      documentation,
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName: string = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOds.ods_Properties.push(domainEntityPkProperty);
    addEntity(metaEd.entity, domainEntity);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });
    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace,
      documentation,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_TableName: domainEntityExtensionName,
          ods_ExtensionName: domainEntityExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionPropertyName,
      isPartOfIdentity: false,
      parentEntity: domainEntityExtension,
      data: {
        edfiOds: {
          ods_Name: domainEntityExtensionPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOds.ods_Properties.push(domainEntityExtensionProperty);
    addEntity(metaEd.entity, domainEntityExtension);

    metaEd.dataStandardVersion = '2.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityExtensionName)).toBeDefined();
  });

  it('should have schema equal to namespace', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityExtensionName).schema).toBe(namespaceName);
  });

  it('should have description equal to documentation', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityExtensionName).description).toBe(documentation);
  });

  it('should have one column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityExtensionName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(domainEntityExtensionPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });
});

describe('when DomainEntityExtensionTableEnhancerV2 enhances domain entity extension with primary key', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityExtensionName: string = 'DomainEntityExtensionName';
  const domainEntityExtensionPkPropertyName: string = 'DomainEntityExtensionPkPropertyName';

  beforeAll(() => {
    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'namespace',
      extensionEntitySuffix: '',
    });
    const domainEntityName: string = 'DomainEntityName';
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName: string = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOds.ods_Properties.push(domainEntityPkProperty);
    addEntity(metaEd.entity, domainEntity);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });
    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_TableName: domainEntityExtensionName,
          ods_ExtensionName: domainEntityExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntityExtension,
      data: {
        edfiOds: {
          ods_Name: domainEntityExtensionPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOds.ods_Properties.push(domainEntityExtensionPkProperty);
    addEntity(metaEd.entity, domainEntityExtension);

    metaEd.dataStandardVersion = '2.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityExtensionName)).toBeDefined();
  });

  it('should have one primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityExtensionName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(domainEntityExtensionPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });
});

describe('when DomainEntityExtensionTableEnhancerV2 enhances domain entity extension with common extension override', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName: string = 'CommonName';
  const commonExtensionName: string = 'CommonExtensionName';
  const domainEntityName: string = 'DomainEntityName';
  const domainEntityExtensionName: string = 'DomainEntityExtensionName';

  beforeAll(() => {
    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'namespace',
      extensionEntitySuffix: '',
    });

    const common: Common = Object.assign(newCommon(), {
      namespace,
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_TableName: commonName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkPropertyName: string = 'CommonPkPropertyName';
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: common,
      data: {
        edfiOds: {
          ods_Name: commonPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);
    addEntity(metaEd.entity, common);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName: string = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOds.ods_Properties.push(domainEntityPkProperty);
    addEntity(metaEd.entity, domainEntity);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });

    const commonExtension: CommonExtension = Object.assign(newCommonExtension(), {
      namespace: extensionNamespace,
      metaEdName: commonExtensionName,
      baseEntityName: common.metaEdName,
      baseEntity: common,
      data: {
        edfiOds: {
          ods_TableName: commonExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonExtensionRequiredPropertyName: string = 'CommonExtensionRequiredPropertyName';
    const commonExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: commonExtension,
      data: {
        edfiOds: {
          ods_Name: commonExtensionRequiredPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    commonExtension.data.edfiOds.ods_Properties.push(commonExtensionRequiredProperty);
    addEntity(metaEd.entity, commonExtension);

    common.extender = commonExtension;

    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_TableName: domainEntityExtensionName,
          ods_ExtensionName: domainEntityExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionRequiredPropertyName: string = 'DomainEntityExtensionRequiredPropertyName';
    const domainEntityExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: domainEntityExtension,
      data: {
        edfiOds: {
          ods_Name: domainEntityExtensionRequiredPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOds.ods_Properties.push(domainEntityExtensionRequiredProperty);
    const domainEntityExtensionReferencePropertyName: string = 'DomainEntityExtensionReferencePropertyName';
    const domainEntityExtensionReferenceProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionReferencePropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntityExtension,
      referencedEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityExtensionReferencePropertyName,
          ods_ContextPrefix: '',
          ods_DeleteCascadePrimaryKey: true,
        },
      },
    });
    domainEntityExtension.data.edfiOds.ods_Properties.push(domainEntityExtensionReferenceProperty);
    domainEntityExtension.data.edfiOds.ods_IdentityProperties.push(domainEntityExtensionReferenceProperty);
    const domainEntityExtensionCommonExtensionOverrideProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonExtensionName,
      isRequired: true,
      parentEntity: domainEntityExtension,
      referencedEntity: commonExtension,
      isExtensionOverride: true,
      data: {
        edfiOds: {
          ods_Name: commonExtensionName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOds.ods_Properties.push(domainEntityExtensionCommonExtensionOverrideProperty);
    addEntity(metaEd.entity, domainEntityExtension);

    metaEd.dataStandardVersion = '2.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
  });

  it('should create table only for domain entity extension', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityExtensionName)).toBeDefined();
  });

  it('should not create common extension override join table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityName + commonExtensionName)).toBeUndefined();
  });
});

describe('when DomainEntityExtensionTableEnhancerV2 enhances domain entity extension with common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const domainEntityExtensionName: string = 'DomainEntityExtensionName';

  beforeAll(() => {
    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'namespace',
      extensionEntitySuffix: '',
    });

    const common: Common = Object.assign(newCommon(), {
      namespace,
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_TableName: commonName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkPropertyName: string = 'CommonPkPropertyName';
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: common,
      data: {
        edfiOds: {
          ods_Name: commonPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);
    addEntity(metaEd.entity, common);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName: string = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOds.ods_Properties.push(domainEntityPkProperty);
    addEntity(metaEd.entity, domainEntity);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });

    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace,
      metaEdName: domainEntityExtensionName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_TableName: domainEntityExtensionName,
          ods_ExtensionName: domainEntityExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityExtensionRequiredPropertyName: string = 'DomainEntityExtensionRequiredPropertyName';
    const domainEntityExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: domainEntityExtension,
      data: {
        edfiOds: {
          ods_Name: domainEntityExtensionRequiredPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOds.ods_Properties.push(domainEntityExtensionRequiredProperty);
    const domainEntityExtensionReferencePropertyName: string = 'DomainEntityExtensionReferencePropertyName';
    const domainEntityExtensionReferenceProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityExtensionReferencePropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntityExtension,
      referencedEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityExtensionReferencePropertyName,
          ods_ContextPrefix: '',
          ods_DeleteCascadePrimaryKey: true,
        },
      },
    });
    domainEntityExtension.data.edfiOds.ods_Properties.push(domainEntityExtensionReferenceProperty);
    domainEntityExtension.data.edfiOds.ods_IdentityProperties.push(domainEntityExtensionReferenceProperty);
    const domainEntityExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName,
      isRequired: true,
      parentEntity: domainEntityExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOds: {
          ods_Name: commonName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntityExtension.data.edfiOds.ods_Properties.push(domainEntityExtensionCommonProperty);
    addEntity(metaEd.entity, domainEntityExtension);

    metaEd.dataStandardVersion = '2.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should create a table for domain entity extension', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityExtensionName)).toBeDefined();
  });

  it('should create join table from domain entity and common', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityName + commonName)).toBeDefined();
  });
});
