import { MetaEdEnvironment, EnhancerResult, Choice, EntityProperty, Namespace } from 'metaed-core';
import { getAllTopLevelEntitiesForNamespaces, getEntityFromNamespaceChain } from 'metaed-core';
import { ChoicePropertyEdfiXsd } from '../model/property/ChoiceProperty';

const enhancerName = 'AddChoicePropertiesEnhancer';

function addChoiceProperties(namespace: Namespace, properties: EntityProperty[]) {
  properties
    .filter((p) => p.type === 'choice')
    .forEach((choiceProperty) => {
      const referencedChoice: Choice | null = getEntityFromNamespaceChain(
        choiceProperty.metaEdName,
        choiceProperty.referencedNamespaceName,
        namespace,
        'choice',
      ) as Choice | null;

      if (referencedChoice) {
        addChoiceProperties(namespace, referencedChoice.properties);
        (choiceProperty.data.edfiXsd as ChoicePropertyEdfiXsd).xsdProperties = referencedChoice.properties;
      }
    });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach((entity) => {
    addChoiceProperties(entity.namespace, entity.properties);
  });

  return {
    enhancerName,
    success: true,
  };
}
