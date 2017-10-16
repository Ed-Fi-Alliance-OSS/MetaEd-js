// @flow
import { newMetaEdEnvironment, newDomainEntity, newDomainEntitySubclass } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, DomainEntitySubclass } from '../../../../metaed-core/index';
import type { ComplexType } from '../../../src/model/schema/ComplexType';
import { NoComplexType } from '../../../src/model/schema/ComplexType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance as initializeTopLevelEntities } from '../../../src/model/TopLevelEntity';
import { enhance } from '../../../src/enhancer/schema/AddDomainEntitySubclassComplexTypesEnhancer';

describe('when enhancing domainEntity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseTypeName: string = 'BaseTypeName';
  const complexTypeName: string = 'ComplexTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: DomainEntitySubclass;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const baseEntity = Object.assign(newDomainEntity(), {
      metaEdName: baseTypeName,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(baseEntity);
    metaEd.entity.domainEntity.set(baseEntity.metaEdName, baseEntity);

    enhancedItem = Object.assign(newDomainEntitySubclass(), {
      metaEdName: complexTypeName,
      documentation,
      baseEntity,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.domainEntitySubclass.set(enhancedItem.metaEdName, enhancedItem);

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
    expect(createdComplexType.annotation.typeGroup).toBe('Domain Entity');
  });

  it('should have base type assigned', () => {
    expect(createdComplexType.baseType).toBe(baseTypeName);
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
