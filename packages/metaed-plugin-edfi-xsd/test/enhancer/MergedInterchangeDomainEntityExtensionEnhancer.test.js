// @flow
import {
  newMetaEdEnvironment,
  newInterchangeItem,
  newNamespaceInfo,
  newPluginEnvironment,
  newDomainEntity,
  newDomainEntityExtension,
  newInterchange,
} from 'metaed-core';
import type { MetaEdEnvironment, DomainEntity, Interchange } from 'metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeExtensionEnhancer';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { newEdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';
import type { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when enhances MergedInterchange with no extension', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const namespaceName: string = 'edfi';
  const extensionNamespaceName: string = 'extensionNamespace';
  const projectExtension: string = 'EXTENSION';

  const domainEntity1Name: string = 'DomainEntity1';

  const interchangeName: string = 'InterchangeName';

  beforeAll(() => {
    const coreNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      isExtension: false,
    });

    const extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespaceName,
      projectExtension,
      isExtension: true,
    });

    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    const interchange: Interchange = Object.assign(newInterchange(), {
      metaEdName: interchangeName,
      namespaceInfo: coreNamespaceInfo,
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity1Name,
          data: {
            edfiXsd: {},
          },
        }),
      ],
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.interchange.set(interchange.metaEdName, interchange);

    const mergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      namespaceInfo: coreNamespaceInfo,
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity1Name,
          data: {
            edfiXsd: {},
          },
        }),
      ],
    });

    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should create additional extension interchange', () => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    expect(edFiXsdEntityRepository.mergedInterchange.size).toBe(1);
  });
});

describe('when enhances MergedInterchange with domainEntity extension', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const namespaceName: string = 'edfi';
  const extensionNamespaceName: string = 'extensionNamespace';
  const projectExtension: string = 'EXTENSION';

  const domainEntity1Name: string = 'DomainEntity1';
  const domainEntity1Documentation: string = 'DomainEntity1Documentation';

  const interchangeName: string = 'InterchangeName';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation: string = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation: string = 'InterchangeUseCaseDocumentation';
  const interchangeItemDomainEntity1Documentation: string = 'InterchangeItemDomainEntity1Documentation';

  let domainEntityExtension;

  beforeAll(() => {
    const coreNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      isExtension: false,
    });

    const extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespaceName,
      projectExtension,
      isExtension: true,
    });

    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity1Name,
      documentation: domainEntity1Documentation,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    domainEntityExtension = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntity1Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntityExtension.set(domainEntityExtension.metaEdName, domainEntityExtension);

    const coreMergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespaceInfo: coreNamespaceInfo,
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          data: {
            edfiXsd: {},
          },
        }),
      ],
    });

    addMergedInterchangeToRepository(metaEd, coreMergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should create additional extension interchange', () => {
    const expectedExtensionInterchangeName = `${projectExtension}-${interchangeName}`;
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    const mergedInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(expectedExtensionInterchangeName);

    expect(mergedInterchange).toBeDefined();
    expect(mergedInterchange.namespaceInfo.isExtension).toBe(true);
    expect(mergedInterchange.metaEdName).toBe(interchangeName);
    expect(mergedInterchange.documentation).toBe(interchangeDocumentation);
    expect(mergedInterchange.extendedDocumentation).toBe(interchangeExtendedDocumentation);
    expect(mergedInterchange.useCaseDocumentation).toBe(interchangeUseCaseDocumentation);
    expect(mergedInterchange.elements.length).toBe(1);

    expect(mergedInterchange.elements[0].metaEdName).toBe(domainEntity1Name);
    expect(mergedInterchange.elements[0].documentation).toBe(interchangeItemDomainEntity1Documentation);
    expect(mergedInterchange.elements[0].referencedEntity).toBe(domainEntityExtension);
    expect(mergedInterchange.elements[0].namespaceInfo.namespace).toBe(extensionNamespaceName);
  });
});

