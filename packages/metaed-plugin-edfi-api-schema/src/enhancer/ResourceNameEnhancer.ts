import {
  MetaEdEnvironment,
  EnhancerResult,
  getAllEntitiesOfType,
  normalizeDescriptorSuffix,
  decapitalize,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { pluralize } from '../Utility';
import { ResourceName } from '../model/api-schema/ResourceName';
import { EndpointName } from '../model/api-schema/EndpointName';

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
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      (entity.data.edfiApiSchema as EntityApiSchemaData).endpointName = endpointNameFrom(entity.metaEdName);
      (entity.data.edfiApiSchema as EntityApiSchemaData).resourceName = entity.metaEdName as ResourceName;
    },
  );

  // Descriptors are special because they have a descriptor suffix
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((descriptor) => {
    (descriptor.data.edfiApiSchema as EntityApiSchemaData).endpointName = pluralize(
      normalizeDescriptorSuffix(decapitalize(descriptor.metaEdName)),
    ) as EndpointName;
    (descriptor.data.edfiApiSchema as EntityApiSchemaData).resourceName = normalizeDescriptorSuffix(
      descriptor.metaEdName,
    ) as ResourceName;
  });

  return {
    enhancerName: 'ResourceNameEnhancer',
    success: true,
  };
}
