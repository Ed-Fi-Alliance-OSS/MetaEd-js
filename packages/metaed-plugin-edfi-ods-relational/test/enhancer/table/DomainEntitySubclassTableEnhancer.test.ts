// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  addEntityForNamespace,
  newDomainEntity,
  newDomainEntitySubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { DomainEntity, DomainEntitySubclass, IntegerProperty, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { enhance } from '../../../src/enhancer/table/DomainEntitySubclassTableEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../../src/model/EdFiOdsRelationalEntityRepository';
import { Table } from '../../../src/model/database/Table';

describe('when DomainEntitySubclassTableEnhancer enhances domain entity subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const documentation = 'Documentation';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntitySubclassPropertyName = 'DomainEntitySubclassPropertyName';

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
      fullPropertyName: domainEntityPkPropertyName,
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

    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      namespace: extensionNamespace,
      documentation,
      metaEdName: domainEntitySubclassName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntitySubclassName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntitySubclassProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntitySubclassPropertyName,
      fullPropertyName: domainEntitySubclassPropertyName,
      isPartOfIdentity: false,
      parentEntity: domainEntitySubclass,
      data: {
        edfiOdsRelational: {
          odsName: domainEntitySubclassPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntitySubclass.data.edfiOdsRelational.odsProperties.push(domainEntitySubclassProperty);
    addEntityForNamespace(domainEntitySubclass);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName)).toBeDefined();
  });

  it('should have schema equal to namespace', (): void => {
    expect((tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName) as Table).schema).toBe('extension');
  });

  it('should have description equal to documentation', (): void => {
    expect((tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName) as Table).description).toBe(
      documentation,
    );
  });

  it('should have one column', (): void => {
    const table = tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(domainEntitySubclassPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
    expect(table.columns[0].propertyPath).toMatchInlineSnapshot(`"DomainEntitySubclassPropertyName"`);
  });
});

describe('when DomainEntitySubclassTableEnhancer enhances domain entity subclass with primary key', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const documentation = 'Documentation';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntitySubclassPkPropertyName = 'DomainEntitySubclassPkPropertyName';

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

    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      namespace: extensionNamespace,
      documentation,
      metaEdName: domainEntitySubclassName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntitySubclassName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntitySubclassPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntitySubclassPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntitySubclass,
      data: {
        edfiOdsRelational: {
          odsName: domainEntitySubclassPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntitySubclass.data.edfiOdsRelational.odsProperties.push(domainEntitySubclassPkProperty);
    addEntityForNamespace(domainEntitySubclass);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName)).toBeDefined();
  });

  it('should have one primary key column', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(domainEntitySubclassPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });
});

describe('when DomainEntitySubclassTableEnhancer enhances domain entity subclass with identity rename property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const documentation = 'Documentation';
  const domainEntityName = 'DomainEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntitySubclassRenamePropertyName = 'DomainEntitySubclassRenamePropertyName';

  const domainEntityPkPropertyName = 'DomainEntityPkPropertyName';
  beforeAll(() => {
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

    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      namespace: extensionNamespace,
      documentation,
      metaEdName: domainEntitySubclassName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntitySubclassName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntitySubclassRenameProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: domainEntitySubclassRenamePropertyName,
      isIdentityRename: true,
      baseKeyName: domainEntityPkPropertyName,
      parentEntity: domainEntitySubclass,
      data: {
        edfiOdsRelational: {
          odsName: domainEntitySubclassRenamePropertyName,
          odsContextPrefix: '',
        },
      },
    });
    domainEntitySubclass.data.edfiOdsRelational.odsProperties.push(domainEntitySubclassRenameProperty);
    addEntityForNamespace(domainEntitySubclass);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName)).toBeDefined();
  });

  it('should have one column', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(domainEntitySubclassRenamePropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });

  it('should create foreign key to from identity rename property to base entity property', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(domainEntitySubclassName) as Table;
    expect(table.foreignKeys).toHaveLength(1);
    expect(table.foreignKeys[0].parentTable.tableId).toBe(domainEntitySubclassName);
    expect(table.foreignKeys[0].foreignTableId).toBe(domainEntityName);
  });
});
