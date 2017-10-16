// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newSchoolYearEnumerationProperty, newSchoolYearEnumeration } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, SchoolYearEnumerationProperty, SchoolYearEnumeration } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/SchoolYearEnumerationReferenceEnhancer';

describe('when enhancing schoolYearEnumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: SchoolYearEnumerationProperty = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.schoolYearEnumeration.push(property);

    const parentEntity: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.schoolYearEnumeration.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.schoolYearEnumeration.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.schoolYearEnumeration.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});
