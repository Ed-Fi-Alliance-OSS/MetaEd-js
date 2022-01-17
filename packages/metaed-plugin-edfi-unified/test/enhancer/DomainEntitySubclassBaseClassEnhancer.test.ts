import { newMetaEdEnvironment, newDomainEntity, newDomainEntitySubclass, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, DomainEntity, DomainEntitySubclass, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/DomainEntitySubclassBaseClassEnhancer';

describe('when enhancing domainEntity subclass referring to domainEntity', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: DomainEntity;
  let childEntity: DomainEntitySubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.domainEntity.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace,
    });
    namespace.entity.domainEntitySubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing domainEntity subclass referring to domainEntity subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: DomainEntitySubclass;
  let childEntity: DomainEntitySubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.domainEntitySubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace,
    });
    namespace.entity.domainEntitySubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing domainEntity subclass referring to domainEntity across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: DomainEntity;
  let childEntity: DomainEntitySubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.domainEntity.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace: extensionNamespace,
    });
    extensionNamespace.entity.domainEntitySubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing domainEntity subclass referring to domainEntity subclass across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: DomainEntitySubclass;
  let childEntity: DomainEntitySubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.domainEntitySubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace: extensionNamespace,
    });
    extensionNamespace.entity.domainEntitySubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.subclassedBy).toHaveLength(1);
    expect(parentEntity.subclassedBy[0]).toBe(childEntity);
  });
});
