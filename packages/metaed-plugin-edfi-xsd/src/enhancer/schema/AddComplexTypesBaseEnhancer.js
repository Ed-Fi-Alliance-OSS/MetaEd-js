// @flow
import { String as sugar } from 'sugar';
import type { TopLevelEntity, EntityProperty, CommonProperty } from 'metaed-core';
import { prependIndefiniteArticle } from 'metaed-core';
import type { ComplexType } from '../../model/schema/ComplexType';
import { newComplexType, NoComplexType } from '../../model/schema/ComplexType';
import { newAnnotation } from '../../model/schema/Annotation';
import { newElement } from '../../model/schema/Element';
import { createSchemaComplexTypeItems } from '../../enhancer/schema/XsdElementFromPropertyCreator';

export const restrictionSuffix = 'Restriction';
export const typeGroupDomainEntity = 'Domain Entity';
export const typeGroupAssociation = 'Association';
export const typeGroupCommon = 'Common';
export const typeGroupDescriptor = 'Descriptor';
export const typeGroupExtendedReference = 'Extended Reference';
export const typeGroupDescriptorExtendedReference = 'Extended Descriptor Reference';
export const typeGroupIdentity = 'Identity';
export const baseTypeTopLevelEntity = 'ComplexObjectType';
export const baseTypeDescriptor = 'DescriptorType';
export const baseTypeReference = 'ReferenceType';
export const baseTypeDescriptorReference = 'DescriptorReferenceType';

function parentPropertyNotInExtensionOverridePropertyList(
  parentProperty: EntityProperty,
  extensionOverrideProperties: Array<EntityProperty>,
): boolean {
  return !extensionOverrideProperties.some(
    x => x.metaEdName === parentProperty.metaEdName && x.withContext === parentProperty.withContext,
  );
}

function parentPropertiesWithOverriddenPropertiesFilteredOut(topLevelEntity: TopLevelEntity): Array<EntityProperty> {
  const extensionOverrideProperties = topLevelEntity.data.edfiXsd
    .xsd_Properties()
    .filter(x => x.type === 'common' && ((x: any): CommonProperty).isExtensionOverride);
  if (topLevelEntity.baseEntity == null) return [];
  const parentProperties = topLevelEntity.baseEntity.data.edfiXsd.xsd_Properties();
  return parentProperties.filter(
    x => x.type !== 'common' || parentPropertyNotInExtensionOverridePropertyList(x, extensionOverrideProperties),
  );
}

export function restrictionName(topLevelEntity: TopLevelEntity): string {
  const parentEntity = topLevelEntity.baseEntity;
  if (parentEntity == null) return '';
  return topLevelEntity.namespaceInfo.projectExtension === ''
    ? parentEntity.metaEdName
    : `${topLevelEntity.namespaceInfo.projectExtension}-${parentEntity.metaEdName}${restrictionSuffix}`;
}

export function createDefaultComplexType(
  topLevelEntity: TopLevelEntity,
  typeGroup: string,
  baseType: string = '',
  isAbstract: boolean = false,
): Array<ComplexType> {
  const complexType: ComplexType = Object.assign(newComplexType(), {
    annotation: Object.assign(newAnnotation(), {
      documentation: topLevelEntity.documentation,
      typeGroup,
    }),
    isAbstract,
    baseType,
    name: topLevelEntity.data.edfiXsd.xsd_MetaEdNameWithExtension(),
  });

  complexType.items.push(...createSchemaComplexTypeItems(topLevelEntity.data.edfiXsd.xsd_Properties()));
  return [complexType];
}

export function createCoreRestrictionForExtensionParent(topLevelEntity: TopLevelEntity): ComplexType {
  const parentEntity = topLevelEntity.baseEntity;
  if (parentEntity == null) return NoComplexType;
  const baseType = parentEntity.data.edfiXsd.xsd_MetaEdNameWithExtension();
  const restrictionComplexType = Object.assign(newComplexType(), {
    baseType,
    annotation: Object.assign(newAnnotation(), {
      documentation: `Restriction to ${sugar.titleize(
        parentEntity.metaEdName,
      )} for replacement of common type with common type extension`,
    }),
    isRestriction: true,
    name: restrictionName(topLevelEntity),
  });

  restrictionComplexType.items.push(
    ...createSchemaComplexTypeItems(parentPropertiesWithOverriddenPropertiesFilteredOut(topLevelEntity)),
  );
  return restrictionComplexType;
}

export function createIdentityType(topLevelEntity: TopLevelEntity): ComplexType {
  if (topLevelEntity.data.edfiXsd.xsd_IdentityProperties.length < 1) return NoComplexType;

  const documentation =
    topLevelEntity.queryableFields.length > 0
      ? `Encapsulates primary attributes that can be used to look up the identity of ${prependIndefiniteArticle(
          topLevelEntity.metaEdName,
        )}.`
      : `Identity of ${prependIndefiniteArticle(topLevelEntity.metaEdName)}.`;

  const identityType: ComplexType = Object.assign(newComplexType(), {
    annotation: Object.assign(newAnnotation(), {
      documentation,
      typeGroup: typeGroupIdentity,
    }),
    name: `${topLevelEntity.data.edfiXsd.xsd_MetaEdNameWithExtension()}IdentityType`,
  });

  identityType.items.push(...createSchemaComplexTypeItems(topLevelEntity.data.edfiXsd.xsd_IdentityProperties, ''));
  return identityType;
}

export function createReferenceType(topLevelEntity: TopLevelEntity): ComplexType {
  const referenceType: ComplexType = Object.assign(newComplexType(), {
    annotation: Object.assign(newAnnotation(), {
      documentation: `Provides alternative references for ${prependIndefiniteArticle(
        topLevelEntity.metaEdName,
      )}. Use XML IDREF to reference a record that is included in the interchange. Use the identity type to look up a record that was loaded previously.`,
      typeGroup: typeGroupExtendedReference,
    }),
    baseType: baseTypeReference,
    name: `${topLevelEntity.data.edfiXsd.xsd_MetaEdNameWithExtension()}ReferenceType`,
  });

  if (topLevelEntity.data.edfiXsd.xsd_IdentityType !== '') {
    referenceType.items.push(
      Object.assign(newElement(), {
        name: `${topLevelEntity.metaEdName}Identity`,
        type: topLevelEntity.data.edfiXsd.xsd_IdentityType.name,
        annotation: Object.assign(newAnnotation(), {
          documentation: topLevelEntity.data.edfiXsd.xsd_IdentityType.annotation.documentation,
        }),
        minOccurs: '0',
      }),
    );
  }
  return referenceType;
}
