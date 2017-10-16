// @flow
import { newMetaEdEnvironment, newInterchange, newInterchangeItem, newNamespaceInfo, newInterchangeExtension, newPluginEnvironment } from '../../../metaed-core/index';
import type { MetaEdEnvironment, InterchangeItem } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeEnhancer';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { newEdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';
import type { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when running with no interchange extensions', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeName: string = 'InterchangeName';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation: string = 'InterchangeExtendedDocumentation';
  const interchangeUseCase: string = 'InterchangeUseCase';
  const elementBaseName: string = 'InterchangeElement';
  const elementBaseType: string = 'InterchangeElementType';


  beforeAll(() => {
    const element: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementBaseName,
      data: {
        edfiXsd: {
          xsd_Type: elementBaseType,
        },
      },
    });

    const interchange = Object.assign(newInterchange(), {
      metaEdName: interchangeName,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCase,
      elements: [
        element,
      ],
      data: {
        edfiXsd: {
        },
      },
    });

    metaEd.entity.interchange.set(interchange.metaEdName, interchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should be core merged interchange', () => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    const mergedInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(interchangeName);

    expect(mergedInterchange).toBeDefined();
    expect(mergedInterchange.namespaceInfo.isExtension).toBe(false);
    expect(mergedInterchange.elements.length).toBe(1);
    expect(mergedInterchange.documentation).toBe(interchangeDocumentation);
    expect(mergedInterchange.extendedDocumentation).toBe(interchangeExtendedDocumentation);
    expect(mergedInterchange.useCaseDocumentation).toBe(interchangeUseCase);
  });
});

describe('when running with interchange extensions', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeToBeExtendedName: string = 'InterchangeToBeExtendedName';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const coreNamespace: string = 'edfi';
  const extensionNamespace: string = 'extensionNamespace';
  const projectExtension: string = 'EXTENSION';
  const elementNoExtensionBaseName: string = 'InterchangeElement';
  const elementNoExtensionBaseType: string = 'InterchangeElementType';
  const elementBaseType: string = 'ElementType';
  const extensionElementBaseName: string = 'InterchangeExtensionElement';
  const extensionElementBaseType: string = 'InterchangeExtensionElementType';

  beforeAll(() => {
    const elementNoExtension: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementNoExtensionBaseName,
      data: {
        edfiXsd: {
          xsd_Type: elementNoExtensionBaseType,
        },
      },
    });

    const element: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: extensionElementBaseName,
      data: {
        edfiXsd: {
          xsd_Type: elementBaseType,
        },
      },
    });

    const extensionElement: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: extensionElementBaseName,
      data: {
        edfiXsd: {
          xsd_Type: extensionElementBaseType,
        },
      },
    });

    const interchangeToBeExtended = Object.assign(newInterchange(), {
      metaEdName: interchangeToBeExtendedName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace: coreNamespace,
        isExtension: false,
      }),
      documentation: interchangeDocumentation,
      elements: [
        element,
        elementNoExtension,
      ],
      data: {
        edfiXsd: {
        },
      },
    });

    metaEd.entity.interchange.set(interchangeToBeExtended.metaEdName, interchangeToBeExtended);

    const interchangeExtension = Object.assign(newInterchangeExtension(), {
      metaEdName: interchangeToBeExtendedName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace: extensionNamespace,
        projectExtension,
        isExtension: true,
      }),
      baseEntity: interchangeToBeExtended,
      documentation: interchangeDocumentation,
      elements: [
        extensionElement,
      ],
      data: {
        edfiXsd: {
        },
      },
    });

    metaEd.entity.interchangeExtension.set(interchangeExtension.metaEdName, interchangeExtension);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have core merged interchange', () => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
    const mergedInterchange: any = edFiXsdEntityRepository.mergedInterchange.get(interchangeToBeExtendedName);

    expect(mergedInterchange).toBeDefined();
    expect(mergedInterchange.namespaceInfo.isExtension).toBe(false);
    expect(mergedInterchange.elements.length).toBe(2);
    expect(mergedInterchange.documentation).toBe(interchangeDocumentation);
    expect(mergedInterchange.elements[0].metaEdName).toBe(extensionElementBaseName);
    expect(mergedInterchange.elements[0].data.edfiXsd.xsd_Type).toBe(elementBaseType);
    expect(mergedInterchange.elements[1].metaEdName).toBe(elementNoExtensionBaseName);
    expect(mergedInterchange.elements[1].data.edfiXsd.xsd_Type).toBe(elementNoExtensionBaseType);
  });
});
