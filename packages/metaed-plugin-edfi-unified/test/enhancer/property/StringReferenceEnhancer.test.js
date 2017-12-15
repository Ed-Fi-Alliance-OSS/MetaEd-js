// @flow
import {
  newMetaEdEnvironment,
  newStringProperty,
  newSharedStringProperty,
  newStringType,
  newSharedString,
  NoSharedSimple,
} from 'metaed-core';
import type {
  MetaEdEnvironment,
  SharedString,
  SharedStringProperty,
  StringProperty,
  StringType,
} from 'metaed-core';
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

  it('should have property with no referenced entity', () => {
    expect(property.referencedEntity).toBe(NoSharedSimple);
  });

  it('should have string type with no referring properties', () => {
    expect(referencedEntity.referringSimpleProperties).toEqual([]);
  });
});

describe('when enhancing shared string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityName: string = 'ReferencedEntityName';
  let property: SharedStringProperty;
  let referencedEntity: SharedString;
  let stringType: StringType;

  beforeAll(() => {
    property = Object.assign(newSharedStringProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
      referencedType: referencedEntityName,
    });
    metaEd.propertyIndex.sharedString.push(property);

    referencedEntity = Object.assign(newSharedString(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.sharedString.set(referencedEntity.metaEdName, referencedEntity);

    stringType = Object.assign(newStringType(), {
      metaEdName: referencedEntityName,
    });
    metaEd.entity.stringType.set(referencedEntity.metaEdName, stringType);

    enhance(metaEd);
  });

  it('should have property with correct referenced entity', () => {
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should have string type with correct referring properties', () => {
    expect(stringType.referringSimpleProperties).toContain(property);
  });
});
