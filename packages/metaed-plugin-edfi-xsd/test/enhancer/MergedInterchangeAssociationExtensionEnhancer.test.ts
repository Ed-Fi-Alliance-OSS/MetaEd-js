import {
  newMetaEdEnvironment,
  newInterchangeItem,
  newNamespace,
  newAssociation,
  newAssociationExtension,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Association, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeExtensionEnhancer';
import { edfiXsdRepositoryForNamespace } from '../../src/enhancer/EnhancerHelper';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when enhances MergedInterchange with association extension', (): void => {
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

  const association1Name = 'Association1';
  const association1Documentation = 'Association1Documentation';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeExtendedDocumentation = 'InterchangeExtendedDocumentation';
  const interchangeUseCaseDocumentation = 'InterchangeUseCaseDocumentation';
  const interchangeItemAssociation1Documentation = 'InterchangeItemAssociation1Documentation';

  let associationExtension;

  beforeAll(() => {
    const association: Association = {
      ...newAssociation(),
      metaEdName: association1Name,
      documentation: association1Documentation,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.association.set(association.metaEdName, association);

    associationExtension = {
      ...newAssociationExtension(),
      metaEdName: association1Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.associationExtension.set(associationExtension.metaEdName, associationExtension);

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
          metaEdName: association1Name,
          documentation: interchangeItemAssociation1Documentation,
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

    expect(mergedInterchange.elements[0].metaEdName).toBe(association1Name);
    expect(mergedInterchange.elements[0].documentation).toBe(interchangeItemAssociation1Documentation);
    expect(mergedInterchange.elements[0].referencedEntity).toBe(associationExtension);
    expect(mergedInterchange.elements[0].namespace.namespaceName).toBe('Extension');
  });
});
