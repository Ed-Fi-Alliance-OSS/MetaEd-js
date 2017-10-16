// @flow
import { newMetaEdEnvironment, newDomainEntity, newDomainEntitySubclass, newDomainEntityExtension } from '../../../metaed-core/index';
import type { MetaEdEnvironment, DomainEntity, DomainEntitySubclass, DomainEntityExtension } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/DomainEntityExtensionBaseClassEnhancer';

describe('when enhancing domainEntity extension referring to domainEntity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  let parentEntity: DomainEntity;
  let childEntity: DomainEntityExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.domainEntity.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newDomainEntityExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.domainEntityExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});

describe('when enhancing domainEntity extension referring to domainEntity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  let parentEntity: DomainEntitySubclass;
  let childEntity: DomainEntityExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newDomainEntitySubclass(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.domainEntitySubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newDomainEntityExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.domainEntityExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});
