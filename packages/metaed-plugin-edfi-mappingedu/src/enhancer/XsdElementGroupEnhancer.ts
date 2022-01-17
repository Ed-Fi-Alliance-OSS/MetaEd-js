import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { SchemaSection, ComplexType, EnumerationSimpleType, SimpleType } from '@edfi/metaed-plugin-edfi-xsd';
import {
  typeGroupAssociation,
  typeGroupBase,
  typeGroupCommon,
  typeGroupDescriptor,
  typeGroupDescriptorExtendedReference,
  typeGroupDomainEntity,
  typeGroupEnumeration,
  typeGroupExtendedReference,
  typeGroupIdentity,
  typeGroupLookup,
  typeGroupSimple,
} from '@edfi/metaed-plugin-edfi-xsd';
import {
  pluginAssociationsForNamespace,
  pluginBasesForNamespace,
  pluginCommonsForNamespace,
  pluginDescriptorExtendedReferencesForNamespace,
  pluginDescriptorsForNamespace,
  pluginDomainEntitiesForNamespace,
  pluginEnumerationsForNamespace,
  pluginExtendedReferencesForNamespace,
  pluginIdentitiesForNamespace,
  pluginLookupsForNamespace,
  pluginSimplesForNamespace,
  xsdSchemaForNamespace,
} from './EnhancerHelper';

const enhancerName = 'XsdElementGroupEnhancer';

const typeGroupRepositoryFor = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  xsdElement: ComplexType | SimpleType,
): Map<string, any> => {
  const repositoryFor: {
    [typeGroupString in string]: () =>
      | Map<string, ComplexType>
      | Map<string, SimpleType>
      | Map<string, EnumerationSimpleType>;
  } = {
    [typeGroupAssociation]: () => pluginAssociationsForNamespace(metaEd, namespace),
    [typeGroupBase]: () => pluginBasesForNamespace(metaEd, namespace),
    [typeGroupCommon]: () => pluginCommonsForNamespace(metaEd, namespace),
    [typeGroupDescriptor]: () => pluginDescriptorsForNamespace(metaEd, namespace),
    [typeGroupDescriptorExtendedReference]: () => pluginDescriptorExtendedReferencesForNamespace(metaEd, namespace),
    [typeGroupDomainEntity]: () => pluginDomainEntitiesForNamespace(metaEd, namespace),
    [typeGroupEnumeration]: () => pluginEnumerationsForNamespace(metaEd, namespace),
    [typeGroupExtendedReference]: () => pluginExtendedReferencesForNamespace(metaEd, namespace),
    [typeGroupIdentity]: () => pluginIdentitiesForNamespace(metaEd, namespace),
    [typeGroupLookup]: () => pluginLookupsForNamespace(metaEd, namespace),
    [typeGroupSimple]: () => pluginSimplesForNamespace(metaEd, namespace),
  };

  return repositoryFor[xsdElement.annotation.typeGroup]();
};

const addXsdElement = (metaEd: MetaEdEnvironment, namespace: Namespace, xsdElement: any): void => {
  typeGroupRepositoryFor(metaEd, namespace, xsdElement).set(xsdElement.name, xsdElement);
};

const xsdElementsForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): (ComplexType | SimpleType)[] => {
  const xsdElements: (ComplexType | SimpleType)[] = [];
  xsdSchemaForNamespace(metaEd, namespace).sections.forEach((section: SchemaSection) => {
    xsdElements.push(...section.complexTypes);
    xsdElements.push(...section.simpleTypes);
  });
  return xsdElements;
};

export const enhance = (metaEd: MetaEdEnvironment): EnhancerResult => {
  metaEd.namespace.forEach((namespace: Namespace) => {
    xsdElementsForNamespace(metaEd, namespace).forEach((xsdElement: ComplexType | SimpleType) => {
      addXsdElement(metaEd, namespace, xsdElement);
    });
  });

  return {
    enhancerName,
    success: true,
  };
};
