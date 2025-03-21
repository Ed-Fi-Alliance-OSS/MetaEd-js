// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  addEntityForNamespace,
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newAssociation,
  newAssociationExtension,
  newAssociationProperty,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import {
  Association,
  AssociationExtension,
  AssociationProperty,
  Common,
  CommonExtension,
  CommonProperty,
  IntegerProperty,
  MetaEdEnvironment,
  Namespace,
} from '@edfi/metaed-core';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { enhance } from '../../../src/enhancer/table/AssociationExtensionTableEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../../src/model/EdFiOdsRelationalEntityRepository';
import { Table } from '../../../src/model/database/Table';

describe('when AssociationExtensionTableEnhancer enhances association extension', (): void => {
  const namespaceName = 'EdFi';
  const namespace: Namespace = { ...newNamespace(), namespaceName };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

  const documentation = 'Documentation';
  const associationExtensionName = 'AssociationExtensionName';
  const associationExtensionTableName = 'AssociationExtensionNameExtension';
  const associationExtensionPropertyName = 'AssociationExtensionPropertyName';

  beforeAll(() => {
    const associationName = 'AssociationName';
    const association: Association = Object.assign(newAssociation(), {
      namespace,
      documentation,
      metaEdName: associationName,
      data: {
        edfiOdsRelational: {
          odsTableId: associationName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    association.data.edfiOdsRelational.odsProperties.push(associationPkProperty);
    addEntityForNamespace(association);

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace: extensionNamespace,
      documentation,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsTableId: associationExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationExtensionProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionPropertyName,
      isPartOfIdentity: false,
      parentEntity: associationExtension,
      data: {
        edfiOdsRelational: {
          odsName: associationExtensionPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionProperty);
    addEntityForNamespace(associationExtension);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName)).toBeDefined();
  });

  it('should have schema equal to namespace', (): void => {
    expect((tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName) as Table).schema).toBe('extension');
  });

  it('should have description equal to documentation', (): void => {
    expect((tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName) as Table).description).toBe(
      documentation,
    );
  });

  it('should have one column', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(associationExtensionPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });

  it('should include create date column', (): void => {
    expect(
      (tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName) as Table).includeCreateDateColumn,
    ).toBe(true);
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with primary key', (): void => {
  const namespaceName = 'EdFi';
  const namespace: Namespace = { ...newNamespace(), namespaceName };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const associationExtensionName = 'AssociationExtensionName';
  const associationExtensionTableName = 'AssociationExtensionNameExtension';
  const associationExtensionPkPropertyName = 'AssociationExtensionPkPropertyName';

  beforeAll(() => {
    const associationName = 'AssociationName';
    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOdsRelational: {
          odsTableId: associationName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    association.data.edfiOdsRelational.odsProperties.push(associationPkProperty);
    addEntityForNamespace(association);

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsTableId: associationExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationExtensionPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: associationExtension,
      data: {
        edfiOdsRelational: {
          odsName: associationExtensionPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionPkProperty);
    addEntityForNamespace(associationExtension);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName)).toBeDefined();
  });

  it('should have one primary key column', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(associationExtensionPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should include create date column', (): void => {
    expect(
      (tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName) as Table).includeCreateDateColumn,
    ).toBe(true);
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with common extension override', (): void => {
  const namespaceName = 'EdFi';
  const namespace: Namespace = { ...newNamespace(), namespaceName };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName = 'CommonName';
  const commonExtensionName = 'CommonExtensionName';
  const associationName = 'AssociationName';
  const associationExtensionName = 'AssociationExtensionName';
  const associationExtensionTableName = 'AssociationExtensionNameExtension';

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

    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOdsRelational: {
          odsTableId: associationName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    association.data.edfiOdsRelational.odsProperties.push(associationPkProperty);
    addEntityForNamespace(association);

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
    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsTableId: associationExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationExtensionRequiredPropertyName = 'AssociationExtensionRequiredPropertyName';
    const associationExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: associationExtension,
      data: {
        edfiOdsRelational: {
          odsName: associationExtensionRequiredPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionRequiredProperty);
    const associationExtensionReferencePropertyName = 'AssociationExtensionReferencePropertyName';
    const associationExtensionReferenceProperty: AssociationProperty = Object.assign(newAssociationProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionReferencePropertyName,
      referencedNamespaceName: namespace.namespaceName,
      isPartOfIdentity: true,
      parentEntity: associationExtension,
      referencedEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationExtensionReferencePropertyName,
          odsContextPrefix: '',
          odsDeleteCascadePrimaryKey: true,
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionReferenceProperty);
    associationExtension.data.edfiOdsRelational.odsIdentityProperties.push(associationExtensionReferenceProperty);
    const associationExtensionCommonExtensionOverrideProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonExtensionName,
      referencedNamespaceName: extensionNamespace.namespaceName,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: commonExtension,
      isExtensionOverride: true,
      data: {
        edfiOdsRelational: {
          odsName: commonExtensionName,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionCommonExtensionOverrideProperty);
    addEntityForNamespace(associationExtension);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(2);
  });

  it('should create table for association extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName)).toBeDefined();
  });

  it('should include create date column', (): void => {
    expect(
      (tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName) as Table).includeCreateDateColumn,
    ).toBe(true);
  });

  it('should not create common extension override join table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(`${associationName + commonExtensionName}Extension`)).toBeDefined();
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with common', (): void => {
  const namespaceName = 'EdFi';
  const namespace: Namespace = { ...newNamespace(), namespaceName };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName = 'CommonName';
  const associationName = 'AssociationName';
  const associationExtensionName = 'AssociationExtensionName';
  const associationExtensionTableName = 'AssociationExtensionNameExtension';

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

    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOdsRelational: {
          odsTableId: associationName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    association.data.edfiOdsRelational.odsProperties.push(associationPkProperty);
    addEntityForNamespace(association);

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsTableId: associationExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationExtensionRequiredPropertyName = 'AssociationExtensionRequiredPropertyName';
    const associationExtensionRequiredProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionRequiredPropertyName,
      isRequired: true,
      parentEntity: associationExtension,
      data: {
        edfiOdsRelational: {
          odsName: associationExtensionRequiredPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionRequiredProperty);
    const associationExtensionReferencePropertyName = 'AssociationExtensionReferencePropertyName';
    const associationExtensionReferenceProperty: AssociationProperty = Object.assign(newAssociationProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionReferencePropertyName,
      referencedNamespaceName: namespace.namespaceName,
      isPartOfIdentity: true,
      parentEntity: associationExtension,
      referencedEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationExtensionReferencePropertyName,
          odsContextPrefix: '',
          odsDeleteCascadePrimaryKey: true,
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionReferenceProperty);
    associationExtension.data.edfiOdsRelational.odsIdentityProperties.push(associationExtensionReferenceProperty);
    const associationExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName,
      referencedNamespaceName: namespace.namespaceName,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionCommonProperty);
    addEntityForNamespace(associationExtension);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(2);
  });

  it('should create a table for association extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName)).toBeDefined();
  });

  it('should include create date column', (): void => {
    expect(
      (tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName) as Table).includeCreateDateColumn,
    ).toBe(true);
  });

  it('should create join table from association and common', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(associationName + commonName)).toBeDefined();
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with only common', (): void => {
  const namespaceName = 'EdFi';
  const namespace: Namespace = { ...newNamespace(), namespaceName };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName = 'CommonName';
  const associationName = 'AssociationName';
  const associationExtensionName = 'AssociationExtensionName';
  const associationExtensionTableName = 'AssociationExtensionNameExtension';

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

    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOdsRelational: {
          odsTableId: associationName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    association.data.edfiOdsRelational.odsProperties.push(associationPkProperty);
    addEntityForNamespace(association);

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsTableId: associationExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName,
      referencedNamespaceName: namespace.namespaceName,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionCommonProperty);
    addEntityForNamespace(associationExtension);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
  });

  it('should not create a table for association extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName)).toBeUndefined();
  });

  it('should create join table from association and common', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(associationName + commonName)).toBeDefined();
  });
});

