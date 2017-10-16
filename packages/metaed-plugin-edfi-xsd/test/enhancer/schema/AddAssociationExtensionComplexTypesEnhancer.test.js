// @flow
import {
  newMetaEdEnvironment,
  newAssociation,
  newAssociationExtension,
  newNamespaceInfo,
  newCommon,
  newCommonExtension,
  newCommonProperty,
  newStringProperty,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, AssociationExtension } from '../../../../metaed-core/index';
import type { Element } from '../../../src/model/schema/Element';
import type { ComplexType } from '../../../src/model/schema/ComplexType';
import { NoComplexType } from '../../../src/model/schema/ComplexType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { restrictionSuffix } from '../../../src/enhancer/schema/AddComplexTypesBaseEnhancer';
import { enhance as initializeTopLevelEntities } from '../../../src/model/TopLevelEntity';
import { enhance } from '../../../src/enhancer/schema/AddAssociationExtensionComplexTypesEnhancer';

describe('when enhancing association extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseTypeName: string = 'BaseTypeName';
  const complexTypeName: string = 'ComplexTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: AssociationExtension;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const baseEntity = Object.assign(newAssociation(), {
      metaEdName: baseTypeName,
      documentation,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(baseEntity);
    metaEd.entity.association.set(baseEntity.metaEdName, baseEntity);

    enhancedItem = Object.assign(newAssociationExtension(), {
      metaEdName: complexTypeName,
      documentation,
      baseEntity,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.associationExtension.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
    createdReferenceType = enhancedItem.data.edfiXsd.xsd_ReferenceType;
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
    expect(createdComplexType.annotation.typeGroup).toBe('Association');
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
    expect(createdReferenceType).toBe(NoComplexType);
  });

  it('should not create identity type', () => {
    expect(createdIdentityType).toBe(NoComplexType);
  });
});

describe('when enhancing association extension with common type override', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const baseAssociationName: string = 'BaseAssociationName';
  const associationExtensionName: string = 'AssociationExtensionName';
  const baseCommonTypeName: string = 'BaseCommonTypeName';
  const commonTypeExtensionName: string = 'CommonTypeExtensionName';
  const otherPropertyOnExtensionName: string = 'OtherPropertyOnExtensionName';
  const otherPropertyOnAssociationName: string = 'OtherPropertyOnAssociationName';

  const documentation: string = 'Documentation';
  let createdRestrictionComplexType: ComplexType;
  let createdExtensionComplexType: ComplexType;

  beforeAll(() => {
    const extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      projectExtension,
      isExtension: true,
    });

    const baseCommon = Object.assign(newCommon(), {
      metaEdName: baseCommonTypeName,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(baseCommon);
    metaEd.entity.common.set(baseCommon.metaEdName, baseCommon);

    const commonExtension = Object.assign(newCommonExtension(), {
      metaEdName: commonTypeExtensionName,
      baseEntityName: baseCommonTypeName,
      baseEntity: baseCommon,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(commonExtension);
    metaEd.entity.commonExtension.set(commonExtension.metaEdName, commonExtension);

    const baseAssociation = Object.assign(newAssociation(), {
      metaEdName: baseAssociationName,
      properties: [
        Object.assign(newCommonProperty(), {
          metaEdName: baseCommonTypeName,
          isExtensionOverride: false,
          data: {
            edfiXsd: {
              xsd_Name: baseCommonTypeName,
            },
          },
        }),
        Object.assign(newStringProperty(), {
          metaEdName: otherPropertyOnAssociationName,
          data: {
            edfiXsd: {
              xsd_Name: otherPropertyOnAssociationName,
            },
          },
        }),
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(baseAssociation);
    metaEd.entity.association.set(baseAssociation.metaEdName, baseAssociation);

    const associationExtension = Object.assign(newAssociationExtension(), {
      metaEdName: associationExtensionName,
      documentation,
      baseEntity: baseAssociation,
      namespaceInfo: extensionNamespaceInfo,
      properties: [
        Object.assign(newCommonProperty(), {
          metaEdName: baseCommonTypeName,
          isExtensionOverride: true,
          data: {
            edfiXsd: {
              xsd_Name: baseCommonTypeName,
            },
          },
        }),
        Object.assign(newStringProperty(), {
          metaEdName: otherPropertyOnExtensionName,
          data: {
            edfiXsd: {
              xsd_Name: otherPropertyOnExtensionName,
            },
          },
        }),
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(associationExtension);
    metaEd.entity.associationExtension.set(associationExtension.metaEdName, associationExtension);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(associationExtension.data.edfiXsd.xsd_ComplexTypes.length).toBe(2);
    createdRestrictionComplexType = associationExtension.data.edfiXsd.xsd_ComplexTypes[0];
    createdExtensionComplexType = associationExtension.data.edfiXsd.xsd_ComplexTypes[1];
  });

  it('should have annotation documentation assigned on extension complex type', () => {
    expect(createdExtensionComplexType.annotation).toBeDefined();
    expect(createdExtensionComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned on extension complex type', () => {
    expect(createdExtensionComplexType.annotation.typeGroup).toBe('Association');
  });

  it('should have base type assigned on extension complex type', () => {
    expect(createdExtensionComplexType.baseType).toBe(`${projectExtension}-${baseAssociationName}${restrictionSuffix}`);
  });

  it('should have name assigned on extension complex type', () => {
    expect(createdExtensionComplexType.name).toBe(`${projectExtension}-${associationExtensionName}`);
  });

  it('should have items on extension complex type', () => {
    expect(createdExtensionComplexType.items.length).toBe(2);
    expect(((createdExtensionComplexType.items[0]: any): Element).name).toBe(baseCommonTypeName);
    expect(((createdExtensionComplexType.items[1]: any): Element).name).toBe(otherPropertyOnExtensionName);
  });

  it('should have annotation documentation assigned on restriction complex type', () => {
    expect(createdRestrictionComplexType.annotation).toBeDefined();
    expect(createdRestrictionComplexType.annotation.documentation).toMatchSnapshot();
  });

  it('should not have annotation type group assigned on restriction complex type', () => {
    expect(createdRestrictionComplexType.annotation.typeGroup).toBe('');
  });

  it('should have base type assigned on restriction complex type', () => {
    expect(createdRestrictionComplexType.baseType).toBe(baseAssociationName);
  });

  it('should have name assigned on restriction complex type', () => {
    expect(createdRestrictionComplexType.name).toBe(`${projectExtension}-${baseAssociationName}${restrictionSuffix}`);
  });

  it('should have items on restriction complex type', () => {
    expect(createdRestrictionComplexType.items.length).toBe(1);
    expect(((createdRestrictionComplexType.items[0]: any): Element).name).toBe(otherPropertyOnAssociationName);
  });
});