describe('when enhances existing MergedInterchange with domainEntity extension', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const namespaceName: string = 'edfi';
  const extensionNamespaceName: string = 'extensionNamespace';
  const projectExtension: string = 'EXTENSION';

  const domainEntity1Name: string = 'DomainEntity1';
  const domainEntity1Documentation: string = 'DomainEntity1Documentation';
  const domainEntity2Name: string = 'DomainEntity2';
  const domainEntity2Documentation: string = 'DomainEntity2Documentation';

  const interchangeName: string = 'InterchangeName';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation: string = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation: string = 'InterchangeUseCaseDocumentation';
  const interchangeItemDomainEntity1Documentation: string = 'InterchangeItemDomainEntity1Documentation';
  const interchangeItemDomainEntity2Documentation: string = 'InterchangeItemDomainEntity2Documentation';

  let domainEntityExtension;

  beforeAll(() => {
    const coreNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      isExtension: false,
    });

    const extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespaceName,
      projectExtension,
      isExtension: true,
    });

    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity1Name,
      documentation: domainEntity1Documentation,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity1.metaEdName, domainEntity1);

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity2Name,
      documentation: domainEntity2Documentation,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity2.metaEdName, domainEntity2);

    domainEntityExtension = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntity1Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntityExtension.set(domainEntityExtension.metaEdName, domainEntityExtension);

    const coreMergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespaceInfo: coreNamespaceInfo,
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          referencedEntity: domainEntity1,
          data: {
            edfiXsd: {},
          },
        }),
      ],
    });

    addMergedInterchangeToRepository(metaEd, coreMergedInterchange);

    const extensionMergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespaceInfo: extensionNamespaceInfo,
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          referencedEntity: domainEntity1,
          data: {
            edfiXsd: {},
          },
        }),
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity2Name,
          documentation: interchangeItemDomainEntity2Documentation,
          referencedEntity: domainEntity2,
          data: {
            edfiXsd: {},
          },
        }),
      ],
    });

    addMergedInterchangeToRepository(metaEd, extensionMergedInterchange);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should not create additional extension interchange', () => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    expect(edFiXsdEntityRepository.mergedInterchange.size).toBe(2);
  });

  it('should add extension interchange item to existing interchange', () => {
    const expectedExtensionInterchangeName = `${projectExtension}-${interchangeName}`;
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    const extensionInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(expectedExtensionInterchangeName);

    expect(extensionInterchange).toBeDefined();
    expect(extensionInterchange.namespaceInfo.isExtension).toBe(true);
    expect(extensionInterchange.metaEdName).toBe(interchangeName);
    expect(extensionInterchange.elements.length).toBe(2);

    const extensionInterchangeElement1 = extensionInterchange.elements.find(e => e.metaEdName === domainEntity2Name);
    expect(extensionInterchangeElement1.metaEdName).toBe(domainEntity2Name);
    expect(extensionInterchangeElement1.documentation).toBe(interchangeItemDomainEntity2Documentation);
    const extensionInterchangeElement2 = extensionInterchange.elements.find(e => e.metaEdName === domainEntity1Name);
    expect(extensionInterchangeElement2.metaEdName).toBe(domainEntity1Name);
    expect(extensionInterchangeElement2.referencedEntity).toBe(domainEntityExtension);
    expect(extensionInterchangeElement2.namespaceInfo.namespace).toBe(extensionNamespaceName);
  });
});

