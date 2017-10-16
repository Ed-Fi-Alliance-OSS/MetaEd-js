// @flow
import { newMetaEdEnvironment, newInterchangeItem, newInterchange, newDomainEntity, newPluginEnvironment, newInterchangeExtension } from '../../../metaed-core/index';
import type { MetaEdEnvironment, InterchangeItem, Interchange, DomainEntity, InterchangeExtension } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/InterchangeItemEnhancer';
import { newMergedInterchange } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { newEdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';
import type { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when InterchangeItemEnhancer enhances element', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeName: string = 'InterchangeName';
  const elementBaseName: string = 'InterchangeElement';
  const referenceElementName: string = 'ReferencedElement';

  const referencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: referenceElementName,
    data: {
      edfiXsd: {
      },
    },
  });
  metaEd.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

  const element: InterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: elementBaseName,
    referencedEntity,
    data: {
      edfiXsd: {
      },
    },
  });

  beforeAll(() => {
    const interchange: Interchange = Object.assign(newInterchange(), {
      metaEdName: interchangeName,
      elements: [
        element,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.interchange.set(interchange.metaEdName, interchange);

    const mergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      elements: [
        element,
      ],
    });
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_Name assigned', () => {
    expect(element.data.edfiXsd.xsd_Name).toBe(elementBaseName);
  });

  it('should have xsd_Type value assigned', () => {
    expect(element.data.edfiXsd.xsd_Type).toBe(referenceElementName);
  });
});

describe('when InterchangeItemEnhancer enhances identity template', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeName: string = 'InterchangeName';
  const identityTemplateName: string = 'InterchangeElement';
  const referenceElementName: string = 'ReferencedElement';

  const referencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: referenceElementName,
    data: {
      edfiXsd: {
      },
    },
  });
  metaEd.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

  const identityTemplate: InterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: identityTemplateName,
    referencedEntity,
    data: {
      edfiXsd: {
      },
    },
  });

  beforeAll(() => {
    const interchange: Interchange = Object.assign(newInterchange(), {
      metaEdName: interchangeName,
      identityTemplates: [
        identityTemplate,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.interchange.set(interchange.metaEdName, interchange);

    const mergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      identityTemplates: [
        identityTemplate,
      ],
    });
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_Name assigned', () => {
    expect(identityTemplate.data.edfiXsd.xsd_Name).toBe(`${identityTemplateName}Reference`);
  });

  it('should have xsd_Type value assigned', () => {
    expect(identityTemplate.data.edfiXsd.xsd_Type).toBe(`${referenceElementName}ReferenceType`);
  });
});

describe('when InterchangeItemEnhancer enhances element on extension', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeName: string = 'InterchangeName';
  const elementBaseName: string = 'InterchangeElement';
  const extensionElementBaseName: string = 'ExtensionInterchangeElement';
  const referenceElementName: string = 'ReferencedElement';
  const referenceExtensionElementName: string = 'ReferencedExtensionElement';

  const referencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: referenceElementName,
    data: {
      edfiXsd: {
      },
    },
  });
  metaEd.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

  const element: InterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: elementBaseName,
    referencedEntity,
    data: {
      edfiXsd: {
      },
    },
  });

  const referencedExtensionEntity: DomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: referenceExtensionElementName,
    data: {
      edfiXsd: {
      },
    },
  });
  metaEd.entity.domainEntity.set(referencedExtensionEntity.metaEdName, referencedExtensionEntity);

  const extensionElement: InterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: extensionElementBaseName,
    referencedEntity: referencedExtensionEntity,
    data: {
      edfiXsd: {
      },
    },
  });

  beforeAll(() => {
    const interchange: Interchange = Object.assign(newInterchange(), {
      metaEdName: interchangeName,
      elements: [
        element,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.interchange.set(interchange.metaEdName, interchange);

    const interchangeExtension: InterchangeExtension = Object.assign(newInterchangeExtension(), {
      metaEdName: interchangeName,
      elements: [
        extensionElement,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.interchangeExtension.set(interchangeExtension.metaEdName, interchangeExtension);

    const mergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      elements: [
        element,
        extensionElement,
      ],
    });
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_Name assigned', () => {
    expect(extensionElement.data.edfiXsd.xsd_Name).toBe(extensionElementBaseName);
  });

  it('should have xsd_Type value assigned', () => {
    expect(extensionElement.data.edfiXsd.xsd_Type).toBe(referenceExtensionElementName);
  });
});

describe('when InterchangeItemEnhancer enhances identity template on extension', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeName: string = 'InterchangeName';
  const elementBaseName: string = 'InterchangeElement';
  const extensionElementBaseName: string = 'ExtensionInterchangeElement';
  const referenceElementName: string = 'ReferencedElement';
  const referenceExtensionElementName: string = 'ReferencedExtensionElement';

  const referencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: referenceElementName,
    data: {
      edfiXsd: {
      },
    },
  });
  metaEd.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

  const element: InterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: elementBaseName,
    referencedEntity,
    data: {
      edfiXsd: {
      },
    },
  });

  const referencedExtensionEntity: DomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: referenceExtensionElementName,
    data: {
      edfiXsd: {
      },
    },
  });
  metaEd.entity.domainEntity.set(referencedExtensionEntity.metaEdName, referencedExtensionEntity);

  const extensionElement: InterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: extensionElementBaseName,
    referencedEntity: referencedExtensionEntity,
    data: {
      edfiXsd: {
      },
    },
  });

  beforeAll(() => {
    const interchange: Interchange = Object.assign(newInterchange(), {
      metaEdName: interchangeName,
      identityTemplates: [
        element,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.interchange.set(interchange.metaEdName, interchange);

    const interchangeExtension: InterchangeExtension = Object.assign(newInterchangeExtension(), {
      metaEdName: interchangeName,
      identityTemplates: [
        extensionElement,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.interchangeExtension.set(interchangeExtension.metaEdName, interchangeExtension);

    const mergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      identityTemplates: [
        element,
        extensionElement,
      ],
    });
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_Name assigned', () => {
    expect(extensionElement.data.edfiXsd.xsd_Name).toBe(`${extensionElementBaseName}Reference`);
  });

  it('should have xsd_Type value assigned', () => {
    expect(extensionElement.data.edfiXsd.xsd_Type).toBe(`${referenceExtensionElementName}ReferenceType`);
  });
});
