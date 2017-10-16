// @flow
import R from 'ramda';
import {
  addEntity,
  newAssociation,
  newAssociationSubclass,
  newDomainEntity,
  newDomainEntitySubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/QueryableLookupSupport/SubclassQueryableEnhancer';

describe('when enhancing domain entity subclass queryables', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntitySubclassName1 = 'DomainEntitySubclassName2';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName4 = 'IntegerPropertyName4';

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1 });
    const integerProperty1 = Object.assign(newIntegerProperty(), { isPartOfIdentity: true, metaEdName: 'IntegerPropertyName1' });
    domainEntity1.properties.push(integerProperty1);
    domainEntity1.identityProperties.push(integerProperty1);

    const integerProperty2 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 });
    domainEntity1.properties.push(integerProperty2);
    domainEntity1.queryableFields.push(integerProperty2);
    addEntity(metaEd.entity, domainEntity1);

    const domainEntitySubclass1 = Object.assign(newDomainEntitySubclass(), { metaEdName: domainEntitySubclassName1, baseEntityName: domainEntityName1, baseEntity: domainEntity1 });
    const integerProperty3 = Object.assign(newIntegerProperty(), { isPartOfIdentity: true, metaEdName: 'IntegerPropertyName3' });
    domainEntitySubclass1.properties.push(integerProperty3);
    domainEntitySubclass1.identityProperties.push(integerProperty3);

    const integerProperty4 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName4 });
    domainEntitySubclass1.properties.push(integerProperty4);
    domainEntitySubclass1.queryableFields.push(integerProperty4);
    addEntity(metaEd.entity, domainEntitySubclass1);

    enhance(metaEd);
  });

  it('should have both queryable fields', () => {
    const entity = metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName1);
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    // $FlowIgnore - entity could be null
    expect(entity.queryableFields).toHaveLength(2);
    // $FlowIgnore - entity could be null
    expect(R.head(entity.queryableFields).metaEdName).toBe(integerPropertyName4);
    // $FlowIgnore - entity could be null
    expect(R.last(entity.queryableFields).metaEdName).toBe(integerPropertyName2);
  });
});

describe('when enhancing domain entity subclass with identity rename of base class queryable', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntitySubclassName1 = 'DomainEntitySubclassName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1 });
    const integerProperty1 = Object.assign(newIntegerProperty(), { isPartOfIdentity: true, metaEdName: 'IntegerPropertyName1' });
    domainEntity1.properties.push(integerProperty1);
    domainEntity1.identityProperties.push(integerProperty1);
    domainEntity1.queryableFields.push(integerProperty1);
    addEntity(metaEd.entity, domainEntity1);

    const domainEntitySubclass1 = Object.assign(newDomainEntitySubclass(), { metaEdName: domainEntitySubclassName1, baseEntityName: domainEntityName1, baseEntity: domainEntity1 });
    const integerProperty2 = Object.assign(newIntegerProperty(), { isPartOfIdentity: true, metaEdName: 'IntegerPropertyName2' });
    domainEntitySubclass1.properties.push(integerProperty2);
    domainEntitySubclass1.identityProperties.push(integerProperty2);

    const integerProperty3 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 });
    domainEntitySubclass1.properties.push(integerProperty3);
    domainEntitySubclass1.queryableFields.push(integerProperty3);
    addEntity(metaEd.entity, domainEntitySubclass1);

    enhance(metaEd);
  });

  it('should have both queryable fields', () => {
    const entity = metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName1);
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    // $FlowIgnore - entity could be null
    expect(R.head(entity.queryableFields).metaEdName).toBe(integerPropertyName3);
  });
});

describe('when enhancing association subclass queryables', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationSubclassName1 = 'AssociationSubclassName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName4 = 'IntegerPropertyName4';

  beforeAll(() => {
    const associationName1 = 'AssociationName1';
    const association1 = Object.assign(newAssociation(), { metaEdName: associationName1 });
    const integerProperty1 = Object.assign(newIntegerProperty(), { isPartOfIdentity: true, metaEdName: 'IntegerPropertyName1' });
    association1.properties.push(integerProperty1);
    association1.identityProperties.push(integerProperty1);

    const integerProperty2 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 });
    association1.properties.push(integerProperty2);
    association1.queryableFields.push(integerProperty2);
    addEntity(metaEd.entity, association1);

    const associationSubclass1 = Object.assign(newAssociationSubclass(), { metaEdName: associationSubclassName1, baseEntityName: associationName1, baseEntity: association1 });
    const integerProperty3 = Object.assign(newIntegerProperty(), { isPartOfIdentity: true, metaEdName: 'IntegerPropertyName3' });
    associationSubclass1.properties.push(integerProperty3);
    associationSubclass1.identityProperties.push(integerProperty3);

    const integerProperty4 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName4 });
    associationSubclass1.properties.push(integerProperty4);
    associationSubclass1.queryableFields.push(integerProperty4);
    addEntity(metaEd.entity, associationSubclass1);

    enhance(metaEd);
  });

  it('should have both queryable fields', () => {
    const entity = metaEd.entity.associationSubclass.get(associationSubclassName1);
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    // $FlowIgnore - entity could be null
    expect(entity.queryableFields).toHaveLength(2);
    // $FlowIgnore - entity could be null
    expect(R.head(entity.queryableFields).metaEdName).toBe(integerPropertyName4);
    // $FlowIgnore - entity could be null
    expect(R.last(entity.queryableFields).metaEdName).toBe(integerPropertyName2);
  });
});

describe('when enhancing association subclass with identity rename of base class queryable', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationSubclassName1 = 'AssociationSubclassName1';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(() => {
    const associationName1 = 'AssociationName1';
    const integerPropertyName1 = 'IntegerPropertyName1';
    const association1 = Object.assign(newAssociation(), { metaEdName: associationName1 });
    const integerProperty1 = Object.assign(newIntegerProperty(), { isPartOfIdentity: true, metaEdName: integerPropertyName1 });
    association1.properties.push(integerProperty1);
    association1.identityProperties.push(integerProperty1);
    association1.queryableFields.push(integerProperty1);

    const associationSubclass1 = Object.assign(newAssociationSubclass(), { metaEdName: associationSubclassName1, baseEntityName: associationName1, baseEntity: association1 });
    const integerProperty2 = Object.assign(newIntegerProperty(), { isIdentityRename: true, baseKeyName: integerPropertyName1, metaEdName: 'IntegerPropertyRename' });
    associationSubclass1.properties.push(integerProperty2);
    associationSubclass1.identityProperties.push(integerProperty2);

    const integerProperty3 = Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 });
    associationSubclass1.properties.push(integerProperty3);
    associationSubclass1.queryableFields.push(integerProperty3);
    addEntity(metaEd.entity, associationSubclass1);

    enhance(metaEd);
  });

  it('should ignore renamed identity', () => {
    const entity = metaEd.entity.associationSubclass.get(associationSubclassName1);
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    // $FlowIgnore - entity could be null
    expect(R.head(entity.queryableFields).metaEdName).toBe(integerPropertyName3);
  });
});
