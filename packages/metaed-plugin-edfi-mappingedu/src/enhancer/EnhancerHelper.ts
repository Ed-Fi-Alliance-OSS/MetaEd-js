import { MetaEdEnvironment, PluginEnvironment, Namespace } from '@edfi/metaed-core';
import { SchemaContainer, ComplexType, EnumerationSimpleType, SimpleType } from '@edfi/metaed-plugin-edfi-xsd';
import { newSchemaContainer } from '@edfi/metaed-plugin-edfi-xsd';
import { EdFiMappingEduRepository } from '../model/EdFiMappingEduRepository';
import { ElementGroupDefinition } from '../model/ElementGroupDefinition';
import { EntityDefinition } from '../model/EntityDefinition';
import { ElementDefinition } from '../model/ElementDefinition';
import { EnumerationDefinition } from '../model/EnumerationDefinition';
import { EnumerationItemDefinition } from '../model/EnumerationItemDefinition';

export const dataStandardNamespaceName = 'EdFi';
export const dataStandardElementGroupName = 'Core';

export const isDataStandard = (namespace: Namespace): boolean => namespace.namespaceName === dataStandardNamespaceName;
export const elementGroupNameFor = (namespace: Namespace): string =>
  isDataStandard(namespace) ? dataStandardElementGroupName : namespace.namespaceName;

export const pluginEnvironment = (metaEd: MetaEdEnvironment): PluginEnvironment | undefined =>
  metaEd.plugin.get('edfiMappingedu') as PluginEnvironment | undefined;

export const pluginEnvironmentRepositoryForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): EdFiMappingEduRepository | undefined => {
  const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd);
  if (plugin == null) return undefined;
  const repository: EdFiMappingEduRepository | undefined = plugin.namespace.get(namespace);
  return repository;
};

export const pluginElementGroupDefinitionsForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): ElementGroupDefinition[] => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? [] : repository.elementGroupDefinitions;
};

export const pluginEntityDefinitionsForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): EntityDefinition[] => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? [] : repository.entityDefinitions;
};

export const pluginElementDefinitionsForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): ElementDefinition[] => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? [] : repository.elementDefinitions;
};

export const pluginEnumerationDefinitionsForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): EnumerationDefinition[] => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? [] : repository.enumerationDefinitions;
};

export const pluginEnumerationItemDefinitionsForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): EnumerationItemDefinition[] => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? [] : repository.enumerationItemDefinitions;
};

export const pluginAssociationsForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.association;
};

export const pluginBasesForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.base;
};

export const pluginCommonsForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.common;
};

export const pluginDescriptorsForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.descriptor;
};

export const pluginDescriptorExtendedReferencesForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.descriptorExtendedReference;
};

export const pluginDomainEntitiesForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.domainEntity;
};

export const pluginEnumerationsForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): Map<string, EnumerationSimpleType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.enumeration;
};

export const pluginExtendedReferencesForNamespace = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.extendedReference;
};

export const pluginIdentitiesForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.identity;
};

export const pluginLookupsForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, ComplexType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.lookup;
};

export const pluginSimplesForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, SimpleType> => {
  const repository: EdFiMappingEduRepository | undefined = pluginEnvironmentRepositoryForNamespace(metaEd, namespace);
  return repository == null ? new Map() : repository.xsdElement.simple;
};

export const xsdSchemaForNamespace = (metaEd: MetaEdEnvironment, namespace: Namespace): SchemaContainer => {
  const requestedNamespace: Namespace | undefined = metaEd.namespace.get(namespace.namespaceName);
  return requestedNamespace == null ? newSchemaContainer() : requestedNamespace.data.edfiXsd.xsdSchema;
};
