// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newDomainEntityProperty, newDomainEntity, newDomainEntitySubclass } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, DomainEntityProperty, DomainEntity, DomainEntitySubclass } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/DomainEntityReferenceEnhancer';

describe('when enhancing domainEntity property referring to domainEntity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.domainEntity.push(property);

    const parentEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.domainEntity.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.domainEntity.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});

describe('when enhancing domainEntity property referring to subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.domainEntity.push(property);

    const parentEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.domainEntity.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.domainEntitySubclass.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});
