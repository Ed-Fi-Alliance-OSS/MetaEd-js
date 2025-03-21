// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  DomainEntityExtension,
  Namespace,
  newMetaEdEnvironment,
  newDomainEntity,
  newDomainEntityExtension,
  newDomainEntitySubclass,
  newNamespace,
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newStringProperty,
} from '@edfi/metaed-core';
import { Element } from '../../../src/model/schema/Element';
import { ComplexType, NoComplexType } from '../../../src/model/schema/ComplexType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { restrictionSuffix } from '../../../src/enhancer/schema/AddComplexTypesBaseEnhancer';
import { enhance as initializeTopLevelEntities } from '../../../src/model/TopLevelEntity';
import { enhance } from '../../../src/enhancer/schema/AddDomainEntityExtensionComplexTypesEnhancer';

describe('when enhancing domainEntity extension', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const baseTypeName = 'BaseTypeName';
  const complexTypeName = 'ComplexTypeName';
  const documentation = 'Documentation';
  let enhancedItem: DomainEntityExtension;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const baseEntity = {
      ...newDomainEntity(),
      namespace,
      metaEdName: baseTypeName,
      documentation,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(baseEntity);
    namespace.entity.domainEntity.set(baseEntity.metaEdName, baseEntity);

    enhancedItem = {
      ...newDomainEntityExtension(),
      namespace,
      metaEdName: complexTypeName,
      documentation,
      baseEntity,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.domainEntityExtension.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
    createdReferenceType = enhancedItem.data.edfiXsd.xsdReferenceType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsdIdentityType;
  });

  it('should create complex type', (): void => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', (): void => {
    expect(createdComplexType.annotation.typeGroup).toBe('Domain Entity');
  });

  it('should have base type assigned', (): void => {
    expect(createdComplexType.baseType).toBe(baseTypeName);
  });

  it('should have name assigned', (): void => {
    expect(createdComplexType.name).toBe(complexTypeName);
  });

  it('should not have items', (): void => {
    expect(createdComplexType.items.length).toBe(0);
  });

  it('should create reference type', (): void => {
    expect(createdReferenceType).toBe(NoComplexType);
  });

  it('should not create identity type', (): void => {
    expect(createdIdentityType).toBe(NoComplexType);
  });
});

