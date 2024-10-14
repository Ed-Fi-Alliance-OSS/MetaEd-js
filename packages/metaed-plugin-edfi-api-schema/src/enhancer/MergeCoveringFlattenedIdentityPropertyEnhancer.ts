import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, getAllEntitiesOfType, EntityProperty } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';

/**
 * Returns true if the second property chain is a prefix of the first (or identical)
 */
function isChainPrefix(chain: EntityProperty[], possiblePrefixChain: EntityProperty[]) {
  if (possiblePrefixChain.length > chain.length) {
    return false;
  }

  // Check if elements in possibleSubsequenceChain matches the corresponding elements in the chain
  return possiblePrefixChain.every((element, index) => element === chain[index]);
}

/**
 * Finds the flattenedIdentityProperties that cover merged away ones
 */
function findMergeCoveringFlattenedIdentityProperties(entity: TopLevelEntity): void {
  const { flattenedIdentityProperties } = (entity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;
  // 1st loop is flattenedIdentityProperties that are merged away
  flattenedIdentityProperties.forEach((mergedAway) => {
    if (mergedAway.mergedAwayBy == null) return;

    // 2nd loop is finding the flattenedIdentityProperty doing the covering
    flattenedIdentityProperties.forEach((possibleMergeCoverer) => {
      if (possibleMergeCoverer.mergedAwayBy != null) return;
      if (mergedAway.mergedAwayBy == null) return; // For TypeScript - thinks earlier check may no longer apply

      if (isChainPrefix(possibleMergeCoverer.propertyChain, mergedAway.mergedAwayBy.mergeDirective.targetPropertyChain)) {
        mergedAway.mergeCoveredBy = possibleMergeCoverer;
      }
    });
  });
}

/**
 * This enhancer associates merged away flattenedIdentityProperties with the ones that cover them
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      findMergeCoveringFlattenedIdentityProperties(entity as TopLevelEntity);
    },
  );

  return {
    enhancerName: 'MergeCoveringFlattenedIdentityPropertyEnhancer',
    success: true,
  };
}
