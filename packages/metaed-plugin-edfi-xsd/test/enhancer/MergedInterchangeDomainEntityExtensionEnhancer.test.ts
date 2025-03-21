// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newInterchangeItem,
  newNamespace,
  newDomainEntity,
  newDomainEntityExtension,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, DomainEntity, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeExtensionEnhancer';
import { edfiXsdRepositoryForNamespace } from '../../src/enhancer/EnhancerHelper';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when enhances MergedInterchange with domainEntity extension', (): void => {
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

  const domainEntity1Name = 'DomainEntity1';
  const domainEntity1Documentation = 'DomainEntity1Documentation';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation = 'InterchangeUseCaseDocumentation';
  const interchangeItemDomainEntity1Documentation = 'InterchangeItemDomainEntity1Documentation';

  let domainEntityExtension;

  beforeAll(() => {
    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntity1Name,
      documentation: domainEntity1Documentation,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    domainEntityExtension = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntity1Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.domainEntityExtension.set(domainEntityExtension.metaEdName, domainEntityExtension);

    const coreMergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespace,
      elements: [
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          data: {
            edfiXsd: {},
          },
        },
      ],
    };

    addMergedInterchangeToRepository(metaEd, coreMergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should create additional extension interchange', (): void => {
    const expectedExtensionInterchangeName = `EXTENSION-${interchangeName}`;
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(
      metaEd,
      extensionNamespace,
    );
    if (edFiXsdEntityRepository == null) throw new Error();

    const mergedInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(expectedExtensionInterchangeName);

    expect(mergedInterchange).toBeDefined();
    expect(mergedInterchange.namespace.isExtension).toBe(true);
    expect(mergedInterchange.metaEdName).toBe(interchangeName);
    expect(mergedInterchange.documentation).toBe(interchangeDocumentation);
    expect(mergedInterchange.extendedDocumentation).toBe(interchangeExtendedDocumentation);
    expect(mergedInterchange.useCaseDocumentation).toBe(interchangeUseCaseDocumentation);
    expect(mergedInterchange.elements.length).toBe(1);

    expect(mergedInterchange.elements[0].metaEdName).toBe(domainEntity1Name);
    expect(mergedInterchange.elements[0].documentation).toBe(interchangeItemDomainEntity1Documentation);
    expect(mergedInterchange.elements[0].referencedEntity).toBe(domainEntityExtension);
    expect(mergedInterchange.elements[0].namespace.namespaceName).toBe('Extension');
  });
});

describe('when enhances existing MergedInterchange with domainEntity extension', (): void => {
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

  const domainEntity1Name = 'DomainEntity1';
  const domainEntity1Documentation = 'DomainEntity1Documentation';
  const domainEntity2Name = 'DomainEntity2';
  const domainEntity2Documentation = 'DomainEntity2Documentation';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation = 'InterchangeUseCaseDocumentation';
  const interchangeItemDomainEntity1Documentation = 'InterchangeItemDomainEntity1Documentation';
  const interchangeItemDomainEntity2Documentation = 'InterchangeItemDomainEntity2Documentation';

  let domainEntityExtension;

  beforeAll(() => {
    const domainEntity1: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntity1Name,
      documentation: domainEntity1Documentation,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity1.metaEdName, domainEntity1);

    const domainEntity2: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntity2Name,
      documentation: domainEntity2Documentation,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity2.metaEdName, domainEntity2);

    domainEntityExtension = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntity1Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.domainEntityExtension.set(domainEntityExtension.metaEdName, domainEntityExtension);

    const coreMergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespace,
      elements: [
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          referencedEntity: domainEntity1,
          data: {
            edfiXsd: {},
          },
        },
      ],
    };

    addMergedInterchangeToRepository(metaEd, coreMergedInterchange);

    const extensionMergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespace: extensionNamespace,
      elements: [
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          referencedEntity: domainEntity1,
          data: {
            edfiXsd: {},
          },
        },
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity2Name,
          documentation: interchangeItemDomainEntity2Documentation,
          referencedEntity: domainEntity2,
          data: {
            edfiXsd: {},
          },
        },
      ],
    };

    addMergedInterchangeToRepository(metaEd, extensionMergedInterchange);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should not create additional extension interchange', (): void => {
    const coreRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (coreRepository == null) throw new Error();
    expect(coreRepository.mergedInterchange.size).toBe(1);

    const extensionRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, extensionNamespace);
    if (extensionRepository == null) throw new Error();
    expect(extensionRepository.mergedInterchange.size).toBe(1);
  });

  it('should add extension interchange item to existing interchange', (): void => {
    const expectedExtensionInterchangeName = `EXTENSION-${interchangeName}`;
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(
      metaEd,
      extensionNamespace,
    );
    if (edFiXsdEntityRepository == null) throw new Error();
    const extensionInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(expectedExtensionInterchangeName);

    expect(extensionInterchange).toBeDefined();
    expect(extensionInterchange.namespace.isExtension).toBe(true);
    expect(extensionInterchange.metaEdName).toBe(interchangeName);
    expect(extensionInterchange.elements.length).toBe(2);

    const extensionInterchangeElement1 = extensionInterchange.elements.find((e) => e.metaEdName === domainEntity2Name);
    expect(extensionInterchangeElement1.metaEdName).toBe(domainEntity2Name);
    expect(extensionInterchangeElement1.documentation).toBe(interchangeItemDomainEntity2Documentation);
    const extensionInterchangeElement2 = extensionInterchange.elements.find((e) => e.metaEdName === domainEntity1Name);
    expect(extensionInterchangeElement2.metaEdName).toBe(domainEntity1Name);
    expect(extensionInterchangeElement2.referencedEntity).toBe(domainEntityExtension);
    expect(extensionInterchangeElement2.namespace.namespaceName).toBe('Extension');
  });
});

