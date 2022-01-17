import {
  MetaEdEnvironment,
  DomainEntity,
  Association,
  Namespace,
  newMetaEdEnvironment,
  newDomainEntity,
  newAssociation,
  addEntityForNamespace,
  newNamespace,
} from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/DomainEntityExampleNameEnhancer';
import { enhance as initialize } from '../../src/model/TopLevelEntity';

const NoDomainEntity: DomainEntity = {
  ...newDomainEntity(),
  metaEdName: 'NoDomainEntity',
};

export const NoAssociation: Association = {
  ...newAssociation(),
  metaEdName: 'NoAssociation',
};

// Focused unit test confirming prefix added for domain entities
describe('when enhancing domain entity', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'example' };
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.0.0' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const entityName = 'EntityName';

  // example usage of singleton null top level entity -- null is rarely permitted
  let domainEntity: DomainEntity = NoDomainEntity;

  beforeAll(() => {
    domainEntity = {
      ...newDomainEntity(),
      metaEdName: entityName,
      namespace,
    };
    addEntityForNamespace(domainEntity);

    initialize(metaEd);
    enhance(metaEd);
  });

  it('should add an "Example" prefix', (): void => {
    expect(domainEntity.data.orgExample.exampleName).toBe(`Example${entityName}`);
  });
});

// Focused unit test confirming prefix not added for associations
describe('when enhancing association', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'example' };
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.0.0' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const entityName = 'EntityName';

  // example usage of singleton null top level entity -- null is rarely permitted
  let association: Association = NoAssociation;

  beforeAll(() => {
    association = {
      ...newAssociation(),
      metaEdName: entityName,
      namespace,
    };
    addEntityForNamespace(association);

    enhance(metaEd);
  });

  it('should not add an "Example" prefix', (): void => {
    expect(association.data.orgExample).toBeUndefined();
  });
});

// Focused unit test confirming prefix not added for domain entities on 2.0 data standard
describe('when enhancing domain entity for DS 2.0', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'example' };
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '2.0.0' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const entityName = 'EntityName';

  // example usage of singleton null top level entity -- null is rarely permitted
  let domainEntity: DomainEntity = NoDomainEntity;

  beforeAll(() => {
    domainEntity = {
      ...newDomainEntity(),
      metaEdName: entityName,
      namespace,
    };
    addEntityForNamespace(domainEntity);

    enhance(metaEd);
  });

  it('should not add an "Example" prefix', (): void => {
    expect(domainEntity.data.orgExample).toBeUndefined();
  });
});
