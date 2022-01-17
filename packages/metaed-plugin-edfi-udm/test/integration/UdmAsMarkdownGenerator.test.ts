import { newMetaEdEnvironment, newDomainEntity, newDomain, newNamespace, addEntityForNamespace } from '@edfi/metaed-core';
import { Namespace, MetaEdEnvironment } from '@edfi/metaed-core';
import { addModelBaseEdfiUdmTo } from '../../src/model/ModelBase';
import { generateMarkdownForDomains } from '../../src/generator/UdmGenerator';
import { DomainMarkdown } from '../../src/generator/UdmGenerator';

describe('When generating interchange brief with no extended references or descriptors', (): void => {
  const domain1Name = 'Domain1Name';
  const domain2Name = 'Domain2Name';
  const domainEntity1Documentation = 'Domain Entity 1 Documentation here';
  const domainEntity2Documentation = 'Domain Entity 2 Documentation here';
  const domainEntity3Documentation = 'Domain Entity 3 Documentation here';
  const domainEntity4Documentation = 'Domain Entity 4 Documentation here';

  let generatedResults: string[];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'EdFi' });
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(async () => {
    const domainEntity1 = {
      ...newDomainEntity(),
      namespace,
      metaEdName: 'domainEntity1',
      documentation: domainEntity1Documentation,
    };
    addEntityForNamespace(domainEntity1);
    addModelBaseEdfiUdmTo(domainEntity1);
    const domainEntity2 = {
      ...newDomainEntity(),
      namespace,
      metaEdName: 'domainEntity2',
      documentation: domainEntity2Documentation,
    };
    addEntityForNamespace(domainEntity2);
    addModelBaseEdfiUdmTo(domainEntity2);
    const domainEntity3 = {
      ...newDomainEntity(),
      namespace,
      metaEdName: 'domainEntity3',
      documentation: domainEntity3Documentation,
    };
    addEntityForNamespace(domainEntity3);
    addModelBaseEdfiUdmTo(domainEntity3);
    const domainEntity4 = {
      ...newDomainEntity(),
      namespace,
      metaEdName: 'domainEntity4',
      documentation: domainEntity4Documentation,
    };
    addEntityForNamespace(domainEntity4);
    addModelBaseEdfiUdmTo(domainEntity4);

    const domain1 = {
      ...newDomain(),
      namespace,
      metaEdName: domain1Name,
      documentation: 'Domain 1 Documentation',
      entities: [domainEntity1, domainEntity2],
    };
    addEntityForNamespace(domain1);
    addModelBaseEdfiUdmTo(domain1);
    const domain2 = {
      ...newDomain(),
      namespace,
      metaEdName: domain2Name,
      documentation: 'Domain 2 Documentation',
      entities: [domainEntity3, domainEntity4],
    };
    addEntityForNamespace(domain2);
    addModelBaseEdfiUdmTo(domain2);

    const domainMarkdowns: DomainMarkdown[] = await generateMarkdownForDomains(metaEd);
    generatedResults = domainMarkdowns.map((x) => x.markdown);
  });

  it('Should include entities', (): void => {
    expect(generatedResults.length).toBe(2);

    expect(generatedResults[0]).toContain('Domain 1 Documentation');
    expect(generatedResults[0]).toContain(domainEntity1Documentation);
    expect(generatedResults[0]).toContain(domainEntity2Documentation);

    expect(generatedResults[1]).toContain('Domain 2 Documentation');
    expect(generatedResults[1]).toContain(domainEntity3Documentation);
    expect(generatedResults[1]).toContain(domainEntity4Documentation);
  });
});
