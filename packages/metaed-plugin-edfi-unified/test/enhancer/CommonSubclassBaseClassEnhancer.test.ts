// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newCommon, newCommonSubclass, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Common, CommonSubclass, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/CommonSubclassBaseClassEnhancer';

describe('when enhancing common subclass referring to common', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: Common;
  let childEntity: CommonSubclass;

  beforeAll(() => {
    parentEntity = { ...newCommon(), metaEdName: parentEntityName, namespace };
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    childEntity = {
      ...newCommonSubclass(),
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace,
    };
    namespace.entity.commonSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing common subclass referring to common subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: CommonSubclass;
  let childEntity: CommonSubclass;

  beforeAll(() => {
    parentEntity = { ...newCommonSubclass(), metaEdName: parentEntityName, namespace };
    namespace.entity.commonSubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = {
      ...newCommonSubclass(),
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace,
    };
    namespace.entity.commonSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing common subclass referring to common across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: Common;
  let childEntity: CommonSubclass;

  beforeAll(() => {
    parentEntity = { ...newCommon(), metaEdName: parentEntityName, namespace };
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    childEntity = {
      ...newCommonSubclass(),
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace: extensionNamespace,
    };
    extensionNamespace.entity.commonSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing common subclass referring to common subclass across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: CommonSubclass;
  let childEntity: CommonSubclass;

  beforeAll(() => {
    parentEntity = { ...newCommonSubclass(), metaEdName: parentEntityName, namespace };
    namespace.entity.commonSubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = {
      ...newCommonSubclass(),
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace: extensionNamespace,
    };
    extensionNamespace.entity.commonSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});
