import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { newElementGroupDefinition } from '../model/ElementGroupDefinition';
import { elementGroupNameFor, isDataStandard, pluginElementGroupDefinitionsForNamespace } from './EnhancerHelper';

const enhancerName = 'ElementGroupDefinitionEnhancer';

const createElementGroupDefinitionFor = (metaEd: MetaEdEnvironment, namespace: Namespace) => {
  const elementGroup: string = elementGroupNameFor(namespace);
  const definition: string = isDataStandard(namespace)
    ? `${namespace.projectName} ${elementGroup}`
    : `${namespace.projectName} ${namespace.extensionEntitySuffix}`;

  pluginElementGroupDefinitionsForNamespace(metaEd, namespace).push({
    ...newElementGroupDefinition(),
    elementGroup,
    definition,
  });
};

export const enhance = (metaEd: MetaEdEnvironment): EnhancerResult => {
  metaEd.namespace.forEach((namespace: Namespace) => {
    createElementGroupDefinitionFor(metaEd, namespace);
  });

  return {
    enhancerName,
    success: true,
  };
};
