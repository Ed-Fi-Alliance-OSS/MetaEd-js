import * as R from 'ramda';
import { addProperty, newMetaEdEnvironment, newSharedString, newSharedStringProperty } from '@edfi/metaed-core';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/SharedStringPropertyEnhancer';

describe('when shared string property refers to a shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const metaEdName = 'ReferencedEntityName';

  const maxLength = '100';
  const minLength = '1';

  beforeAll(() => {
    const referencedEntity = Object.assign(newSharedString(), {
      metaEdName,
      maxLength,
      minLength,
    });

    const property = Object.assign(newSharedStringProperty(), {
      metaEdName,
      referencedEntity,
    });
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have the shared string restrictions', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter((p) => p.metaEdName === metaEdName));
    expect(property.maxLength).toBe(maxLength);
    expect(property.minLength).toBe(minLength);
  });
});
