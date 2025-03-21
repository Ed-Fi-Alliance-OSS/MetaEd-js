// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newEnumeration, newEnumerationItem, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Enumeration, Namespace } from '@edfi/metaed-core';
import { EnumerationSimpleType } from '../../../src/model/schema/EnumerationSimpleType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance } from '../../../src/enhancer/schema/AddEnumerationSimpleTypesEnhancer';

describe('when enhancing enumeration', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const simpleTypeName = 'EnumerationSimpleType';
  const simpleTypeNameWithExtension = `${projectExtension}-${simpleTypeName}`;
  const documentation = 'Documentation';
  const item1Documentation = 'Item 1 Documentation';
  const item1ShortDescription = 'Item 1 Short Description';
  const item2Documentation = 'Item 2 Documentation';
  const item2ShortDescription = 'Item 2 Short Description';

  let enhancedItem: Enumeration;
  let createdSimpleType: EnumerationSimpleType;

  beforeAll(() => {
    enhancedItem = {
      ...newEnumeration(),
      metaEdName: simpleTypeName,
      documentation,
      enumerationItems: [
        { ...newEnumerationItem(), documentation: item1Documentation, shortDescription: item1ShortDescription },
        { ...newEnumerationItem(), documentation: item2Documentation, shortDescription: item2ShortDescription },
      ],
      data: {
        edfiXsd: {
          xsdEnumerationNameWithExtension: simpleTypeNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.enumeration.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdEnumerationSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdSimpleType.annotation).toBeDefined();
    expect(createdSimpleType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', (): void => {
    expect(createdSimpleType.annotation.typeGroup).toBe('Enumeration');
  });

  it('should have base type assigned', (): void => {
    expect(createdSimpleType.baseType).toBe('xs:token');
  });

  it('should have name assigned', (): void => {
    expect(createdSimpleType.name).toBe(simpleTypeNameWithExtension);
  });

  it('should have enumeration tokens', (): void => {
    expect(createdSimpleType.enumerationTokens.length).toBe(2);
  });
});
