import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { ComplexType, EnumerationSimpleType } from '@edfi/metaed-plugin-edfi-xsd';
import { newEnumerationDefinition } from '../model/EnumerationDefinition';
import {
  elementGroupNameFor,
  pluginDescriptorsForNamespace,
  pluginEnumerationDefinitionsForNamespace,
  pluginEnumerationsForNamespace,
} from './EnhancerHelper';

const enhancerName = 'EnumerationDefinitionEnhancer';

const createEnumerationDefinitionFor = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  complexType: ComplexType | EnumerationSimpleType,
) => {
  pluginEnumerationDefinitionsForNamespace(metaEd, namespace).push({
    ...newEnumerationDefinition(),
    elementGroup: elementGroupNameFor(namespace),
    enumeration: complexType.name,
    definition: complexType.annotation.documentation,
  });
};

export const enhance = (metaEd: MetaEdEnvironment): EnhancerResult => {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const xsdElements: (ComplexType | EnumerationSimpleType)[] = [
      ...pluginDescriptorsForNamespace(metaEd, namespace).values(),
      ...pluginEnumerationsForNamespace(metaEd, namespace).values(),
    ];

    xsdElements.forEach((xsdElement: ComplexType | EnumerationSimpleType) => {
      createEnumerationDefinitionFor(metaEd, namespace, xsdElement);
    });
  });

  return {
    enhancerName,
    success: true,
  };
};