describe('when AssociationExtensionTableEnhancer enhances association extension with only commons', (): void => {
  const namespaceName = 'EdFi';
  const namespace: Namespace = { ...newNamespace(), namespaceName };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const commonName1 = 'CommonName1';
  const commonName2 = 'CommonName2';
  const associationName = 'AssociationName';
  const associationExtensionName = 'AssociationExtensionName';
  const associationExtensionTableName = 'AssociationExtensionNameExtension';

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

    const association: Association = Object.assign(newAssociation(), {
      namespace,
      metaEdName: associationName,
      data: {
        edfiOdsRelational: {
          odsTableId: associationName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    association.data.edfiOdsRelational.odsProperties.push(associationPkProperty);
    addEntityForNamespace(association);

    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      namespace: extensionNamespace,
      metaEdName: associationExtensionName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsTableId: associationExtensionName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationExtensionCommonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName1,
      referencedNamespaceName: namespace.namespaceName,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName1,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionCommonProperty);
    const associationExtensionCommonProperty2: CommonProperty = Object.assign(newCommonProperty(), {
      namespace: extensionNamespace,
      metaEdName: commonName2,
      referencedNamespaceName: namespace.namespaceName,
      isRequired: true,
      parentEntity: associationExtension,
      referencedEntity: common,
      isExtensionOverride: false,
      data: {
        edfiOdsRelational: {
          odsName: commonName2,
          odsContextPrefix: '',
        },
      },
    });
    associationExtension.data.edfiOdsRelational.odsProperties.push(associationExtensionCommonProperty2);
    addEntityForNamespace(associationExtension);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create two tables', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(2);
  });

  it('should not create a table for association extension', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(associationExtensionTableName)).toBeUndefined();
  });

  it('should create join table from association and common', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(associationName + commonName1)).toBeDefined();
  });

  it('should create join table from association and common collection', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).get(associationName + commonName2)).toBeDefined();
  });
});
