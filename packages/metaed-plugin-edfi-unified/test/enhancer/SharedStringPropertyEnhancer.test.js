// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newSharedStringProperty, newStringType, addProperty } from '../../../metaed-core/index';
import type { MetaEdEnvironment } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/SharedStringPropertyEnhancer';

describe('when shared string property refers to a shared string', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const metaEdName: string = 'ReferencedEntityName';

  const maxLength = '100';
  const minLength = '1';

  beforeAll(() => {
    const referencedEntity = Object.assign(newStringType(), {
      metaEdName, maxLength, minLength,
    });

    const property = Object.assign(newSharedStringProperty(), {
      metaEdName,
      referencedEntity,
    });
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have the shared string restrictions', () => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter(p => p.metaEdName === metaEdName));
    expect(property.maxLength).toBe(maxLength);
    expect(property.minLength).toBe(minLength);
  });
});
