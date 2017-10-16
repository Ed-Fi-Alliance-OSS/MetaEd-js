// @flow
import { newMetaEdEnvironment, newShortProperty, newSharedShortProperty, newIntegerType } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ShortProperty, SharedShortProperty, IntegerType } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/ShortReferenceEnhancer';


describe('when enhancing short property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: ShortProperty;
  let referencedEntity: IntegerType;

  beforeAll(() => {
    property = Object.assign(newShortProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.short.push(property);

    referencedEntity = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.integerType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(referencedEntity.referringSimpleProperties).toContain(property);
  });
});

describe('when enhancing shared short property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: SharedShortProperty;
  let referencedEntity: IntegerType;

  beforeAll(() => {
    property = Object.assign(newSharedShortProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.sharedShort.push(property);

    referencedEntity = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.integerType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(referencedEntity.referringSimpleProperties).toContain(property);
  });
});
