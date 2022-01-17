import { newMetaEdEnvironment, newInterchangeItem, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeElementOrderEnhancer';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';

describe('when MergedInterchangeElementOrderEnhancer enhances MergedInterchanges with elements differing by xsdName', (): void => {
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

  const interchangeName = 'InterchangeName';
  const coreOnlyInterchangeItemName = 'CoreOnlyInterchangeItemName';
  const extensionOnlyInterchangeItemName = 'ExtensionOnlyInterchangeItemName';
  const extendedInterchangeItemName = 'ExtendedInterchangeItemName';
  const xsdType = 'XsdType';
  let coreMergedInterchange;
  let extensionMergedInterchange;

  beforeAll(() => {
    coreMergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      namespace,
      repositoryId: interchangeName,
      elements: [
        {
          ...newInterchangeItem(),
          metaEdName: extendedInterchangeItemName,
          data: {
            edfiXsd: {
              xsdName: extendedInterchangeItemName,
              xsdType,
            },
          },
        },
        {
          ...newInterchangeItem(),
          metaEdName: coreOnlyInterchangeItemName,
          data: {
            edfiXsd: {
              xsdName: coreOnlyInterchangeItemName,
              xsdType,
            },
          },
        },
      ],
    };

    extensionMergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      namespace: extensionNamespace,
      elements: [
        {
          ...newInterchangeItem(),
          metaEdName: extensionOnlyInterchangeItemName,
          data: {
            edfiXsd: {
              xsdName: extensionOnlyInterchangeItemName,
              xsdType,
            },
          },
        },
        {
          ...newInterchangeItem(),
          metaEdName: extendedInterchangeItemName,
          data: {
            edfiXsd: {
              xsdName: extendedInterchangeItemName,
              xsdType,
            },
          },
        },
      ],
    };
    addMergedInterchangeToRepository(metaEd, coreMergedInterchange);
    addMergedInterchangeToRepository(metaEd, extensionMergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct core interchange item order', (): void => {
    expect(coreMergedInterchange.orderedElements.length).toBe(2);
    expect(coreMergedInterchange.orderedElements[0].metaEdName).toBe(extendedInterchangeItemName);
    expect(coreMergedInterchange.orderedElements[1].metaEdName).toBe(coreOnlyInterchangeItemName);
  });

  it('should have correct extension interchange item order', (): void => {
    expect(extensionMergedInterchange.orderedElements.length).toBe(2);
    expect(extensionMergedInterchange.orderedElements[0].metaEdName).toBe(extendedInterchangeItemName);
    expect(extensionMergedInterchange.orderedElements[1].metaEdName).toBe(extensionOnlyInterchangeItemName);
  });
});
