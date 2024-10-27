import {
  MetaEdEnvironment,
  EnhancerResult,
  getAllEntitiesOfType,
  normalizeDescriptorSuffix,
  decapitalize,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { pluralize } from '../Utility';
import { EndpointName } from '../model/api-schema/EndpointName';
import { MetaEdResourceName } from '../model/api-schema/MetaEdResourceName';

/**
 * Converts a MetaEd model name to its endpoint name
 */
function endpointNameFrom(metaEdName: string): EndpointName {
  return pluralize(decapitalize(metaEdName)) as EndpointName;
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
      normalizeDescriptorSuffix(decapitalize(descriptor.metaEdName)),
    ) as EndpointName;
    (descriptor.data.edfiApiSchema as EntityApiSchemaData).resourceName = normalizeDescriptorSuffix(
      descriptor.metaEdName,
    ) as MetaEdResourceName;
  });

  return {
    enhancerName: 'ResourceNameEnhancer',
    success: true,
  };
}
