import R from 'ramda';
import {
  addProperty,
  newMetaEdEnvironment,
  newSharedInteger,
  newSharedIntegerProperty,
  newSharedShortProperty,
} from 'metaed-core';
import { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/enhancer/SharedIntegerPropertyEnhancer';

describe('when shared integer property refers to a shared integer', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const metaEdName = 'ReferencedEntityName';

  const maxValue = '100';
  const minValue = '1';

  beforeAll(() => {
    const referencedEntity = Object.assign(newSharedInteger(), {
      metaEdName,
      maxValue,
      minValue,
    });

    const property = Object.assign(newSharedIntegerProperty(), {
      metaEdName,
      referencedEntity,
    });
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have the shared integer restrictions', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(p => p.metaEdName === metaEdName));
    expect(property.maxValue).toBe(maxValue);
    expect(property.minValue).toBe(minValue);
  });
});

describe('when shared short property refers to a shared short', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const metaEdName = 'ReferencedEntityName';

  const maxValue = '100';
  const minValue = '1';

  beforeAll(() => {
    const referencedEntity = Object.assign(newSharedInteger(), {
      metaEdName,
      maxValue,
      minValue,
    });

    const property = Object.assign(newSharedShortProperty(), {
      metaEdName,
      referencedEntity,
    });
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have the shared integer restrictions', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter(p => p.metaEdName === metaEdName));
    expect(property.maxValue).toBe(maxValue);
    expect(property.minValue).toBe(minValue);
  });
});
