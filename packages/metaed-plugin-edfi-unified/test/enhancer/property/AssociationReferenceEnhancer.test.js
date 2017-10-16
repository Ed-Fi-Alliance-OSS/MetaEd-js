// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newAssociationProperty, newAssociation, newAssociationSubclass } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, AssociationProperty, Association, AssociationSubclass } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/AssociationReferenceEnhancer';

describe('when enhancing association property referring to association', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: AssociationProperty = Object.assign(newAssociationProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.association.push(property);

    const parentEntity: Association = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.association.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Association = Object.assign(newAssociation(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.association.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.association.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});

describe('when enhancing association property referring to subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: AssociationProperty = Object.assign(newAssociationProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.association.push(property);

    const parentEntity: Association = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.association.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.associationSubclass.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.association.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});
