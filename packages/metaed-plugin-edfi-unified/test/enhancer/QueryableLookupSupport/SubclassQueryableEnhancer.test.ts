import * as R from 'ramda';
import {
  addEntityForNamespace,
  newAssociation,
  newAssociationSubclass,
  newDomainEntity,
  newDomainEntitySubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/QueryableLookupSupport/SubclassQueryableEnhancer';

describe('when enhancing domain entity subclass queryables', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntitySubclassName1 = 'DomainEntitySubclassName2';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName4 = 'IntegerPropertyName4';

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    const integerProperty1 = Object.assign(newIntegerProperty(), {
      isPartOfIdentity: true,
      metaEdName: 'IntegerPropertyName1',
      namespace,
    });
    domainEntity1.properties.push(integerProperty1);
    domainEntity1.identityProperties.push(integerProperty1);

    const integerProperty2 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2, namespace });
    domainEntity1.properties.push(integerProperty2);
    domainEntity1.queryableFields.push(integerProperty2);
    addEntityForNamespace(domainEntity1);

    const domainEntitySubclass1 = Object.assign(newDomainEntitySubclass(), {
      metaEdName: domainEntitySubclassName1,
      baseEntityName: domainEntityName1,
      baseEntity: domainEntity1,
      namespace,
    });
    const integerProperty3 = Object.assign(newIntegerProperty(), {
      isPartOfIdentity: true,
      metaEdName: 'IntegerPropertyName3',
      namespace,
    });
    domainEntitySubclass1.properties.push(integerProperty3);
    domainEntitySubclass1.identityProperties.push(integerProperty3);

    const integerProperty4 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName4, namespace });
    domainEntitySubclass1.properties.push(integerProperty4);
    domainEntitySubclass1.queryableFields.push(integerProperty4);
    addEntityForNamespace(domainEntitySubclass1);

    enhance(metaEd);
  });

  it('should have both queryable fields', (): void => {
    const entity: any = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName1);
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    expect(entity.queryableFields).toHaveLength(2);
    expect(R.head(entity.queryableFields).metaEdName).toBe(integerPropertyName4);
    expect(R.last(entity.queryableFields).metaEdName).toBe(integerPropertyName2);
  });
});

describe('when enhancing domain entity subclass with identity rename of base class queryable', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntitySubclassName1 = 'DomainEntitySubclassName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    const integerProperty1 = Object.assign(newIntegerProperty(), {
      isPartOfIdentity: true,
      metaEdName: 'IntegerPropertyName1',
      namespace,
    });
    domainEntity1.properties.push(integerProperty1);
    domainEntity1.identityProperties.push(integerProperty1);
    domainEntity1.queryableFields.push(integerProperty1);
    addEntityForNamespace(domainEntity1);

    const domainEntitySubclass1 = Object.assign(newDomainEntitySubclass(), {
      metaEdName: domainEntitySubclassName1,
      baseEntityName: domainEntityName1,
      baseEntity: domainEntity1,
      namespace,
    });
    const integerProperty2 = Object.assign(newIntegerProperty(), {
      isPartOfIdentity: true,
      metaEdName: 'IntegerPropertyName2',
      namespace,
    });
    domainEntitySubclass1.properties.push(integerProperty2);
    domainEntitySubclass1.identityProperties.push(integerProperty2);

    const integerProperty3 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3, namespace });
    domainEntitySubclass1.properties.push(integerProperty3);
    domainEntitySubclass1.queryableFields.push(integerProperty3);
    addEntityForNamespace(domainEntitySubclass1);

    enhance(metaEd);
  });

  it('should have both queryable fields', (): void => {
    const entity: any = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName1);
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    expect(R.head(entity.queryableFields).metaEdName).toBe(integerPropertyName3);
  });
});

describe('when enhancing association subclass queryables', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const associationSubclassName1 = 'AssociationSubclassName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName4 = 'IntegerPropertyName4';

  beforeAll(() => {
    const associationName1 = 'AssociationName1';
    const association1 = Object.assign(newAssociation(), { metaEdName: associationName1, namespace });
    const integerProperty1 = Object.assign(newIntegerProperty(), {
      isPartOfIdentity: true,
      metaEdName: 'IntegerPropertyName1',
      namespace,
    });
    association1.properties.push(integerProperty1);
    association1.identityProperties.push(integerProperty1);

    const integerProperty2 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2, namespace });
    association1.properties.push(integerProperty2);
    association1.queryableFields.push(integerProperty2);
    addEntityForNamespace(association1);

    const associationSubclass1 = Object.assign(newAssociationSubclass(), {
      metaEdName: associationSubclassName1,
      baseEntityName: associationName1,
      baseEntity: association1,
      namespace,
    });
    const integerProperty3 = Object.assign(newIntegerProperty(), {
      isPartOfIdentity: true,
      metaEdName: 'IntegerPropertyName3',
      namespace,
    });
    associationSubclass1.properties.push(integerProperty3);
    associationSubclass1.identityProperties.push(integerProperty3);

    const integerProperty4 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName4, namespace });
    associationSubclass1.properties.push(integerProperty4);
    associationSubclass1.queryableFields.push(integerProperty4);
    addEntityForNamespace(associationSubclass1);

    enhance(metaEd);
  });

  it('should have both queryable fields', (): void => {
    const entity: any = namespace.entity.associationSubclass.get(associationSubclassName1);
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    expect(entity.queryableFields).toHaveLength(2);
    expect(R.head(entity.queryableFields).metaEdName).toBe(integerPropertyName4);
    expect(R.last(entity.queryableFields).metaEdName).toBe(integerPropertyName2);
  });
});

describe('when enhancing association subclass with identity rename of base class queryable', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const associationSubclassName1 = 'AssociationSubclassName1';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(() => {
    const associationName1 = 'AssociationName1';
    const integerPropertyName1 = 'IntegerPropertyName1';
    const association1 = Object.assign(newAssociation(), { metaEdName: associationName1, namespace });
    const integerProperty1 = Object.assign(newIntegerProperty(), {
      isPartOfIdentity: true,
      metaEdName: integerPropertyName1,
      namespace,
    });
    association1.properties.push(integerProperty1);
    association1.identityProperties.push(integerProperty1);
    association1.queryableFields.push(integerProperty1);

    const associationSubclass1 = Object.assign(newAssociationSubclass(), {
      metaEdName: associationSubclassName1,
      baseEntityName: associationName1,
      baseEntity: association1,
      namespace,
    });
    const integerProperty2 = Object.assign(newIntegerProperty(), {
      isIdentityRename: true,
      baseKeyName: integerPropertyName1,
      metaEdName: 'IntegerPropertyRename',
      namespace,
    });
    associationSubclass1.properties.push(integerProperty2);
    associationSubclass1.identityProperties.push(integerProperty2);

    const integerProperty3 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3, namespace });
    associationSubclass1.properties.push(integerProperty3);
    associationSubclass1.queryableFields.push(integerProperty3);
    addEntityForNamespace(associationSubclass1);

    enhance(metaEd);
  });

  it('should ignore renamed identity', (): void => {
    const entity: any = namespace.entity.associationSubclass.get(associationSubclassName1);
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    expect(R.head(entity.queryableFields).metaEdName).toBe(integerPropertyName3);
  });
});
