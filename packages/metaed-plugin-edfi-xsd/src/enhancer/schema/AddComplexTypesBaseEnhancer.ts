// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { String as sugar } from 'sugar';
import { TopLevelEntity, EntityProperty, CommonProperty } from '@edfi/metaed-core';
import { prependIndefiniteArticle } from '@edfi/metaed-core';
import { ComplexType } from '../../model/schema/ComplexType';
import { newComplexType, NoComplexType } from '../../model/schema/ComplexType';
import { newAnnotation } from '../../model/schema/Annotation';
import { newElement } from '../../model/schema/Element';
import { createSchemaComplexTypeItems } from './XsdElementFromPropertyCreator';
import { ComplexTypeItem } from '../../model/schema/ComplexTypeItem';

export const descriptorReferenceTypeSuffix = 'DescriptorReferenceType';
export const identityTypeSuffix = 'IdentityType';
export const lookupTypeSuffix = 'LookupType';
export const referenceTypeSuffix = 'ReferenceType';
export const mapTypeSuffix = 'MapType';
export const restrictionSuffix = 'Restriction';

export const typeGroupAssociation = 'Association';
export const typeGroupBase = 'Base';
export const typeGroupCommon = 'Common';
export const typeGroupDescriptor = 'Descriptor';
export const typeGroupDescriptorExtendedReference = 'Extended Descriptor Reference';
export const typeGroupDomainEntity = 'Domain Entity';
export const typeGroupEnumeration = 'Enumeration';
export const typeGroupExtendedReference = 'Extended Reference';
export const typeGroupIdentity = 'Identity';
export const typeGroupLookup = 'Lookup';
export const typeGroupSimple = 'Simple';

export const baseTypeDescriptor = 'DescriptorType';
export const baseTypeDescriptorReference = 'DescriptorReferenceType';
export const baseTypeReference = 'ReferenceType';
export const baseTypeTopLevelEntity = 'ComplexObjectType';

function parentPropertyNotInExtensionOverridePropertyList(
  parentProperty: EntityProperty,
  extensionOverrideProperties: EntityProperty[],
): boolean {
  return !extensionOverrideProperties.some(
    (x) => x.metaEdName === parentProperty.metaEdName && x.roleName === parentProperty.roleName,
  );
}

function parentPropertiesWithOverriddenPropertiesFilteredOut(topLevelEntity: TopLevelEntity): EntityProperty[] {
  const extensionOverrideProperties = topLevelEntity.data.edfiXsd
    .xsdProperties()
    .filter((x) => x.type === 'common' && (x as CommonProperty).isExtensionOverride);
  if (topLevelEntity.baseEntity == null) return [];
  const parentProperties = topLevelEntity.baseEntity.data.edfiXsd.xsdProperties();
  return parentProperties.filter(
    (x) => x.type !== 'common' || parentPropertyNotInExtensionOverridePropertyList(x, extensionOverrideProperties),
  );
}

export function restrictionName(topLevelEntity: TopLevelEntity): string {
  const parentEntity = topLevelEntity.baseEntity;
  if (parentEntity == null) return '';
  return topLevelEntity.namespace.projectExtension === ''
    ? parentEntity.metaEdName
    : `${topLevelEntity.namespace.projectExtension}-${parentEntity.metaEdName}${restrictionSuffix}`;
}

export function createDefaultComplexType(
  topLevelEntity: TopLevelEntity,
  typeGroup: string,
  baseType: string = '',
  isAbstract: boolean = false,
): ComplexType[] {
  const complexType: ComplexType = {
    ...newComplexType(),
    annotation: { ...newAnnotation(), documentation: topLevelEntity.documentation, typeGroup },
    isAbstract,
    baseType,
    name: topLevelEntity.data.edfiXsd.xsdMetaEdNameWithExtension(),
  };

  complexType.items.push(...createSchemaComplexTypeItems(topLevelEntity.data.edfiXsd.xsdProperties()));
  return [complexType];
}

export function createCoreRestrictionForExtensionParent(topLevelEntity: TopLevelEntity): ComplexType {
  const parentEntity = topLevelEntity.baseEntity;
  if (parentEntity == null) return NoComplexType;
  const baseType = parentEntity.data.edfiXsd.xsdMetaEdNameWithExtension();
  const restrictionComplexType = {
    ...newComplexType(),
    baseType,
    annotation: {
      ...newAnnotation(),
      documentation: `Restriction to ${sugar.titleize(
        parentEntity.metaEdName,
      )} for replacement of common type with common type extension`,
    },
    isRestriction: true,
    name: restrictionName(topLevelEntity),
  };

  if (['associationSubclass', 'domainEntitySubclass'].includes(parentEntity.type) && parentEntity.baseEntity != null) {
    restrictionComplexType.items.push(...createSchemaComplexTypeItems(parentEntity.baseEntity.data.edfiXsd.xsdProperties()));
  }

  restrictionComplexType.items.push(
    ...createSchemaComplexTypeItems(parentPropertiesWithOverriddenPropertiesFilteredOut(topLevelEntity)),
  );
  return restrictionComplexType;
}

export function createIdentityType(topLevelEntity: TopLevelEntity): ComplexType {
  if (topLevelEntity.data.edfiXsd.xsdIdentityProperties.length < 1) return NoComplexType;

  const documentation =
    topLevelEntity.queryableFields.length > 0
      ? `Encapsulates primary attributes that can be used to look up the identity of ${prependIndefiniteArticle(
          topLevelEntity.metaEdName,
        )}.`
      : `Identity of ${prependIndefiniteArticle(topLevelEntity.metaEdName)}.`;

  const identityType: ComplexType = {
    ...newComplexType(),
    annotation: { ...newAnnotation(), documentation, typeGroup: typeGroupIdentity },
    name: `${topLevelEntity.data.edfiXsd.xsdMetaEdNameWithExtension()}${identityTypeSuffix}`,
  };

  identityType.items.push(...createSchemaComplexTypeItems(topLevelEntity.data.edfiXsd.xsdIdentityProperties, ''));
  return identityType;
}

export function createReferenceType(topLevelEntity: TopLevelEntity): ComplexType {
  const referenceType: ComplexType = {
    ...newComplexType(),
    annotation: {
      ...newAnnotation(),
      documentation: `Provides alternative references for ${prependIndefiniteArticle(
        topLevelEntity.metaEdName,
      )}. Use XML IDREF to reference a record that is included in the interchange. Use the identity type to look up a record that was loaded previously.`,
      typeGroup: typeGroupExtendedReference,
    },
    baseType: baseTypeReference,
    name: `${topLevelEntity.data.edfiXsd.xsdMetaEdNameWithExtension()}${referenceTypeSuffix}`,
  };

  if (topLevelEntity.data.edfiXsd.xsdIdentityType !== '') {
    referenceType.items.push({
      ...newElement(),
      name: `${topLevelEntity.metaEdName}Identity`,
      type: topLevelEntity.data.edfiXsd.xsdIdentityType.name,
      annotation: {
        ...newAnnotation(),
        documentation: topLevelEntity.data.edfiXsd.xsdIdentityType.annotation.documentation,
      },
      minOccurs: '0',
    } as ComplexTypeItem);
  }
  return referenceType;
}
