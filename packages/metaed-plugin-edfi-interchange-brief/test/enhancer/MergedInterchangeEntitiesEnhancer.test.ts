import { newMetaEdEnvironment, newDomainEntity, newInterchangeItem, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, InterchangeItem, DomainEntity, Namespace } from '@edfi/metaed-core';
import {
  addEdFiXsdEntityRepositoryTo,
  newMergedInterchange,
  edfiXsdRepositoryForNamespace,
} from '@edfi/metaed-plugin-edfi-xsd';
import { EdFiXsdEntityRepository, MergedInterchange } from '@edfi/metaed-plugin-edfi-xsd';
import { enhance } from '../../src/enhancer/MergedInterchangeEntitiesEnhancer';
import { addMergedInterchangeEdfiInterchangeBriefTo } from '../../src/model/MergedInterchange';

const interchangeName = 'InterchangeName';
const interchangeLevelDomainEntity1Name = 'EntityName1';
const interchangeLevelDomainEntity2Name = 'EntityName2';

const interchangeLevelDomainEntity1Documentation = 'Entity1Documentation';
const interchangeLevelDomainEntity2Documentation = 'Entity2Documentation';

let mergedInterchange: MergedInterchange;
let interchangeLevelDomainEntity1: DomainEntity;
let interchangeLevelDomainEntity2: DomainEntity;

let domainEntity1InterchangeItem: InterchangeItem;
let domainEntity2InterchangeItem: InterchangeItem;

let metaEd: MetaEdEnvironment = newMetaEdEnvironment();

function setupRepository() {
  metaEd = newMetaEdEnvironment();
  const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'EdFi' });
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);

  mergedInterchange = Object.assign(newMergedInterchange(), { metaEdName: interchangeName }) as MergedInterchange;
  addMergedInterchangeEdfiInterchangeBriefTo(mergedInterchange);

  const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
  if (xsdRepository == null) throw new Error();

  interchangeLevelDomainEntity1 = Object.assign(newDomainEntity(), {
    metaEdName: interchangeLevelDomainEntity1Name,
    documentation: interchangeLevelDomainEntity1Documentation,
  });
  interchangeLevelDomainEntity2 = Object.assign(newDomainEntity(), {
    metaEdName: interchangeLevelDomainEntity2Name,
    documentation: interchangeLevelDomainEntity2Documentation,
  });
  domainEntity1InterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: interchangeLevelDomainEntity1Name,
    referencedEntity: interchangeLevelDomainEntity1,
  });
  domainEntity2InterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: interchangeLevelDomainEntity2Name,
    referencedEntity: interchangeLevelDomainEntity2,
  });

  xsdRepository.mergedInterchange.set(interchangeName, mergedInterchange);
}

describe('when MergedInterchangeEntitiesEnhancer enhances mergedInterchange with no identity templates', (): void => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntity1InterchangeItem);
    enhance(metaEd);
  });
  it('should generate entity with description', (): void => {
    expect(mergedInterchange.data.edfiInterchangeBrief.interchangeBriefEntities.length).toBe(1);
    const entity = mergedInterchange.data.edfiInterchangeBrief.interchangeBriefEntities[0];
    expect(entity).toBe(domainEntity1InterchangeItem);
    expect(entity.data.edfiInterchangeBrief.interchangeBriefDescription).toBe(interchangeLevelDomainEntity1Documentation);
  });
});
describe('when MergedInterchangeEntitiesEnhancer enhances mergedInterchange with no identity elements', (): void => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.identityTemplates.push(domainEntity1InterchangeItem);
    enhance(metaEd);
  });
  it('should generate entity with description', (): void => {
    expect(mergedInterchange.data.edfiInterchangeBrief.interchangeBriefEntities.length).toBe(1);
    const entity = mergedInterchange.data.edfiInterchangeBrief.interchangeBriefEntities[0];
    expect(entity).toBe(domainEntity1InterchangeItem);
    expect(entity.data.edfiInterchangeBrief.interchangeBriefDescription).toBe(interchangeLevelDomainEntity1Documentation);
  });
});
describe('when MergedInterchangeEntitiesEnhancer enhances mergedInterchange with multiple items', (): void => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntity2InterchangeItem);
    mergedInterchange.identityTemplates.push(domainEntity1InterchangeItem);
    enhance(metaEd);
  });
  it('should generate entities', (): void => {
    expect(mergedInterchange.data.edfiInterchangeBrief.interchangeBriefEntities.length).toBe(2);
  });
});
describe('when MergedInterchangeEntitiesEnhancer enhances mergedInterchange with element with bad markdown character', (): void => {
  const inputDocumentation = 'Documentation for logic (X | Y)';
  const escapedDocumentation = 'Documentation for logic (X \\| Y)';

  beforeAll(() => {
    setupRepository();
    interchangeLevelDomainEntity1.documentation = inputDocumentation;
    mergedInterchange.elements.push(domainEntity1InterchangeItem);
    enhance(metaEd);
  });
  it('should generate entity with description', (): void => {
    expect(mergedInterchange.data.edfiInterchangeBrief.interchangeBriefEntities.length).toBe(1);
    const entity = mergedInterchange.data.edfiInterchangeBrief.interchangeBriefEntities[0];
    expect(entity.data.edfiInterchangeBrief.interchangeBriefDescription).toBe(escapedDocumentation);
  });
});
