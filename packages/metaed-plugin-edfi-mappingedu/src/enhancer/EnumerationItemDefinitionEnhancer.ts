import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { EnumerationSimpleType, EnumerationToken } from '@edfi/metaed-plugin-edfi-xsd';
import { EnumerationItemDefinition } from '../model/EnumerationItemDefinition';
import { newEnumerationItemDefinition } from '../model/EnumerationItemDefinition';
import {
  elementGroupNameFor,
  pluginEnumerationItemDefinitionsForNamespace,
  pluginEnumerationsForNamespace,
} from './EnhancerHelper';

const enhancerName = 'EnumerationItemDefinitionEnhancer';

const createEnumerationItemDefinitionFor = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  enumeration: EnumerationSimpleType,
) => {
  const repository: EnumerationItemDefinition[] = pluginEnumerationItemDefinitionsForNamespace(metaEd, namespace);
  const definition: EnumerationItemDefinition = {
    ...newEnumerationItemDefinition(),
    elementGroup: elementGroupNameFor(namespace),
    enumeration: enumeration.name,
  };
  enumeration.enumerationTokens.forEach((token: EnumerationToken) => {
    repository.push({
      ...definition,
      codeValue: token.value,
      shortDescription: token.value,
      description: token.value,
    });
  });
};

export const enhance = (metaEd: MetaEdEnvironment): EnhancerResult => {
  metaEd.namespace.forEach((namespace: Namespace) => {
    pluginEnumerationsForNamespace(metaEd, namespace).forEach((enumeration: EnumerationSimpleType) => {
      createEnumerationItemDefinitionFor(metaEd, namespace, enumeration);
    });
  });

  return {
    enhancerName,
    success: true,
  };
};
