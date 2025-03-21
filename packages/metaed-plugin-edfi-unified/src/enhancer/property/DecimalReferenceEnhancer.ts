// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, SharedDecimalProperty, DecimalType, SharedDecimal } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

const enhancerName = 'DecimalReferenceEnhancer';

// NOTE:
// referringSimpleProperties is only used by MetaEdHandbook
// decimalType is only used by XSD
// this functionality should be moved to MetaEdHandbook
// referringSimpleProperties should be moved to SharedSimple instead of DecimalType
function addReferringSimplePropertiesToDecimalType(metaEd: MetaEdEnvironment): void {
  metaEd.propertyIndex.sharedDecimal.forEach((property: SharedDecimalProperty) => {
    const referencedEntity: DecimalType | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'decimalType',
    ) as DecimalType | null;

    if (referencedEntity) {
      referencedEntity.referringSimpleProperties.push(property);
    }
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.sharedDecimal.forEach((property: SharedDecimalProperty) => {
    const referencedEntity: SharedDecimal | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'sharedDecimal',
    ) as SharedDecimal | null;

    if (referencedEntity) {
      property.referencedEntity = referencedEntity;
      property.referencedEntityDeprecated = referencedEntity.isDeprecated;
      referencedEntity.inReferences.push(property);
      property.parentEntity.outReferences.push(property);
    }
  });

  addReferringSimplePropertiesToDecimalType(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
