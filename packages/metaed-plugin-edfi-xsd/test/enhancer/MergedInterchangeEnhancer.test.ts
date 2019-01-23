import {
  newMetaEdEnvironment,
  newInterchange,
  newInterchangeItem,
  newNamespace,
  newInterchangeExtension,
} from 'metaed-core';
import { MetaEdEnvironment, InterchangeItem, Namespace } from 'metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeEnhancer';
import { edfiXsdRepositoryForNamespace } from '../../src/enhancer/EnhancerHelper';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when running with no interchange extensions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'edfi' });
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation = 'InterchangeExtendedDocumentation';
  const interchangeUseCase = 'InterchangeUseCase';
  const elementBaseName = 'InterchangeElement';
  const elementBaseType = 'InterchangeElementType';

  beforeAll(() => {
    const element: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementBaseName,
      data: {
        edfiXsd: {
          xsdType: elementBaseType,
        },
      },
    });

    const interchange = Object.assign(newInterchange(), {
      metaEdName: interchangeName,
      namespace,
      documentation: interchangeDocumentation,
      extendedDocumentation: interchangeExtendedDocumentation,
      useCaseDocumentation: interchangeUseCase,
      elements: [element],
      data: {
        edfiXsd: {},
      },
    });

    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should be core merged interchange', () => {
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

describe('when running with interchange extensions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'edfi' });
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName: 'extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  });
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
    const elementNoExtension: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementNoExtensionBaseName,
      data: {
        edfiXsd: {
          xsdType: elementNoExtensionBaseType,
        },
      },
    });

    const element: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: extensionElementBaseName,
      data: {
        edfiXsd: {
          xsdType: elementBaseType,
        },
      },
    });

    const extensionElement: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: extensionElementBaseName,
      data: {
        edfiXsd: {
          xsdType: extensionElementBaseType,
        },
      },
    });

    const interchangeToBeExtended = Object.assign(newInterchange(), {
      metaEdName: interchangeToBeExtendedName,
      namespace,
      documentation: interchangeDocumentation,
      elements: [element, elementNoExtension],
      data: {
        edfiXsd: {},
      },
    });

    namespace.entity.interchange.set(interchangeToBeExtended.metaEdName, interchangeToBeExtended);

    const interchangeExtension = Object.assign(newInterchangeExtension(), {
      metaEdName: interchangeToBeExtendedName,
      namespace: extensionNamespace,
      baseEntity: interchangeToBeExtended,
      documentation: interchangeDocumentation,
      elements: [extensionElement],
      data: {
        edfiXsd: {},
      },
    });

    extensionNamespace.entity.interchangeExtension.set(interchangeExtension.metaEdName, interchangeExtension);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have core merged interchange', () => {
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
