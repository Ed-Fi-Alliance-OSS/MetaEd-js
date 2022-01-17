import R from 'ramda';
import {
  newMetaEdEnvironment,
  newCommonProperty,
  newCommon,
  CommonSubclass,
  newCommonSubclass,
  newNamespace,
  MetaEdEnvironment,
  CommonProperty,
  Common,
  Namespace,
} from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/property/CommonReferenceEnhancer';

describe('when enhancing common property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.common.push(property);

    const parentEntity: Common = Object.assign(newCommon(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Common = Object.assign(newCommon(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.common.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.common.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing common property referring to common subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: CommonProperty = {
      ...newCommonProperty(),
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    };
    metaEd.propertyIndex.common.push(property);

    const parentEntity: Common = { ...newCommon(), metaEdName: parentEntityName, namespace, properties: [property] };
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: CommonSubclass = { ...newCommonSubclass(), metaEdName: referencedEntityName, namespace };
    namespace.entity.commonSubclass.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = metaEd.propertyIndex.common.filter((p) => p.metaEdName === referencedEntityName)[0];
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing common property referring to deprecated common', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.common.push(property);

    const parentEntity: Common = Object.assign(newCommon(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Common = Object.assign(newCommon(), {
      metaEdName: referencedEntityName,
      namespace,
      isDeprecated: true,
    });
    namespace.entity.common.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have deprecation flag set', (): void => {
    const property = R.head(metaEd.propertyIndex.common.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntityDeprecated).toBe(true);
  });
});

describe('when enhancing common property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.common.push(property);

    const parentEntity: Common = Object.assign(newCommon(), {
      metaEdName: parentEntityName,
      namespace: extensionNamespace,
      properties: [property],
    });
    extensionNamespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Common = Object.assign(newCommon(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.common.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.common.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});
