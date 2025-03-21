// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  Interchange,
  InterchangeItem,
  Namespace,
  TopLevelEntity,
} from '@edfi/metaed-core';
import { getEntityFromNamespaceChain, getAllEntitiesOfType, asInterchange } from '@edfi/metaed-core';

const enhancerName = 'InterchangeBaseItemEnhancer';

function assignReference(namespace: Namespace, item: InterchangeItem) {
  const referencedEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
    item.metaEdName,
    item.referencedNamespaceName,
    namespace,
    ...item.referencedType,
  ) as TopLevelEntity | null;

  if (referencedEntity) {
    item.referencedEntity = referencedEntity;
    item.referencedEntityDeprecated = referencedEntity.isDeprecated;
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'interchange', 'interchangeExtension') as Interchange[]).forEach((interchangeBase) => {
    const interchange: Interchange = asInterchange(interchangeBase);
    interchange.elements.forEach((item) => assignReference(interchange.namespace, item));
    interchange.identityTemplates.forEach((item) => assignReference(interchange.namespace, item));
  });

  return {
    enhancerName,
    success: true,
  };
}
