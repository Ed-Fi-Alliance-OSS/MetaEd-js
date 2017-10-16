// @flow
import { newMetaEdEnvironment, newAssociation, newAssociationSubclass, newAssociationExtension } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Association, AssociationSubclass, AssociationExtension } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/AssociationExtensionBaseClassEnhancer';

describe('when enhancing association extension referring to association', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  let parentEntity: Association;
  let childEntity: AssociationExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.association.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newAssociationExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.associationExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});

describe('when enhancing association extension referring to association subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  let parentEntity: AssociationSubclass;
  let childEntity: AssociationExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newAssociationSubclass(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.associationSubclass.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newAssociationExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.associationExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});
