// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newInterchangeItem,
  newInterchange,
  newDomainEntity,
  newInterchangeExtension,
  newNamespace,
} from '@edfi/metaed-core';
import {
  MetaEdEnvironment,
  InterchangeItem,
  Interchange,
  DomainEntity,
  InterchangeExtension,
  Namespace,
} from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/InterchangeItemEnhancer';
import { edfiXsdRepositoryForNamespace } from '../../src/enhancer/EnhancerHelper';
import { newMergedInterchange } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when InterchangeItemEnhancer enhances element', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);

  const interchangeName = 'InterchangeName';
  const elementBaseName = 'InterchangeElement';
  const referenceElementName = 'ReferencedElement';

  const referencedEntity: DomainEntity = {
    ...newDomainEntity(),
    metaEdName: referenceElementName,
    namespace,
    data: {
      edfiXsd: {},
    },
  };
  namespace.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

  const element: InterchangeItem = {
    ...newInterchangeItem(),
    metaEdName: elementBaseName,
    namespace,
    referencedEntity,
    data: {
      edfiXsd: {},
    },
  };

  beforeAll(() => {
    const interchange: Interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      elements: [element],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    const mergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      namespace,
      repositoryId: interchangeName,
      elements: [element],
    };
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) throw new Error();
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsdName assigned', (): void => {
    expect(element.data.edfiXsd.xsdName).toBe(elementBaseName);
  });

  it('should have xsdType value assigned', (): void => {
    expect(element.data.edfiXsd.xsdType).toBe(referenceElementName);
  });
});

describe('when InterchangeItemEnhancer enhances identity template', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  const interchangeName = 'InterchangeName';
  const identityTemplateName = 'InterchangeElement';
  const referenceElementName = 'ReferencedElement';

  const referencedEntity: DomainEntity = {
    ...newDomainEntity(),
    metaEdName: referenceElementName,
    namespace,
    data: {
      edfiXsd: {},
    },
  };
  namespace.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

  const identityTemplate: InterchangeItem = {
    ...newInterchangeItem(),
    metaEdName: identityTemplateName,
    referencedEntity,
    data: {
      edfiXsd: {},
    },
  };

  beforeAll(() => {
    const interchange: Interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      identityTemplates: [identityTemplate],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    const mergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      identityTemplates: [identityTemplate],
    };
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) throw new Error();
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsdName assigned', (): void => {
    expect(identityTemplate.data.edfiXsd.xsdName).toBe(`${identityTemplateName}Reference`);
  });

  it('should have xsdType value assigned', (): void => {
    expect(identityTemplate.data.edfiXsd.xsdType).toBe(`${referenceElementName}ReferenceType`);
  });
});

describe('when InterchangeItemEnhancer enhances element on extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  const interchangeName = 'InterchangeName';
  const elementBaseName = 'InterchangeElement';
  const extensionElementBaseName = 'ExtensionInterchangeElement';
  const referenceElementName = 'ReferencedElement';
  const referenceExtensionElementName = 'ReferencedExtensionElement';

  const referencedEntity: DomainEntity = {
    ...newDomainEntity(),
    metaEdName: referenceElementName,
    namespace,
    data: {
      edfiXsd: {},
    },
  };
  namespace.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

  const element: InterchangeItem = {
    ...newInterchangeItem(),
    metaEdName: elementBaseName,
    referencedEntity,
    data: {
      edfiXsd: {},
    },
  };

  const referencedExtensionEntity: DomainEntity = {
    ...newDomainEntity(),
    metaEdName: referenceExtensionElementName,
    namespace,
    data: {
      edfiXsd: {},
    },
  };
  namespace.entity.domainEntity.set(referencedExtensionEntity.metaEdName, referencedExtensionEntity);

  const extensionElement: InterchangeItem = {
    ...newInterchangeItem(),
    metaEdName: extensionElementBaseName,
    referencedEntity: referencedExtensionEntity,
    data: {
      edfiXsd: {},
    },
  };

  beforeAll(() => {
    const interchange: Interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      elements: [element],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    const interchangeExtension: InterchangeExtension = {
      ...newInterchangeExtension(),
      metaEdName: interchangeName,
      namespace,
      elements: [extensionElement],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.interchangeExtension.set(interchangeExtension.metaEdName, interchangeExtension);

    const mergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      elements: [element, extensionElement],
    };
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) throw new Error();
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsdName assigned', (): void => {
    expect(extensionElement.data.edfiXsd.xsdName).toBe(extensionElementBaseName);
  });

  it('should have xsdType value assigned', (): void => {
    expect(extensionElement.data.edfiXsd.xsdType).toBe(referenceExtensionElementName);
  });
});

describe('when InterchangeItemEnhancer enhances identity template on extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  const interchangeName = 'InterchangeName';
  const elementBaseName = 'InterchangeElement';
  const extensionElementBaseName = 'ExtensionInterchangeElement';
  const referenceElementName = 'ReferencedElement';
  const referenceExtensionElementName = 'ReferencedExtensionElement';

  const referencedEntity: DomainEntity = {
    ...newDomainEntity(),
    metaEdName: referenceElementName,
    namespace,
    data: {
      edfiXsd: {},
    },
  };
  namespace.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

  const element: InterchangeItem = {
    ...newInterchangeItem(),
    metaEdName: elementBaseName,
    referencedEntity,
    data: {
      edfiXsd: {},
    },
  };

  const referencedExtensionEntity: DomainEntity = {
    ...newDomainEntity(),
    metaEdName: referenceExtensionElementName,
    namespace,
    data: {
      edfiXsd: {},
    },
  };
  namespace.entity.domainEntity.set(referencedExtensionEntity.metaEdName, referencedExtensionEntity);

  const extensionElement: InterchangeItem = {
    ...newInterchangeItem(),
    metaEdName: extensionElementBaseName,
    referencedEntity: referencedExtensionEntity,
    data: {
      edfiXsd: {},
    },
  };

  beforeAll(() => {
    const interchange: Interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      identityTemplates: [element],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    const interchangeExtension: InterchangeExtension = {
      ...newInterchangeExtension(),
      metaEdName: interchangeName,
      namespace,
      identityTemplates: [extensionElement],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.interchangeExtension.set(interchangeExtension.metaEdName, interchangeExtension);

    const mergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      identityTemplates: [element, extensionElement],
    };
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) throw new Error();
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsdName assigned', (): void => {
    expect(extensionElement.data.edfiXsd.xsdName).toBe(`${extensionElementBaseName}Reference`);
  });

  it('should have xsdType value assigned', (): void => {
    expect(extensionElement.data.edfiXsd.xsdType).toBe(`${referenceExtensionElementName}ReferenceType`);
  });
});
