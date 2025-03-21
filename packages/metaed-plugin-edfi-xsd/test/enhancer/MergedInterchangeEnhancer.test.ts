// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newInterchange,
  newInterchangeItem,
  newNamespace,
  newInterchangeExtension,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, InterchangeItem, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeEnhancer';
import { edfiXsdRepositoryForNamespace } from '../../src/enhancer/EnhancerHelper';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when running with no interchange extensions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation = 'InterchangeExtendedDocumentation';
  const interchangeUseCase = 'InterchangeUseCase';
  const elementBaseName = 'InterchangeElement';
  const elementBaseType = 'InterchangeElementType';

  beforeAll(() => {
    const element: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: elementBaseName,
      data: {
        edfiXsd: {
          xsdType: elementBaseType,
        },
      },
    };

    const interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCase,
      elements: [element],
      data: {
        edfiXsd: {},
      },
    };

    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should be core merged interchange', (): void => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) throw new Error();
    const mergedInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(interchangeName);

    expect(mergedInterchange).toBeDefined();
    expect(mergedInterchange.namespace.isExtension).toBe(false);
    expect(mergedInterchange.elements.length).toBe(1);
    expect(mergedInterchange.documentation).toBe(interchangeDocumentation);
    expect(mergedInterchange.extendedDocumentation).toBe(interchangeExtendedDocumentation);
    expect(mergedInterchange.useCaseDocumentation).toBe(interchangeUseCase);
  });
});

describe('when running with interchange extensions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);

  const interchangeToBeExtendedName = 'InterchangeToBeExtendedName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const elementNoExtensionBaseName = 'InterchangeElement';
  const elementNoExtensionBaseType = 'InterchangeElementType';
  const elementBaseType = 'ElementType';
  const extensionElementBaseName = 'InterchangeExtensionElement';
  const extensionElementBaseType = 'InterchangeExtensionElementType';

  beforeAll(() => {
    const elementNoExtension: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: elementNoExtensionBaseName,
      data: {
        edfiXsd: {
          xsdType: elementNoExtensionBaseType,
        },
      },
    };

    const element: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: extensionElementBaseName,
      data: {
        edfiXsd: {
          xsdType: elementBaseType,
        },
      },
    };

    const extensionElement: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: extensionElementBaseName,
      data: {
        edfiXsd: {
          xsdType: extensionElementBaseType,
        },
      },
    };

    const interchangeToBeExtended = {
      ...newInterchange(),
      metaEdName: interchangeToBeExtendedName,
      namespace,
      documentation: interchangeDocumentation,
      elements: [element, elementNoExtension],
      data: {
        edfiXsd: {},
      },
    };

    namespace.entity.interchange.set(interchangeToBeExtended.metaEdName, interchangeToBeExtended);

    const interchangeExtension = {
      ...newInterchangeExtension(),
      metaEdName: interchangeToBeExtendedName,
      namespace: extensionNamespace,
      baseEntity: interchangeToBeExtended,
      documentation: interchangeDocumentation,
      elements: [extensionElement],
      data: {
        edfiXsd: {},
      },
    };

    extensionNamespace.entity.interchangeExtension.set(interchangeExtension.metaEdName, interchangeExtension);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have core merged interchange', (): void => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) throw new Error();
    const mergedInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(interchangeToBeExtendedName);

    expect(mergedInterchange).toBeDefined();
    expect(mergedInterchange.namespace.isExtension).toBe(false);
    expect(mergedInterchange.elements.length).toBe(2);
    expect(mergedInterchange.documentation).toBe(interchangeDocumentation);
    expect(mergedInterchange.elements[0].metaEdName).toBe(extensionElementBaseName);
    expect(mergedInterchange.elements[0].data.edfiXsd.xsdType).toBe(elementBaseType);
    expect(mergedInterchange.elements[1].metaEdName).toBe(elementNoExtensionBaseName);
    expect(mergedInterchange.elements[1].data.edfiXsd.xsdType).toBe(elementNoExtensionBaseType);
  });
});
