// @flow
import { newMetaEdEnvironment, newStringProperty, newSharedStringProperty, newStringType } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, StringProperty, SharedStringProperty, StringType } from '../../../../metaed-core/index';
import { enhance } from '../../../src/enhancer/property/StringReferenceEnhancer';


describe('when enhancing string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: StringProperty;
  let referencedEntity: StringType;

  beforeAll(() => {
    property = Object.assign(newStringProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.string.push(property);

    referencedEntity = Object.assign(newStringType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.stringType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(referencedEntity.referringSimpleProperties).toContain(property);
  });
});

describe('when enhancing shared string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: SharedStringProperty;
  let referencedEntity: StringType;

  beforeAll(() => {
    property = Object.assign(newSharedStringProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
    });
    metaEd.propertyIndex.sharedString.push(property);

    referencedEntity = Object.assign(newStringType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.stringType.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
    expect(referencedEntity.referringSimpleProperties).toContain(property);
  });
});