describe('when enhances MergedInterchange with multiple domainEntity extension', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const namespaceName: string = 'edfi';
  const extensionNamespaceName: string = 'extensionNamespace';
  const projectExtension: string = 'EXTENSION';

  const domainEntity1Name: string = 'DomainEntity1';
  const domainEntity1Documentation: string = 'DomainEntity1Documentation';
  const domainEntity2Name: string = 'DomainEntity2';
  const domainEntity2Documentation: string = 'DomainEntity2Documentation';
  const domainEntity3Name: string = 'DomainEntity3';
  const domainEntity3Documentation: string = 'DomainEntity3Documentation';

  const interchangeName: string = 'InterchangeName';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation: string = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation: string = 'InterchangeUseCaseDocumentation';
  const interchangeItemDomainEntity1Documentation: string = 'InterchangeItemDomainEntity1Documentation';
  const interchangeItemDomainEntity2Documentation: string = 'InterchangeItemDomainEntity2Documentation';
  const interchangeItemDomainEntity3Documentation: string = 'InterchangeItemDomainEntity3Documentation';

  let domainEntityExtension1;
  let domainEntityExtension2;
  let domainEntity3;

  beforeAll(() => {
    const coreNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      isExtension: false,
    });

    const extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespaceName,
      projectExtension,
      isExtension: true,
    });

    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity1Name,
      documentation: domainEntity1Documentation,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity1.metaEdName, domainEntity1);

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity2Name,
      documentation: domainEntity2Documentation,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity2.metaEdName, domainEntity2);

    domainEntity3 = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity3Name,
      documentation: domainEntity3Documentation,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity3.metaEdName, domainEntity3);

    domainEntityExtension1 = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntity1Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntityExtension.set(domainEntityExtension1.metaEdName, domainEntityExtension1);

    domainEntityExtension2 = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntity2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntityExtension.set(domainEntityExtension2.metaEdName, domainEntityExtension2);

    const coreMergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespaceInfo: coreNamespaceInfo,
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          referencedEntity: domainEntity1,
          namespaceInfo: extensionNamespaceInfo,
          data: {
            edfiXsd: {},
          },
        }),
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity2Name,
          documentation: interchangeItemDomainEntity2Documentation,
          referencedEntity: domainEntity2,
          namespaceInfo: extensionNamespaceInfo,
          data: {
            edfiXsd: {},
          },
        }),
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity3Name,
          documentation: interchangeItemDomainEntity3Documentation,
          referencedEntity: domainEntity3,
          namespaceInfo: coreNamespaceInfo,
          data: {
            edfiXsd: {},
          },
        }),
      ],
    });

    addMergedInterchangeToRepository(metaEd, coreMergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should create additional extension interchange', () => {
    const expectedExtensionInterchangeName = `${projectExtension}-${interchangeName}`;
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    const extensionInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(expectedExtensionInterchangeName);

    expect(extensionInterchange).toBeDefined();
    expect(extensionInterchange.namespaceInfo.isExtension).toBe(true);
    expect(extensionInterchange.metaEdName).toBe(interchangeName);
    expect(extensionInterchange.documentation).toBe(interchangeDocumentation);
    expect(extensionInterchange.extendedDocumentation).toBe(interchangeExtendedDocumentation);
    expect(extensionInterchange.useCaseDocumentation).toBe(interchangeUseCaseDocumentation);
    expect(extensionInterchange.elements.length).toBe(3);

    const extensionInterchangeElement1 = extensionInterchange.elements.find(x => x.metaEdName === domainEntity2Name);
    expect(extensionInterchangeElement1.metaEdName).toBe(domainEntity2Name);
    expect(extensionInterchangeElement1.documentation).toBe(interchangeItemDomainEntity2Documentation);
    expect(extensionInterchangeElement1.referencedEntity).toBe(domainEntityExtension2);
    expect(extensionInterchangeElement1.namespaceInfo.namespace).toBe(extensionNamespaceName);

    const extensionInterchangeElement2 = extensionInterchange.elements.find(x => x.metaEdName === domainEntity1Name);
    expect(extensionInterchangeElement2.metaEdName).toBe(domainEntity1Name);
    expect(extensionInterchangeElement2.documentation).toBe(interchangeItemDomainEntity1Documentation);
    expect(extensionInterchangeElement2.referencedEntity).toBe(domainEntityExtension1);
    expect(extensionInterchangeElement2.namespaceInfo.namespace).toBe(extensionNamespaceName);

    const extensionInterchangeElement3 = extensionInterchange.elements.find(x => x.metaEdName === domainEntity3Name);
    expect(extensionInterchangeElement3.metaEdName).toBe(domainEntity3Name);
    expect(extensionInterchangeElement3.documentation).toBe(interchangeItemDomainEntity3Documentation);
    expect(extensionInterchangeElement3.referencedEntity).toBe(domainEntity3);
    expect(extensionInterchangeElement3.namespaceInfo.namespace).toBe(namespaceName);
  });
});

