// @flow
import { newMetaEdEnvironment, newAssociation, newAssociationSubclass } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Association, AssociationSubclass } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/AssociationSubclassBaseClassEnhancer';

describe('when enhancing association subclass referring to association', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const childEntityName: string = 'ChildEntityName';
  let parentEntity: Association;
  let childEntity: AssociationSubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.association.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.associationSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});

describe('when enhancing association subclass referring to association subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const childEntityName: string = 'ChildEntityName';
  let parentEntity: AssociationSubclass;
  let childEntity: AssociationSubclass;

  beforeAll(() => {
    parentEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.associationSubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: childEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.associationSubclass.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});
