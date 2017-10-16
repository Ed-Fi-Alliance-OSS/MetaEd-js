// @flow
import { newMetaEdEnvironment, newInterchangeItem, newNamespaceInfo, newPluginEnvironment } from '../../../metaed-core/index';
import type { MetaEdEnvironment } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeElementOrderEnhancer';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { newEdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when MergedInterchangeElementOrderEnhancer enhances MergedInterchanges with elements differing by xsd_Name', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeName: string = 'InterchangeName';
  const coreOnlyInterchangeItemName: string = 'CoreOnlyInterchangeItemName';
  const extensionOnlyInterchangeItemName: string = 'ExtensionOnlyInterchangeItemName';
  const extendedInterchangeItemName: string = 'ExtendedInterchangeItemName';
  const xsdType: string = 'XsdType';
  const projectExtension: string = 'EXTENSION';
  let coreMergedInterchange;
  let extensionMergedInterchange;

  beforeAll(() => {
    coreMergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: extendedInterchangeItemName,
          data: {
            edfiXsd: {
              xsd_Name: extendedInterchangeItemName,
              xsd_Type: xsdType,
            },
          },
        }),
        Object.assign(newInterchangeItem(), {
          metaEdName: coreOnlyInterchangeItemName,
          data: {
            edfiXsd: {
              xsd_Name: coreOnlyInterchangeItemName,
              xsd_Type: xsdType,
            },
          },
        }),
      ],
    });

    extensionMergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        projectExtension,
        isExtension: true,
      }),
      elements: [
        Object.assign(newInterchangeItem(), {
          metaEdName: extensionOnlyInterchangeItemName,
          data: {
            edfiXsd: {
              xsd_Name: extensionOnlyInterchangeItemName,
              xsd_Type: xsdType,
            },
          },
        }),
        Object.assign(newInterchangeItem(), {
          metaEdName: extendedInterchangeItemName,
          data: {
            edfiXsd: {
              xsd_Name: extendedInterchangeItemName,
              xsd_Type: xsdType,
            },
          },
        }),
      ],
    });
    addMergedInterchangeToRepository(metaEd, coreMergedInterchange);
    addMergedInterchangeToRepository(metaEd, extensionMergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct core interchange item order', () => {
    expect(coreMergedInterchange.orderedElements.length).toBe(2);
    expect(coreMergedInterchange.orderedElements[0].metaEdName).toBe(extendedInterchangeItemName);
    expect(coreMergedInterchange.orderedElements[1].metaEdName).toBe(coreOnlyInterchangeItemName);
  });

  it('should have correct extension interchange item order', () => {
    expect(extensionMergedInterchange.orderedElements.length).toBe(2);
    expect(extensionMergedInterchange.orderedElements[0].metaEdName).toBe(extendedInterchangeItemName);
    expect(extensionMergedInterchange.orderedElements[1].metaEdName).toBe(extensionOnlyInterchangeItemName);
  });
});
