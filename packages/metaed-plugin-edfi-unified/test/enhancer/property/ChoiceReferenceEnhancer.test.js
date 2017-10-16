// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newChoiceProperty, newChoice } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ChoiceProperty, Choice } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/ChoiceReferenceEnhancer';

describe('when enhancing choice property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const property: ChoiceProperty = Object.assign(newChoiceProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.choice.push(property);

    const parentEntity: Choice = Object.assign(newChoice(), {
      metaEdName: parentEntityName,
      properties: [property],
    });
    metaEd.entity.choice.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Choice = Object.assign(newChoice(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.choice.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.choice.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
  });
});
