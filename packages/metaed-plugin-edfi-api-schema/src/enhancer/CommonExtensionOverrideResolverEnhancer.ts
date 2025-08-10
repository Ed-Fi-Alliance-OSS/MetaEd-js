// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  CommonProperty,
  CommonExtension,
  getEntityFromNamespaceChain,
} from '@edfi/metaed-core';
import { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';

const enhancerName = 'CommonExtensionOverrideResolverEnhancer';

/**
 * This enhancer resolves CommonProperty references when the isExtensionOverride flag is true.
 * It looks for CommonExtension entities in the same namespace as the property and stores
 * the reference in the property's API schema data.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.common.forEach((property: CommonProperty) => {
    if (!property.isExtensionOverride) return;

    // Look for a CommonExtension in the same namespace as the property
    const commonExtension = getEntityFromNamespaceChain(
      property.metaEdName,
      property.namespace.namespaceName,
      property.namespace,
      'commonExtension',
    ) as CommonExtension | null;

    if (commonExtension != null) {
      const apiSchemaData = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
      apiSchemaData.referencedCommonExtension = commonExtension;
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
