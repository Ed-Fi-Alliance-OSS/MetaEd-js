/*  This test suite was commented out in January 2019 - Horseman injection stopped working on move to TypeScript.
 *  Horseman is obsolete anyway, and this plugin is completely disabled in src/index.ts
 *  This file maintains a .js extension to prevent it from being found by the Jest test runner
 * 
import { newMetaEdEnvironment, newDomainEntity, newInterchangeItem, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { EdFiXsdEntityRepository } from '@edfi/metaed-plugin-edfi-xsd';
import {
  addEdFiXsdEntityRepositoryTo,
  newMergedInterchange,
  MergedInterchange,
  edfiXsdRepositoryForNamespace,
} from '@edfi/metaed-plugin-edfi-xsd';
import { generate as InterchangeBriefSvgGenerator } from '../../src/generator/InterchangeBriefSvgGenerator';

jest.setTimeout(10000);

describe('When generating interchange brief with no extended references or descriptors', (): void => {
  const interchange1metaEdName = 'Interchange1metaEdName';
  const interchange2metaEdName = 'Interchange2metaEdName';
  const interchange1InterchangeName = 'InterchangeInterchange1metaEdName';
  const interchange2InterchangeName = 'InterchangeInterchange2metaEdName';

  const interchange1Documentation = 'Interchange 1 Documentation here';
  const interchange2Documentation = 'Interchange 2 Documentation here';

  const domainEntity1Documentation = 'Domain Entity 1 Documentation here';
  const domainEntity2Documentation = 'Domain Entity 2 Documentation here';
  const domainEntity3Documentation = 'Domain Entity 3 Documentation here';
  const domainEntity4Documentation = 'Domain Entity 4 Documentation here';

  function GetBuilderResults() {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'EdFi' });
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    const domainEntity1 = Object.assign(newDomainEntity(), {
      metaEdName: 'domainEntity1',
      documentation: domainEntity1Documentation,
    });
    const domainEntity2 = Object.assign(newDomainEntity(), {
      metaEdName: 'domainEntity2',
      documentation: domainEntity2Documentation,
    });
    const domainEntity3 = Object.assign(newDomainEntity(), {
      metaEdName: 'domainEntity3',
      documentation: domainEntity3Documentation,
    });
    const domainEntity4 = Object.assign(newDomainEntity(), {
      metaEdName: 'domainEntity4',
      documentation: domainEntity4Documentation,
    });

    const interchange1: MergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchange1metaEdName,
      interchangeName: interchange1InterchangeName,
      documentation: interchange1Documentation,
    });
    const interchangeItem1 = Object.assign(newInterchangeItem(), {
      metaEdName: domainEntity1.metaEdName,
      data: {
        edfiInterchangeBrief: { interchangeBriefDescription: domainEntity1Documentation },
        edfiXsd: { xsdName: domainEntity1.metaEdName },
      },
      referencedEntity: domainEntity1,
    });
    const interchangeItem2 = Object.assign(newInterchangeItem(), {
      metaEdName: domainEntity2.metaEdName,
      data: {
        edfiInterchangeBrief: { interchangeBriefDescription: domainEntity2Documentation },
        edfiXsd: { xsdName: domainEntity2.metaEdName },
      },
      referencedEntity: domainEntity2,
    });
    interchange1.elements.push(interchangeItem1);
    interchange1.elements.push(interchangeItem2);

    const interchange2: MergedInterchange = Object.assign(newMergedInterchange(), {
      metaEdName: interchange2metaEdName,
      interchangeName: interchange2InterchangeName,
      documentation: interchange2Documentation,
    });
    const interchangeItem3 = Object.assign(newInterchangeItem(), {
      metaEdName: domainEntity3.metaEdName,
      data: {
        edfiInterchangeBrief: { interchangeBriefDescription: domainEntity3Documentation },
        edfiXsd: { xsdName: domainEntity3.metaEdName },
      },
      referencedEntity: domainEntity3,
    });
    const interchangeItem4 = Object.assign(newInterchangeItem(), {
      metaEdName: domainEntity4.metaEdName,
      data: {
        edfiInterchangeBrief: { interchangeBriefDescription: domainEntity4Documentation },
        edfiXsd: { xsdName: domainEntity4.metaEdName },
      },
      referencedEntity: domainEntity4,
    });
    interchange2.elements.push(interchangeItem3);
    interchange2.elements.push(interchangeItem4);

    const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (xsdRepository == null) throw new Error();

    xsdRepository.mergedInterchange.set(interchange1.interchangeName, interchange1);
    xsdRepository.mergedInterchange.set(interchange2.interchangeName, interchange2);
    return metaEd;
  }

  it('Should include results', async () => {
    const result = await InterchangeBriefSvgGenerator(GetBuilderResults());
    expect(result.generatedOutput.length).toBe(2);
  });
});

*/
