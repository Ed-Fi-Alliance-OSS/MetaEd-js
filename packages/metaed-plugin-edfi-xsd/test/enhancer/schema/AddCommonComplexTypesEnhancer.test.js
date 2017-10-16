// @flow
import { newMetaEdEnvironment, newCommon } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, Common } from '../../../../metaed-core/index';
import type { ComplexType } from '../../../src/model/schema/ComplexType';
import { NoComplexType } from '../../../src/model/schema/ComplexType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance as initializeTopLevelEntities } from '../../../src/model/TopLevelEntity';
import { enhance } from '../../../src/enhancer/schema/AddCommonComplexTypesEnhancer';

describe('when enhancing common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const complexTypeName: string = 'ComplexTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: Common;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    enhancedItem = Object.assign(newCommon(), {
      metaEdName: complexTypeName,
      documentation,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.common.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
    createdReferenceType = enhancedItem.data.edfiXsd.xsd_ReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsd_LookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsd_IdentityType;
  });

  it('should create complex type', () => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', () => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', () => {
    expect(createdComplexType.annotation.typeGroup).toBe('Common');
  });

  it('should not have base type assigned', () => {
    expect(createdComplexType.baseType).toBe('');
  });

  it('should have name assigned', () => {
    expect(createdComplexType.name).toBe(complexTypeName);
  });

  it('should not have items', () => {
    expect(createdComplexType.items.length).toBe(0);
  });

  it('should create reference type', () => {
    expect(createdReferenceType).toBeDefined();
  });

  it('should not create identity type', () => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', () => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});
