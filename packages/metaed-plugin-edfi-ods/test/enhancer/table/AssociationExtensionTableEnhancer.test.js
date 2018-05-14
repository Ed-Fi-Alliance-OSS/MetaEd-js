// @flow
import {
  addEntity,
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newAssociation,
  newAssociationExtension,
  newAssociationProperty,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from 'metaed-core';
import type {
  Association,
  AssociationExtension,
  AssociationProperty,
  Common,
  CommonExtension,
  CommonProperty,
  IntegerProperty,
  MetaEdEnvironment,
  Namespace,
} from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/AssociationExtensionTableEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../../src/model/EdFiOdsEntityRepository';
import type { Table } from '../../../src/model/database/Table';

describe('when AssociationExtensionTableEnhancer enhances association extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const documentation: string = 'Documentation';
  const associationExtensionName: string = 'AssociationExtensionName';
  const associationExtensionPropertyName: string = 'AssociationExtensionPropertyName';

  beforeAll(() => {
    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      extensionEntitySuffix: '',
    });
    const associationName: string = 'AssociationName';
    const association: Association = Object.assign(newAssociation(), {
      namespace,
      documentation,
      metaEdName: associationName,
      data: {
        edfiOds: {
          ods_TableName: associationName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName: string = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationPkProperty);
    addEntity(metaEd.entity, association);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });
    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace,
      documentation,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOds: {
          ods_TableName: associationExtensionName,
          ods_ExtensionName: associationExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationExtensionProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionPropertyName,
      isPartOfIdentity: false,
      parentEntity: associationExtension,
      data: {
        edfiOds: {
          ods_Name: associationExtensionPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionProperty);
    addEntity(metaEd.entity, associationExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName)).toBeDefined();
  });

  it('should have schema equal to namespace', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName).schema).toBe(namespaceName);
  });

  it('should have description equal to documentation', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName).description).toBe(documentation);
  });

  it('should have one column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(associationExtensionPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });

  it('should include create date column', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName).includeCreateDateColumn).toBe(
      true,
    );
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with primary key', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationExtensionName: string = 'AssociationExtensionName';
  const associationExtensionPkPropertyName: string = 'AssociationExtensionPkPropertyName';

  beforeAll(() => {
    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'namespace',
      extensionEntitySuffix: '',
    });
    const associationName: string = 'AssociationName';
    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOds: {
          ods_TableName: associationName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName: string = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationPkProperty);
    addEntity(metaEd.entity, association);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });
    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOds: {
          ods_TableName: associationExtensionName,
          ods_ExtensionName: associationExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationExtensionPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: associationExtension,
      data: {
        edfiOds: {
          ods_Name: associationExtensionPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionPkProperty);
    addEntity(metaEd.entity, associationExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName)).toBeDefined();
  });

  it('should have one primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(associationExtensionPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should include create date column', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName).includeCreateDateColumn).toBe(
      true,
    );
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with common extension override', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName: string = 'CommonName';
  const commonExtensionName: string = 'CommonExtensionName';
  const associationName: string = 'AssociationName';
  const associationExtensionName: string = 'AssociationExtensionName';

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

    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOds: {
          ods_TableName: associationName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName: string = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationPkProperty);
    addEntity(metaEd.entity, association);

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

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOds: {
          ods_TableName: associationExtensionName,
          ods_ExtensionName: associationExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationExtensionRequiredPropertyName: string = 'AssociationExtensionRequiredPropertyName';
    const associationExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: associationExtension,
      data: {
        edfiOds: {
          ods_Name: associationExtensionRequiredPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionRequiredProperty);
    const associationExtensionReferencePropertyName: string = 'AssociationExtensionReferencePropertyName';
    const associationExtensionReferenceProperty: AssociationProperty = Object.assign(newAssociationProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionReferencePropertyName,
      isPartOfIdentity: true,
      parentEntity: associationExtension,
      referencedEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationExtensionReferencePropertyName,
          ods_ContextPrefix: '',
          ods_DeleteCascadePrimaryKey: true,
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionReferenceProperty);
    associationExtension.data.edfiOds.ods_IdentityProperties.push(associationExtensionReferenceProperty);
    const associationExtensionCommonExtensionOverrideProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonExtensionName,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: commonExtension,
      isExtensionOverride: true,
      data: {
        edfiOds: {
          ods_Name: commonExtensionName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionCommonExtensionOverrideProperty);
    addEntity(metaEd.entity, associationExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
  });

  it('should create table only for association extension', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName)).toBeDefined();
  });

  it('should include create date column', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName).includeCreateDateColumn).toBe(
      true,
    );
  });

  it('should not create common extension override join table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationName + commonExtensionName)).toBeUndefined();
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName: string = 'CommonName';
  const associationName: string = 'AssociationName';
  const associationExtensionName: string = 'AssociationExtensionName';

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

    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOds: {
          ods_TableName: associationName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName: string = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationPkProperty);
    addEntity(metaEd.entity, association);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOds: {
          ods_TableName: associationExtensionName,
          ods_ExtensionName: associationExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationExtensionRequiredPropertyName: string = 'AssociationExtensionRequiredPropertyName';
    const associationExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: associationExtension,
      data: {
        edfiOds: {
          ods_Name: associationExtensionRequiredPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionRequiredProperty);
    const associationExtensionReferencePropertyName: string = 'AssociationExtensionReferencePropertyName';
    const associationExtensionReferenceProperty: AssociationProperty = Object.assign(newAssociationProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionReferencePropertyName,
      isPartOfIdentity: true,
      parentEntity: associationExtension,
      referencedEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationExtensionReferencePropertyName,
          ods_ContextPrefix: '',
          ods_DeleteCascadePrimaryKey: true,
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionReferenceProperty);
    associationExtension.data.edfiOds.ods_IdentityProperties.push(associationExtensionReferenceProperty);
    const associationExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOds: {
          ods_Name: commonName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionCommonProperty);
    addEntity(metaEd.entity, associationExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should create a table for association extension', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName)).toBeDefined();
  });

  it('should include create date column', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName).includeCreateDateColumn).toBe(
      true,
    );
  });

  it('should create join table from association and common', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationName + commonName)).toBeDefined();
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with only common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName: string = 'CommonName';
  const associationName: string = 'AssociationName';
  const associationExtensionName: string = 'AssociationExtensionName';

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

    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOds: {
          ods_TableName: associationName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName: string = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationPkProperty);
    addEntity(metaEd.entity, association);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOds: {
          ods_TableName: associationExtensionName,
          ods_ExtensionName: associationExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOds: {
          ods_Name: commonName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionCommonProperty);
    addEntity(metaEd.entity, associationExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
  });

  it('should not create a table for association extension', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName)).toBeUndefined();
  });

  it('should create join table from association and common', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationName + commonName)).toBeDefined();
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with only commons', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName1: string = 'CommonName1';
  const commonName2: string = 'CommonName2';
  const associationName: string = 'AssociationName';
  const associationExtensionName: string = 'AssociationExtensionName';

  beforeAll(() => {
    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'namespace',
      extensionEntitySuffix: '',
    });

    const common: Common = Object.assign(newCommon(), {
      namespace,
      metaEdName: commonName1,
      data: {
        edfiOds: {
          ods_TableName: commonName1,
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

    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOds: {
          ods_TableName: associationName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName: string = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationPkProperty);
    addEntity(metaEd.entity, association);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'extension',
      isExtension: true,
    });

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOds: {
          ods_TableName: associationExtensionName,
          ods_ExtensionName: associationExtensionName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName1,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOds: {
          ods_Name: commonName1,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionCommonProperty);
    const associationExtensionCommonProperty2: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName2,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOds: {
          ods_Name: commonName2,
          ods_ContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOds.ods_Properties.push(associationExtensionCommonProperty2);
    addEntity(metaEd.entity, associationExtension);

    metaEd.dataStandardVersion = '3.0.0';
    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should not create a table for association extension', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationExtensionName)).toBeUndefined();
  });

  it('should create join table from association and common', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationName + commonName1)).toBeDefined();
  });

  it('should create join table from association and common collection', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationName + commonName2)).toBeDefined();
  });
});
