import { newMetaEdEnvironment, newCommon, newCommonExtension, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Common, CommonExtension, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/CommonExtensionBaseClassEnhancer';

describe('when enhancing common extension referring to common', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  let parentEntity: Common;
  let childEntity: CommonExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newCommon(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newCommonExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace,
    });
    namespace.entity.commonExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.extendedBy).toHaveLength(1);
    expect(parentEntity.extendedBy[0]).toBe(childEntity);
  });
});

describe('when enhancing common extension referring to common across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  let parentEntity: Common;
  let childEntity: CommonExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newCommon(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newCommonExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace: extensionNamespace,
    });
    extensionNamespace.entity.commonExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have correct references', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
    expect(parentEntity.extendedBy).toHaveLength(1);
    expect(parentEntity.extendedBy[0]).toBe(childEntity);
  });
});