describe('when enhances MergedInterchange in extension namespace with multiple domainEntity', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const namespaceName: string = 'edfi';
  const extensionNamespaceName: string = 'extensionNamespace';
  const projectExtension: string = 'EXTENSION';

  const domainEntity1Name: string = 'DomainEntity1';
  const domainEntity1Documentation: string = 'DomainEntity1Documentation';
  const domainEntity2Name: string = 'DomainEntity2';
  const domainEntity2Documentation: string = 'DomainEntity2Documentation';

  const interchangeName: string = 'InterchangeName';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation: string = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation: string = 'InterchangeUseCaseDocumentation';
  const interchangeItemDomainEntity1Documentation: string = 'InterchangeItemDomainEntity1Documentation';
  const interchangeItemDomainEntity2Documentation: string = 'InterchangeItemDomainEntity2Documentation';

  let domainEntity1;
  let domainEntity2;
  let domainEntityExtension1;

  beforeAll(() => {
    const coreNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      isExtension: false,
    });

    const extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespaceName,
      projectExtension,
      isExtension: true,
    });

    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    domainEntity1 = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity1Name,
      documentation: domainEntity1Documentation,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity1.metaEdName, domainEntity1);

    domainEntity2 = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity2Name,
      documentation: domainEntity2Documentation,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity2.metaEdName, domainEntity2);

    domainEntityExtension1 = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntity1Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {},
      },
    });
    metaEd.entity.domainEntityExtension.set(domainEntityExtension1.metaEdName, domainEntityExtension1);

    const extensionMergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCaseDocumentation,
      namespaceInfo: extensionNamespaceInfo,
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity1Name,
          documentation: interchangeItemDomainEntity1Documentation,
          referencedEntity: domainEntity1,
          namespaceInfo: extensionNamespaceInfo,
          data: {
            edfiXsd: {},
          },
        }),
        Object.assign(newInterchangeItem(), {
          metaEdName: domainEntity2Name,
          documentation: interchangeItemDomainEntity2Documentation,
          referencedEntity: domainEntity2,
          namespaceInfo: extensionNamespaceInfo,
          data: {
            edfiXsd: {},
          },
        }),
      ],
    });

    addMergedInterchangeToRepository(metaEd, extensionMergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should create interchange with correct elements', () => {
    const expectedExtensionInterchangeName = `${projectExtension}-${interchangeName}`;
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    const interchange: any = edFiXsdEntityRepository.mergedInterchange.get(expectedExtensionInterchangeName);

    expect(interchange).toBeDefined();
    expect(interchange.namespaceInfo.isExtension).toBe(true);
    expect(interchange.metaEdName).toBe(interchangeName);
    expect(interchange.documentation).toBe(interchangeDocumentation);
    expect(interchange.extendedDocumentation).toBe(interchangeExtendedDocumentation);
    expect(interchange.useCaseDocumentation).toBe(interchangeUseCaseDocumentation);
    expect(interchange.elements.length).toBe(2);

    const interchangeElement1 = interchange.elements.find(x => x.metaEdName === domainEntity1Name);
    expect(interchangeElement1.metaEdName).toBe(domainEntity1Name);
    expect(interchangeElement1.documentation).toBe(interchangeItemDomainEntity1Documentation);
    expect(interchangeElement1.referencedEntity).toBe(domainEntityExtension1);
    expect(interchangeElement1.namespaceInfo.namespace).toBe(extensionNamespaceName);

    const interchangeElement2 = interchange.elements.find(x => x.metaEdName === domainEntity2Name);
    expect(interchangeElement2.metaEdName).toBe(domainEntity2Name);
    expect(interchangeElement2.documentation).toBe(interchangeItemDomainEntity2Documentation);
    expect(interchangeElement2.referencedEntity).toBe(domainEntity2);
    expect(interchangeElement2.namespaceInfo.namespace).toBe(extensionNamespaceName);
  });
});