describe('when enhancing domainEntity extension with common type override', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const baseDomainEntityName = 'BaseDomainEntityName';
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const baseCommonTypeName = 'BaseCommonTypeName';
  const commonTypeExtensionName = 'CommonTypeExtensionName';
  const otherPropertyOnExtensionName = 'OtherPropertyOnExtensionName';
  const otherPropertyOnDomainEntityName = 'OtherPropertyOnDomainEntityName';

  const documentation = 'Documentation';
  let createdRestrictionComplexType: ComplexType;
  let createdExtensionComplexType: ComplexType;

  beforeAll(() => {
    const extensionNamespace = { ...newNamespace(), namespaceName: 'Extension', projectExtension, isExtension: true };
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

    const baseCommon = {
      ...newCommon(),
      namespace,
      metaEdName: baseCommonTypeName,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(baseCommon);
    namespace.entity.common.set(baseCommon.metaEdName, baseCommon);

    const commonExtension = {
      ...newCommonExtension(),
      metaEdName: commonTypeExtensionName,
      baseEntityName: baseCommonTypeName,
      baseEntity: baseCommon,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(commonExtension);
    namespace.entity.commonExtension.set(commonExtension.metaEdName, commonExtension);

    const baseDomainEntity = {
      ...newDomainEntity(),
      namespace,
      metaEdName: baseDomainEntityName,
      properties: [
        {
          ...newCommonProperty(),
          metaEdName: baseCommonTypeName,
          isExtensionOverride: false,
          data: {
            edfiXsd: {
              xsdName: baseCommonTypeName,
            },
          },
        },
        {
          ...newStringProperty(),
          metaEdName: otherPropertyOnDomainEntityName,
          data: {
            edfiXsd: {
              xsdName: otherPropertyOnDomainEntityName,
            },
          },
        },
      ],
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(baseDomainEntity);
    namespace.entity.domainEntity.set(baseDomainEntity.metaEdName, baseDomainEntity);

    const domainEntityExtension = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntityExtensionName,
      documentation,
      baseEntity: baseDomainEntity,
      namespace: extensionNamespace,
      properties: [
        {
          ...newCommonProperty(),
          metaEdName: baseCommonTypeName,
          isExtensionOverride: true,
          data: {
            edfiXsd: {
              xsdName: baseCommonTypeName,
            },
          },
        },
        {
          ...newStringProperty(),
          metaEdName: otherPropertyOnExtensionName,
          data: {
            edfiXsd: {
              xsdName: otherPropertyOnExtensionName,
            },
          },
        },
      ],
      data: {
        edfiXsd: {} as any,
      },
    };
    addModelBaseEdfiXsdTo(domainEntityExtension);
    namespace.entity.domainEntityExtension.set(domainEntityExtension.metaEdName, domainEntityExtension);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(domainEntityExtension.data.edfiXsd.xsdComplexTypes.length).toBe(2);
    [createdRestrictionComplexType, createdExtensionComplexType] = domainEntityExtension.data.edfiXsd.xsdComplexTypes;
  });

  it('should have annotation documentation assigned on extension complex type', (): void => {
    expect(createdExtensionComplexType.annotation).toBeDefined();
    expect(createdExtensionComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned on extension complex type', (): void => {
    expect(createdExtensionComplexType.annotation.typeGroup).toBe('Domain Entity');
  });

  it('should have base type assigned on extension complex type', (): void => {
    expect(createdExtensionComplexType.baseType).toBe(`${projectExtension}-${baseDomainEntityName}${restrictionSuffix}`);
  });

  it('should have name assigned on extension complex type', (): void => {
    expect(createdExtensionComplexType.name).toBe(`${projectExtension}-${domainEntityExtensionName}`);
  });

  it('should have items on extension complex type', (): void => {
    expect(createdExtensionComplexType.items.length).toBe(2);
    expect((createdExtensionComplexType.items[0] as Element).name).toBe(baseCommonTypeName);
    expect((createdExtensionComplexType.items[1] as Element).name).toBe(otherPropertyOnExtensionName);
  });

  it('should have annotation documentation assigned on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.annotation).toBeDefined();
    expect(createdRestrictionComplexType.annotation.documentation).toMatchSnapshot();
  });

  it('should not have annotation type group assigned on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.annotation.typeGroup).toBe('');
  });

  it('should have base type assigned on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.baseType).toBe(baseDomainEntityName);
  });

  it('should have name assigned on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.name).toBe(`${projectExtension}-${baseDomainEntityName}${restrictionSuffix}`);
  });

  it('should have items on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.items.length).toBe(1);
    expect((createdRestrictionComplexType.items[0] as Element).name).toBe(otherPropertyOnDomainEntityName);
  });
});

