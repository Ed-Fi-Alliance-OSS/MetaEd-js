// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newEnumerationProperty, newEnumeration } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, EnumerationProperty, Enumeration } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/EnumerationReferenceEnhancer';

describe('when enhancing enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.enumeration.push(property);

    const parentEntity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.enumeration.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.enumeration.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});
