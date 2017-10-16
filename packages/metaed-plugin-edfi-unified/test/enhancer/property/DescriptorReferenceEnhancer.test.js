// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newDescriptorProperty, newDescriptor } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, DescriptorProperty, Descriptor } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/DescriptorReferenceEnhancer';

describe('when enhancing descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.descriptor.push(property);

    const parentEntity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.descriptor.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.descriptor.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});
