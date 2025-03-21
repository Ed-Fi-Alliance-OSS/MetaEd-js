// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newDecimalProperty,
  newSharedDecimalProperty,
  newDecimalType,
  newSharedDecimal,
  newNamespace,
  NoSharedSimple,
} from '@edfi/metaed-core';

import {
  DecimalProperty,
  DecimalType,
  MetaEdEnvironment,
  SharedDecimal,
  SharedDecimalProperty,
  Namespace,
} from '@edfi/metaed-core';

import { enhance } from '../../../src/enhancer/property/DecimalReferenceEnhancer';

describe('when enhancing decimal property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: DecimalProperty;
  let referencedEntity: DecimalType;

  beforeAll(() => {
    property = Object.assign(newDecimalProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.decimal.push(property);

    referencedEntity = Object.assign(newDecimalType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.decimalType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have property with no referenced entity', (): void => {
    expect(property.referencedEntity).toBe(NoSharedSimple);
  });

  it('should have decimal type with no referring properties', (): void => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared decimal property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: SharedDecimalProperty;
  let referencedEntity: SharedDecimal;
  let decimalType: DecimalType;

  beforeAll(() => {
    property = Object.assign(newSharedDecimalProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      parentEntityName,
      namespace,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedDecimal.push(property);

    referencedEntity = Object.assign(newSharedDecimal(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.sharedDecimal.set(referencedEntity.metaEdName, referencedEntity);

    decimalType = Object.assign(newDecimalType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.decimalType.set(referencedEntity.metaEdName, decimalType);

    enhance(metaEd);
  });

  it('should have property with correct referenced entity', (): void => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });

  it('should have decimal type with correct referring properties', (): void => {
    expect(decimalType.referringSimpleProperties).toContain(property);
  });
});

describe('when enhancing shared decimal property referring to deprecated shared decimal', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: SharedDecimalProperty;
  let referencedEntity: SharedDecimal;
  let decimalType: DecimalType;

  beforeAll(() => {
    property = Object.assign(newSharedDecimalProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      parentEntityName,
      namespace,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedDecimal.push(property);

    referencedEntity = Object.assign(newSharedDecimal(), {
      metaEdName: referencedEntityName,
      namespace,
      isDeprecated: true,
    });
    namespace.entity.sharedDecimal.set(referencedEntity.metaEdName, referencedEntity);

    decimalType = Object.assign(newDecimalType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.decimalType.set(referencedEntity.metaEdName, decimalType);

    enhance(metaEd);
  });

  it('should have deprecation flag set', (): void => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(property.referencedEntityDeprecated).toBe(true);
  });
});

describe('when enhancing decimal property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: DecimalProperty;
  let referencedEntity: DecimalType;

  beforeAll(() => {
    property = Object.assign(newDecimalProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.decimal.push(property);

    referencedEntity = Object.assign(newDecimalType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.decimalType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have property with no referenced entity', (): void => {
    expect(property.referencedEntity).toBe(NoSharedSimple);
  });

  it('should have decimal type with no referring properties', (): void => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared decimal property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let property: SharedDecimalProperty;
  let referencedEntity: SharedDecimal;
  let decimalType: DecimalType;

  beforeAll(() => {
    property = Object.assign(newSharedDecimalProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      parentEntityName,
      namespace: extensionNamespace,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedDecimal.push(property);

    referencedEntity = Object.assign(newSharedDecimal(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.sharedDecimal.set(referencedEntity.metaEdName, referencedEntity);

    decimalType = Object.assign(newDecimalType(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.decimalType.set(referencedEntity.metaEdName, decimalType);

    enhance(metaEd);
  });

  it('should have property with correct referenced entity', (): void => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });

  it('should have decimal type with correct referring properties', (): void => {
    expect(decimalType.referringSimpleProperties).toContain(property);
  });
});
