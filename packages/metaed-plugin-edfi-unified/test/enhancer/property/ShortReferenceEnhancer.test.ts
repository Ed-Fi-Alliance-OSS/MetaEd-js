import {
  newMetaEdEnvironment,
  newShortProperty,
  newSharedShortProperty,
  newIntegerType,
  newSharedInteger,
  newNamespace,
  NoSharedSimple,
} from '@edfi/metaed-core';

import {
  IntegerType,
  MetaEdEnvironment,
  SharedInteger,
  SharedShortProperty,
  ShortProperty,
  Namespace,
} from '@edfi/metaed-core';

import { enhance } from '../../../src/enhancer/property/ShortReferenceEnhancer';

describe('when enhancing short property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: ShortProperty;
  let referencedEntity: IntegerType;

  beforeAll(() => {
    property = Object.assign(newShortProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.short.push(property);

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

  it('should have short type with no referring properties', (): void => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared short property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: SharedShortProperty;
  let referencedEntity: SharedInteger;
  let integerType: IntegerType;

  beforeAll(() => {
    property = Object.assign(newSharedShortProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      parentEntityName,
      namespace,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedShort.push(property);

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

  it('should have short type with correct referring properties', (): void => {
    expect(integerType.referringSimpleProperties).toContain(property);
  });
});

describe('when enhancing property referring to deprecated shared short', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: SharedShortProperty;
  let referencedEntity: SharedInteger;
  let integerType: IntegerType;

  beforeAll(() => {
    property = Object.assign(newSharedShortProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      parentEntityName,
      namespace,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedShort.push(property);

    referencedEntity = Object.assign(newSharedInteger(), {
      metaEdName: referencedEntityName,
      namespace,
      isDeprecated: true,
    });
    namespace.entity.sharedInteger.set(referencedEntity.metaEdName, referencedEntity);

    integerType = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.integerType.set(referencedEntity.metaEdName, integerType);

    enhance(metaEd);
  });

  it('should have deprecation flag set', (): void => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(property.referencedEntityDeprecated).toBe(true);
  });
});

describe('when enhancing short property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: ShortProperty;
  let referencedEntity: IntegerType;

  beforeAll(() => {
    property = Object.assign(newShortProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.short.push(property);

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

  it('should have short type with no referring properties', (): void => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared short property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: SharedShortProperty;
  let referencedEntity: SharedInteger;
  let integerType: IntegerType;

  beforeAll(() => {
    property = Object.assign(newSharedShortProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      parentEntityName,
      namespace: extensionNamespace,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedShort.push(property);

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

  it('should have short type with correct referring properties', (): void => {
    expect(integerType.referringSimpleProperties).toContain(property);
  });
});
