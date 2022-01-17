import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { ComplexType, SimpleType, Element, ElementGroup } from '@edfi/metaed-plugin-edfi-xsd';
import {
  baseTypeDescriptorReference,
  descriptorReferenceTypeSuffix,
  identityTypeSuffix,
  lookupTypeSuffix,
  mapTypeSuffix,
  referenceTypeSuffix,
  typeGroupEnumeration,
  typeGroupSimple,
} from '@edfi/metaed-plugin-edfi-xsd';
import {
  pluginAssociationsForNamespace,
  pluginBasesForNamespace,
  pluginCommonsForNamespace,
  pluginDescriptorsForNamespace,
  pluginDomainEntitiesForNamespace,
  pluginExtendedReferencesForNamespace,
  pluginIdentitiesForNamespace,
  pluginSimplesForNamespace,
} from './EnhancerHelper';

export const hasItems = (item: ComplexType | SimpleType | Element | ElementGroup): boolean =>
  (item as ElementGroup).items != null && (item as ElementGroup).items.length > 0;

export const isChoice = (item: Element | ElementGroup): boolean =>
  (item as ElementGroup).isChoice != null && (item as ElementGroup).isChoice;

export const isElementGroup = (item: Element | ElementGroup): boolean =>
  (item as ElementGroup).isChoice != null && (item as ElementGroup).items.length > 0;

export const isDescriptorReferenceType = (item: Element | ElementGroup): boolean =>
  (item as Element).type != null &&
  (item as Element).type !== baseTypeDescriptorReference &&
  (item as Element).type.endsWith(descriptorReferenceTypeSuffix);

export const isIdentityReferenceType = (item: Element | ElementGroup): boolean =>
  (item as Element).type != null && (item as Element).type.endsWith(identityTypeSuffix);

export const isReferenceType = (item: Element | ElementGroup): boolean =>
  (item as Element).type != null &&
  (item as Element).type !== descriptorReferenceTypeSuffix &&
  (item as Element).type.endsWith(referenceTypeSuffix);

export const isMapReferenceType = (item: SimpleType | Element | ElementGroup): boolean =>
  (item as Element).type != null && (item as Element).type.endsWith(mapTypeSuffix);

export const isLookupReferenceType = (item: Element | ElementGroup): boolean =>
  (item as Element).type != null && (item as Element).type.endsWith(lookupTypeSuffix);

export const isSimpleType = (simple: SimpleType | Element | ElementGroup): boolean =>
  (simple as SimpleType).annotation != null &&
  (simple as SimpleType).annotation.typeGroup != null &&
  (simple as SimpleType).annotation.typeGroup === typeGroupSimple;

export const isEnumeration = (enumeration: SimpleType | Element | ElementGroup): boolean =>
  (enumeration as SimpleType).annotation != null &&
  (enumeration as SimpleType).annotation.typeGroup != null &&
  (enumeration as SimpleType).annotation.typeGroup === typeGroupEnumeration;

export const referenceFor = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  referenceElement: Element | ElementGroup,
): ComplexType | SimpleType | undefined => {
  if (isDescriptorReferenceType(referenceElement))
    return pluginDescriptorsForNamespace(metaEd, namespace).get((referenceElement as Element).annotation.descriptorName);

  if (isIdentityReferenceType(referenceElement))
    return pluginIdentitiesForNamespace(metaEd, namespace).get((referenceElement as Element).type);

  if (isReferenceType(referenceElement))
    return pluginExtendedReferencesForNamespace(metaEd, namespace).get((referenceElement as Element).type);

  const common: ComplexType | undefined = pluginCommonsForNamespace(metaEd, namespace).get(
    (referenceElement as Element).type,
  );
  if (common != null) return common;

  const simple: SimpleType | undefined = pluginSimplesForNamespace(metaEd, namespace).get(
    (referenceElement as Element).type,
  );
  if (simple != null) return simple;

  return pluginBasesForNamespace(metaEd, namespace).get((referenceElement as Element).type);
};

export const baseTypeFor = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  referenceElement: ComplexType,
): ComplexType | undefined => {
  const Descriptors: ComplexType | undefined = pluginDescriptorsForNamespace(metaEd, namespace).get(
    referenceElement.baseType,
  );
  if (Descriptors != null) return Descriptors;

  const domainEntity: ComplexType | undefined = pluginDomainEntitiesForNamespace(metaEd, namespace).get(
    referenceElement.baseType,
  );
  if (domainEntity != null) return domainEntity;

  const association: ComplexType | undefined = pluginAssociationsForNamespace(metaEd, namespace).get(
    referenceElement.baseType,
  );
  if (association != null) return association;

  return pluginBasesForNamespace(metaEd, namespace).get(referenceElement.baseType);
};
