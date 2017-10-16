// @flow
import { newMetaEdEnvironment, newDomainEntity, newDomainEntitySubclass } from '../../../metaed-core/index';
import type { MetaEdEnvironment, DomainEntity, DomainEntitySubclass } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/DomainEntitySubclassBaseClassEnhancer';

describe('when enhancing domainEntity subclass referring to domainEntity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const childEntityName: string = 'ChildEntityName';
  let parentEntity: DomainEntity;
  let childEntity: DomainEntitySubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.domainEntity.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.domainEntitySubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});

describe('when enhancing domainEntity subclass referring to domainEntity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const childEntityName: string = 'ChildEntityName';
  let parentEntity: DomainEntitySubclass;
  let childEntity: DomainEntitySubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.domainEntitySubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.domainEntitySubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});
