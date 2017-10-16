// @flow
import { newMetaEdEnvironment, newDecimalProperty, newSharedDecimalProperty, newDecimalType } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, DecimalProperty, SharedDecimalProperty, DecimalType } from '../../../../metaed-core/index';
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

  it('should have no validation failures()', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(referencedEntity.referringSimpleProperties).toContain(property);
  });
});

describe('when enhancing shared decimal property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: SharedDecimalProperty;
  let referencedEntity: DecimalType;

  beforeAll(() => {
    property = Object.assign(newSharedDecimalProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.sharedDecimal.push(property);

    referencedEntity = Object.assign(newDecimalType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.decimalType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(referencedEntity.referringSimpleProperties).toContain(property);
  });
});
