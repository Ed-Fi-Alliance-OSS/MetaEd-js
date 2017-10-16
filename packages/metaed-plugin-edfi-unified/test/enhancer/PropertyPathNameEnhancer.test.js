// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newDomainEntity, newDomainEntityProperty, addEntity, addProperty } from '../../../metaed-core/index';
import type { MetaEdEnvironment } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/PropertyPathNameEnhancer';

describe('when enhancing entity property without with context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const property = Object.assign(newDomainEntityProperty(), {
      metaEdName: propertyName,
      parentEntityName,
    });

    const parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
    });

    addEntity(metaEd.entity, parentEntity);
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have correct property path', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === propertyName));
    expect(property.propertyPathName).toBe(propertyName);
  });
});

describe('when enhancing entity property with a with context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const propertyName: string = 'PropertyName';
  const withContext: string = 'WithContext';

  beforeAll(() => {
    const property = Object.assign(newDomainEntityProperty(), {
      metaEdName: propertyName,
      parentEntityName,
      withContext,
    });

    const parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
    });

    addEntity(metaEd.entity, parentEntity);
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have correct property path', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === propertyName));
    expect(property.propertyPathName).toBe(withContext + propertyName);
  });
});

describe('when enhancing entity property with identical with context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const propertyName: string = 'PropertyName';
  const withContext: string = propertyName;

  beforeAll(() => {
    const property = Object.assign(newDomainEntityProperty(), {
      metaEdName: propertyName,
      parentEntityName,
      withContext,
    });

    const parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
    });

    addEntity(metaEd.entity, parentEntity);
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have correct property path', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === propertyName));
    expect(property.propertyPathName).toBe(withContext);
  });
});