describe('when enhances MergedInterchange with multiple domainEntity extension', (): void => {
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

  const domainEntity1Name = 'DomainEntity1';
  const domainEntity1Documentation = 'DomainEntity1Documentation';
  const domainEntity2Name = 'DomainEntity2';
  const domainEntity2Documentation = 'DomainEntity2Documentation';
  const domainEntity3Name = 'DomainEntity3';
  const domainEntity3Documentation = 'DomainEntity3Documentation';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation = 'InterchangeUseCaseDocumentation';
  const interchangeItemDomainEntity1Documentation = 'InterchangeItemDomainEntity1Documentation';
  const interchangeItemDomainEntity2Documentation = 'InterchangeItemDomainEntity2Documentation';
  const interchangeItemDomainEntity3Documentation = 'InterchangeItemDomainEntity3Documentation';

  let domainEntityExtension1;
  let domainEntityExtension2;
  let domainEntity3;

  beforeAll(() => {
    const domainEntity1: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntity1Name,
      documentation: domainEntity1Documentation,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity1.metaEdName, domainEntity1);

    const domainEntity2: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntity2Name,
      documentation: domainEntity2Documentation,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity2.metaEdName, domainEntity2);

    domainEntity3 = {
      ...newDomainEntity(),
      metaEdName: domainEntity3Name,
      documentation: domainEntity3Documentation,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity3.metaEdName, domainEntity3);

    domainEntityExtension1 = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntity1Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.domainEntityExtension.set(domainEntityExtension1.metaEdName, domainEntityExtension1);

    domainEntityExtension2 = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntity2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.domainEntityExtension.set(domainEntityExtension2.metaEdName, domainEntityExtension2);

    const coreMergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespace,
      elements: [
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          referencedEntity: domainEntity1,
          namespace: extensionNamespace,
          data: {
            edfiXsd: {},
          },
        },
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity2Name,
          documentation: interchangeItemDomainEntity2Documentation,
          referencedEntity: domainEntity2,
          namespace: extensionNamespace,
          data: {
            edfiXsd: {},
          },
        },
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity3Name,
          documentation: interchangeItemDomainEntity3Documentation,
          referencedEntity: domainEntity3,
          namespace,
          data: {
            edfiXsd: {},
          },
        },
      ],
    };

    addMergedInterchangeToRepository(metaEd, coreMergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should create additional extension interchange', (): void => {
    const expectedExtensionInterchangeName = `EXTENSION-${interchangeName}`;
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(
      metaEd,
      extensionNamespace,
    );
    if (edFiXsdEntityRepository == null) throw new Error();
    const extensionInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(expectedExtensionInterchangeName);

    expect(extensionInterchange).toBeDefined();
    expect(extensionInterchange.namespace.isExtension).toBe(true);
    expect(extensionInterchange.metaEdName).toBe(interchangeName);
    expect(extensionInterchange.documentation).toBe(interchangeDocumentation);
    expect(extensionInterchange.extendedDocumentation).toBe(interchangeExtendedDocumentation);
    expect(extensionInterchange.useCaseDocumentation).toBe(interchangeUseCaseDocumentation);
    expect(extensionInterchange.elements.length).toBe(3);

    const extensionInterchangeElement1 = extensionInterchange.elements.find((x) => x.metaEdName === domainEntity2Name);
    expect(extensionInterchangeElement1.metaEdName).toBe(domainEntity2Name);
    expect(extensionInterchangeElement1.documentation).toBe(interchangeItemDomainEntity2Documentation);
    expect(extensionInterchangeElement1.referencedEntity).toBe(domainEntityExtension2);
    expect(extensionInterchangeElement1.namespace.namespaceName).toBe('Extension');

    const extensionInterchangeElement2 = extensionInterchange.elements.find((x) => x.metaEdName === domainEntity1Name);
    expect(extensionInterchangeElement2.metaEdName).toBe(domainEntity1Name);
    expect(extensionInterchangeElement2.documentation).toBe(interchangeItemDomainEntity1Documentation);
    expect(extensionInterchangeElement2.referencedEntity).toBe(domainEntityExtension1);
    expect(extensionInterchangeElement2.namespace.namespaceName).toBe('Extension');

    const extensionInterchangeElement3 = extensionInterchange.elements.find((x) => x.metaEdName === domainEntity3Name);
    expect(extensionInterchangeElement3.metaEdName).toBe(domainEntity3Name);
    expect(extensionInterchangeElement3.documentation).toBe(interchangeItemDomainEntity3Documentation);
    expect(extensionInterchangeElement3.referencedEntity).toBe(domainEntity3);
    expect(extensionInterchangeElement3.namespace.namespaceName).toBe('EdFi');
  });
});

