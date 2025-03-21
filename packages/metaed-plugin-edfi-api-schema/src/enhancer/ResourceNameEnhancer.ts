// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, normalizeDescriptorSuffix } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { pluralize, uncapitalize } from '../Utility';
import { EndpointName } from '../model/api-schema/EndpointName';
import { MetaEdResourceName } from '../model/api-schema/MetaEdResourceName';

/**
 * Converts a MetaEd model name to its endpoint name
 */
function endpointNameFrom(metaEdName: string): EndpointName {
  return pluralize(uncapitalize(metaEdName)) as EndpointName;
}

/**
 * This enhancer determines the API resource and endpoint names for each entity
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'associationExtension',
    'domainEntityExtension',
  ).forEach((entity) => {
    (entity.data.edfiApiSchema as EntityApiSchemaData).endpointName = endpointNameFrom(entity.metaEdName);
    (entity.data.edfiApiSchema as EntityApiSchemaData).resourceName = entity.metaEdName as MetaEdResourceName;
  });

  // Descriptors are special because they have a descriptor suffix
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((descriptor) => {
    (descriptor.data.edfiApiSchema as EntityApiSchemaData).endpointName = pluralize(
      normalizeDescriptorSuffix(uncapitalize(descriptor.metaEdName)),
    ) as EndpointName;
    (descriptor.data.edfiApiSchema as EntityApiSchemaData).resourceName = normalizeDescriptorSuffix(
      descriptor.metaEdName,
    ) as MetaEdResourceName;
  });

  // School year is its own thing
  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((schoolYearEnumeration) => {
    (schoolYearEnumeration.data.edfiApiSchema as EntityApiSchemaData).endpointName = 'schoolYearTypes' as EndpointName;
    (schoolYearEnumeration.data.edfiApiSchema as EntityApiSchemaData).resourceName = 'SchoolYearType' as MetaEdResourceName;
  });

  return {
    enhancerName: 'ResourceNameEnhancer',
    success: true,
  };
}