describe('when enhancing domainEntity extension of a domain entity subclass with common type override', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const baseDomainEntityName = 'BaseDomainEntityName';
  const basePropertyOnDomainEntityName = 'BasePropertyOnDomainEntityName';
  const domainEntityExtensionName = 'DomainEntityExtensionName';
  const baseCommonTypeName = 'BaseCommonTypeName';
  const commonTypeExtensionName = 'CommonTypeExtensionName';
  const otherPropertyOnExtensionName = 'OtherPropertyOnExtensionName';
  const otherPropertyOnDomainEntityName = 'OtherPropertyOnDomainEntityName';

  const documentation = 'Documentation';
  let createdRestrictionComplexType: ComplexType;
  let createdExtensionComplexType: ComplexType;

  beforeAll(() => {
    const extensionNamespace = { ...newNamespace(), namespaceName: 'Extension', projectExtension, isExtension: true };
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

    const baseCommon = {
      ...newCommon(),
      namespace,
      metaEdName: baseCommonTypeName,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(baseCommon);
    namespace.entity.common.set(baseCommon.metaEdName, baseCommon);

    const commonExtension = {
      ...newCommonExtension(),
      metaEdName: commonTypeExtensionName,
      baseEntityName: baseCommonTypeName,
      baseEntity: baseCommon,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(commonExtension);
    namespace.entity.commonExtension.set(commonExtension.metaEdName, commonExtension);

    const baseDomainEntity = {
      ...newDomainEntity(),
      namespace,
      metaEdName: baseDomainEntityName,
      properties: [
        {
          ...newStringProperty(),
          metaEdName: basePropertyOnDomainEntityName,
          data: {
            edfiXsd: {
              xsdName: basePropertyOnDomainEntityName,
            },
          },
        },
      ],
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(baseDomainEntity);
    namespace.entity.domainEntity.set(baseDomainEntity.metaEdName, baseDomainEntity);

    const domainEntitySubclass = {
      ...newDomainEntitySubclass(),
      namespace,
      metaEdName: domainEntitySubclassName,
      baseEntity: baseDomainEntity,
      properties: [
        {
          ...newCommonProperty(),
          metaEdName: baseCommonTypeName,
          isExtensionOverride: false,
          data: {
            edfiXsd: {
              xsdName: baseCommonTypeName,
            },
          },
        },
        {
          ...newStringProperty(),
          metaEdName: otherPropertyOnDomainEntityName,
          data: {
            edfiXsd: {
              xsdName: otherPropertyOnDomainEntityName,
            },
          },
        },
      ],
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(domainEntitySubclass);
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    const domainEntityExtension = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntityExtensionName,
      documentation,
      baseEntity: domainEntitySubclass,
      namespace: extensionNamespace,
      properties: [
        {
          ...newCommonProperty(),
          metaEdName: baseCommonTypeName,
          isExtensionOverride: true,
          data: {
            edfiXsd: {
              xsdName: baseCommonTypeName,
            },
          },
        },
        {
          ...newStringProperty(),
          metaEdName: otherPropertyOnExtensionName,
          data: {
            edfiXsd: {
              xsdName: otherPropertyOnExtensionName,
            },
          },
        },
      ],
      data: {
        edfiXsd: {} as any,
      },
    };
    addModelBaseEdfiXsdTo(domainEntityExtension);
    namespace.entity.domainEntityExtension.set(domainEntityExtension.metaEdName, domainEntityExtension);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(domainEntityExtension.data.edfiXsd.xsdComplexTypes.length).toBe(2);
    [createdRestrictionComplexType, createdExtensionComplexType] = domainEntityExtension.data.edfiXsd.xsdComplexTypes;
  });

  it('should have annotation documentation assigned on extension complex type', (): void => {
    expect(createdExtensionComplexType.annotation).toBeDefined();
    expect(createdExtensionComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned on extension complex type', (): void => {
    expect(createdExtensionComplexType.annotation.typeGroup).toBe('Domain Entity');
  });

  it('should have base type assigned on extension complex type', (): void => {
    expect(createdExtensionComplexType.baseType).toBe(`${projectExtension}-${domainEntitySubclassName}${restrictionSuffix}`);
  });

  it('should have name assigned on extension complex type', (): void => {
    expect(createdExtensionComplexType.name).toBe(`${projectExtension}-${domainEntityExtensionName}`);
  });

  it('should have items on extension complex type', (): void => {
    expect(createdExtensionComplexType.items.length).toBe(2);
    expect((createdExtensionComplexType.items[0] as Element).name).toBe(baseCommonTypeName);
    expect((createdExtensionComplexType.items[1] as Element).name).toBe(otherPropertyOnExtensionName);
  });

  it('should have annotation documentation assigned on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.annotation).toBeDefined();
    expect(createdRestrictionComplexType.annotation.documentation).toMatchSnapshot();
  });

  it('should not have annotation type group assigned on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.annotation.typeGroup).toBe('');
  });

  it('should have base type assigned on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.baseType).toBe(domainEntitySubclassName);
  });

  it('should have name assigned on restriction complex type', (): void => {
    expect(createdRestrictionComplexType.name).toBe(`${projectExtension}-${domainEntitySubclassName}${restrictionSuffix}`);
  });

  it('should have items on restriction complex type from both base and subclass', (): void => {
    expect(createdRestrictionComplexType.items.length).toBe(2);
    expect((createdRestrictionComplexType.items[0] as Element).name).toBe(basePropertyOnDomainEntityName);
    expect((createdRestrictionComplexType.items[1] as Element).name).toBe(otherPropertyOnDomainEntityName);
  });
});
