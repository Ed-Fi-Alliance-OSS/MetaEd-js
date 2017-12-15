// @flow
import {
  newMetaEdEnvironment,
  newDecimalProperty,
  newSharedDecimalProperty,
  newDecimalType,
  newSharedDecimal,
  NoSharedSimple,
} from 'metaed-core';
import type {
  DecimalProperty,
  DecimalType,
  MetaEdEnvironment,
  SharedDecimal,
  SharedDecimalProperty,
} from 'metaed-core';
import { enhance } from '../../../src/enhancer/property/DecimalReferenceEnhancer';

describe('when enhancing decimal property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: DecimalProperty;
  let referencedEntity: DecimalType;

  beforeAll(() => {
    property = Object.assign(newDecimalProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.decimal.push(property);

    referencedEntity = Object.assign(newDecimalType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.decimalType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have property with no referenced entity', () => {
    expect(property.referencedEntity).toBe(NoSharedSimple);
  });

  it('should have decimal type with no referring properties', () => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared decimal property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: SharedDecimalProperty;
  let referencedEntity: SharedDecimal;
  let decimalType: DecimalType;

  beforeAll(() => {
    property = Object.assign(newSharedDecimalProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedDecimal.push(property);

    referencedEntity = Object.assign(newSharedDecimal(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.sharedDecimal.set(referencedEntity.metaEdName, referencedEntity);

    decimalType = Object.assign(newDecimalType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.decimalType.set(referencedEntity.metaEdName, decimalType);

    enhance(metaEd);
  });

  it('should have property with correct referenced entity', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should have decimal type with correct referring properties', () => {
    expect(decimalType.referringSimpleProperties).toContain(property);
  });
});
