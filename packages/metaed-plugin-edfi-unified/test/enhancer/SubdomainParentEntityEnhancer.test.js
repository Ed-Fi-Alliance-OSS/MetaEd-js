// @flow
import { newMetaEdEnvironment, newDomain, newSubdomain, addEntity } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Domain, Subdomain } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/SubdomainParentEntityEnhancer';

describe('when enhancing subdomain with parent', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const childEntityName: string = 'ChildEntityName';
  let parentEntity: Domain;
  let childEntity: Subdomain;

  beforeAll(() => {
    parentEntity = Object.assign(newDomain(), {
      metaEdName: parentEntityName,
    });
    addEntity(metaEd.entity, parentEntity);

    childEntity = Object.assign(newSubdomain(), {
      metaEdName: childEntityName,
      parentMetaEdName: parentEntityName,
    });
    addEntity(metaEd.entity, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.parent).toBe(parentEntity);
  });
});