describe('when enhances MergedInterchange in extension namespace with multiple domainEntity', (): void => {
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

  const domainEntity1Name = 'DomainEntity1';
  const domainEntity1Documentation = 'DomainEntity1Documentation';
  const domainEntity2Name = 'DomainEntity2';
  const domainEntity2Documentation = 'DomainEntity2Documentation';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation = 'InterchangeUseCaseDocumentation';
  const interchangeItemDomainEntity1Documentation = 'InterchangeItemDomainEntity1Documentation';
  const interchangeItemDomainEntity2Documentation = 'InterchangeItemDomainEntity2Documentation';

  let domainEntity1;
  let domainEntity2;
  let domainEntityExtension1;

  beforeAll(() => {
    domainEntity1 = {
      ...newDomainEntity(),
      metaEdName: domainEntity1Name,
      documentation: domainEntity1Documentation,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity1.metaEdName, domainEntity1);

    domainEntity2 = {
      ...newDomainEntity(),
      metaEdName: domainEntity2Name,
      documentation: domainEntity2Documentation,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.domainEntity.set(domainEntity2.metaEdName, domainEntity2);

    domainEntityExtension1 = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntity1Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.domainEntityExtension.set(domainEntityExtension1.metaEdName, domainEntityExtension1);

    const extensionMergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespace: extensionNamespace,
      elements: [
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          referencedEntity: domainEntity1,
          namespace: extensionNamespace,
          data: {
            edfiXsd: {},
          },
        },
        {
          ...newInterchangeItem(),
          metaEdName: domainEntity2Name,
          documentation: interchangeItemDomainEntity2Documentation,
          referencedEntity: domainEntity2,
          namespace: extensionNamespace,
          data: {
            edfiXsd: {},
          },
        },
      ],
    };

    addMergedInterchangeToRepository(metaEd, extensionMergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should create interchange with correct elements', (): void => {
    const expectedExtensionInterchangeName = `EXTENSION-${interchangeName}`;
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(
      metaEd,
      extensionNamespace,
    );
    if (edFiXsdEntityRepository == null) throw new Error();
    const interchange: any = edFiXsdEntityRepository.mergedInterchange.get(expectedExtensionInterchangeName);

    expect(interchange).toBeDefined();
    expect(interchange.namespace.isExtension).toBe(true);
    expect(interchange.metaEdName).toBe(interchangeName);
    expect(interchange.documentation).toBe(interchangeDocumentation);
    expect(interchange.extendedDocumentation).toBe(interchangeExtendedDocumentation);
    expect(interchange.useCaseDocumentation).toBe(interchangeUseCaseDocumentation);
    expect(interchange.elements.length).toBe(2);

    const interchangeElement1 = interchange.elements.find((x) => x.metaEdName === domainEntity1Name);
    expect(interchangeElement1.metaEdName).toBe(domainEntity1Name);
    expect(interchangeElement1.documentation).toBe(interchangeItemDomainEntity1Documentation);
    expect(interchangeElement1.referencedEntity).toBe(domainEntityExtension1);
    expect(interchangeElement1.namespace.namespaceName).toBe('Extension');

    const interchangeElement2 = interchange.elements.find((x) => x.metaEdName === domainEntity2Name);
    expect(interchangeElement2.metaEdName).toBe(domainEntity2Name);
    expect(interchangeElement2.documentation).toBe(interchangeItemDomainEntity2Documentation);
    expect(interchangeElement2.referencedEntity).toBe(domainEntity2);
    expect(interchangeElement2.namespace.namespaceName).toBe('Extension');
  });
});
