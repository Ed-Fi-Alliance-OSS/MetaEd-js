// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newCommonProperty, newCommon } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, CommonProperty, Common } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/CommonReferenceEnhancer';

describe('when enhancing common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.common.push(property);

    const parentEntity: Common = Object.assign(newCommon(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.common.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Common = Object.assign(newCommon(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.common.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.common.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});
