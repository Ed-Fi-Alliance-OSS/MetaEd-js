// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newSharedDecimalProperty, newDecimalType, addProperty } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/enhancer/SharedDecimalPropertyEnhancer';

describe('when shared decimal property refers to a shared decimal', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const metaEdName: string = 'ReferencedEntityName';

  const totalDigits = '5';
  const decimalPlaces = '4';
  const maxValue = '100';
  const minValue = '1';

  beforeAll(() => {
    const referencedEntity = Object.assign(newDecimalType(), {
      metaEdName, totalDigits, decimalPlaces, maxValue, minValue,
    });

    const property = Object.assign(newSharedDecimalProperty(), {
      metaEdName,
      referencedEntity,
    });
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have the shared decimal restrictions', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(p => p.metaEdName === metaEdName));
    expect(property.totalDigits).toBe(totalDigits);
    expect(property.decimalPlaces).toBe(decimalPlaces);
    expect(property.maxValue).toBe(maxValue);
    expect(property.minValue).toBe(minValue);
  });
});
