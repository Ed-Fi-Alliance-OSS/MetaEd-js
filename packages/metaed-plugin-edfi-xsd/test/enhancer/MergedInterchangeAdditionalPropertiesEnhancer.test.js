// @flow
import { newMetaEdEnvironment, newInterchangeItem, newInterchange, newNamespaceInfo, newPluginEnvironment } from '../../../metaed-core/index';
import type { MetaEdEnvironment, InterchangeItem, Interchange } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeAdditionalPropertiesEnhancer';
import { newMergedInterchange } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { newEdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';
import type { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when MergedInterchangeSchemaLocationEnhancer enhances MergedInterchange with no extension', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeName: string = 'InterchangeName';
  const elementBaseName: string = 'InterchangeElement';
  let mergedInterchange;

  beforeAll(() => {
    const element: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementBaseName,
    });

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

    mergedInterchange = Object.assign(newMergedInterchange(), {
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
    expect(mergedInterchange.interchangeName).toBe(`Interchange${interchangeName}`);
  });

  it('should have xsd_Type value assigned', () => {
    expect(mergedInterchange.schemaLocation).toBe('Ed-Fi-Core.xsd');
  });
});

describe('when MergedInterchangeSchemaLocationEnhancer enhances MergedInterchange with extension', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const interchangeName: string = 'InterchangeName';
  const elementBaseName: string = 'InterchangeElement';
  const projectExtension: string = 'EXTENSION';
  let mergedInterchange;

  beforeAll(() => {
    const element: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementBaseName,
    });

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

    mergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        projectExtension,
        isExtension: true,
      }),
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
    expect(mergedInterchange.interchangeName).toBe(`Interchange${interchangeName}`);
  });

  it('should have xsd_Type value assigned with extension', () => {
    expect(mergedInterchange.schemaLocation).toBe(`${projectExtension}-Ed-Fi-Extended-Core.xsd`);
  });
});
