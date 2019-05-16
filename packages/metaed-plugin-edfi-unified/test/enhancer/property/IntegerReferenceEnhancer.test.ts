import {
  newMetaEdEnvironment,
  newIntegerProperty,
  newSharedIntegerProperty,
  newIntegerType,
  newSharedInteger,
  newNamespace,
  NoSharedSimple,
} from 'metaed-core';

import {
  IntegerProperty,
  IntegerType,
  MetaEdEnvironment,
  SharedInteger,
  SharedIntegerProperty,
  Namespace,
} from 'metaed-core';

import { enhance } from '../../../src/enhancer/property/IntegerReferenceEnhancer';

describe('when enhancing integer property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: IntegerProperty;
  let referencedEntity: IntegerType;

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.integer.push(property);

    referencedEntity = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.integerType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have property with no referenced entity', (): void => {
    expect(property.referencedEntity).toBe(NoSharedSimple);
  });

  it('should have integer type with no referring properties', (): void => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared integer property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: SharedIntegerProperty;
  let referencedEntity: SharedInteger;
  let integerType: IntegerType;

  beforeAll(() => {
    property = Object.assign(newSharedIntegerProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      parentEntityName,
      namespace,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedInteger.push(property);

    referencedEntity = Object.assign(newSharedInteger(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.sharedInteger.set(referencedEntity.metaEdName, referencedEntity);

    integerType = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.integerType.set(referencedEntity.metaEdName, integerType);

    enhance(metaEd);
  });

  it('should have property with correct referenced entity', (): void => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });

  it('should have integer type with correct referring properties', (): void => {
    expect(integerType.referringSimpleProperties).toContain(property);
  });
});

describe('when enhancing integer property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: IntegerProperty;
  let referencedEntity: IntegerType;

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.integer.push(property);

    referencedEntity = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.integerType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have property with no referenced entity', (): void => {
    expect(property.referencedEntity).toBe(NoSharedSimple);
  });

  it('should have integer type with no referring properties', (): void => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared integer property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: SharedIntegerProperty;
  let referencedEntity: SharedInteger;
  let integerType: IntegerType;

  beforeAll(() => {
    property = Object.assign(newSharedIntegerProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      parentEntityName,
      namespace: extensionNamespace,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedInteger.push(property);

    referencedEntity = Object.assign(newSharedInteger(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.sharedInteger.set(referencedEntity.metaEdName, referencedEntity);

    integerType = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.integerType.set(referencedEntity.metaEdName, integerType);

    enhance(metaEd);
  });

  it('should have property with correct referenced entity', (): void => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });

  it('should have integer type with correct referring properties', (): void => {
    expect(integerType.referringSimpleProperties).toContain(property);
  });
});
