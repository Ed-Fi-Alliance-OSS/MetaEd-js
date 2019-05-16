import { newMetaEdEnvironment, newAssociation, newAssociationSubclass, newNamespace } from 'metaed-core';
import { MetaEdEnvironment, Association, AssociationSubclass, Namespace } from 'metaed-core';
import { enhance } from '../../src/enhancer/AssociationSubclassBaseClassEnhancer';

describe('when enhancing association subclass referring to association', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: Association;
  let childEntity: AssociationSubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.association.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace,
    });
    namespace.entity.associationSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing association subclass referring to association subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: AssociationSubclass;
  let childEntity: AssociationSubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.associationSubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace,
    });
    namespace.entity.associationSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing association subclass referring to association across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: Association;
  let childEntity: AssociationSubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.association.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace: extensionNamespace,
    });
    extensionNamespace.entity.associationSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing association subclass referring to association subclass across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: AssociationSubclass;
  let childEntity: AssociationSubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.associationSubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace: extensionNamespace,
    });
    extensionNamespace.entity.associationSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});
