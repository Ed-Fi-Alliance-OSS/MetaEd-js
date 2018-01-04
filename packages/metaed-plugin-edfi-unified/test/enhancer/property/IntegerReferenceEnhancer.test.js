// @flow
import {
  newMetaEdEnvironment,
  newIntegerProperty,
  newSharedIntegerProperty,
  newIntegerType,
  newSharedInteger,
  NoSharedSimple,
} from 'metaed-core';
import type { IntegerProperty, IntegerType, MetaEdEnvironment, SharedInteger, SharedIntegerProperty } from 'metaed-core';
import { enhance } from '../../../src/enhancer/property/IntegerReferenceEnhancer';

describe('when enhancing integer property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: IntegerProperty;
  let referencedEntity: IntegerType;

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.integer.push(property);

    referencedEntity = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.integerType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have property with no referenced entity', () => {
    expect(property.referencedEntity).toBe(NoSharedSimple);
  });

  it('should have integer type with no referring properties', () => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared integer property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: SharedIntegerProperty;
  let referencedEntity: SharedInteger;
  let integerType: IntegerType;

  beforeAll(() => {
    property = Object.assign(newSharedIntegerProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedInteger.push(property);

    referencedEntity = Object.assign(newSharedInteger(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.sharedInteger.set(referencedEntity.metaEdName, referencedEntity);

    integerType = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.integerType.set(referencedEntity.metaEdName, integerType);

    enhance(metaEd);
  });

  it('should have property with correct referenced entity', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should have integer type with correct referring properties', () => {
    expect(integerType.referringSimpleProperties).toContain(property);
  });
});
