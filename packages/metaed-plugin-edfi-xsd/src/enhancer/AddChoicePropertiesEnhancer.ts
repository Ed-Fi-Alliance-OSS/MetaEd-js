// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Choice, EntityProperty, Namespace } from '@edfi/metaed-core';
import { getAllTopLevelEntitiesForNamespaces, getEntityFromNamespaceChain } from '@edfi/metaed-core';
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
