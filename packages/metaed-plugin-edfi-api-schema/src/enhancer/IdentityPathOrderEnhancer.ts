import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { DocumentObjectKey } from '../model/api-schema/DocumentObjectKey';
import { MetaEdPropertyFullName } from '../model/api-schema/MetaEdPropertyFullName';
import { DocumentPaths } from '../model/api-schema/DocumentPaths';

/**
 * Accumulates the pathOrders from the DocumentPaths of the parts of identity for an entity, putting them
 * in an absolute order.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association').forEach((entity) => {
    // Using Set to remove duplicates
    const result: Set<DocumentObjectKey> = new Set();

    const { identityFullnames, documentPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

    identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
      const documentPaths: DocumentPaths = documentPathsMapping[identityFullname];
      documentPaths.pathOrder.forEach((path: DocumentObjectKey) => {
        result.add(path);
      });
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).identityPathOrder = [...result].sort();
  });

  return {
    enhancerName: 'IdentityPathOrderEnhancer',
    success: true,
  };
}
