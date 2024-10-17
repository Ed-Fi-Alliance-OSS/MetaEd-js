import invariant from 'ts-invariant';
import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, getAllEntitiesOfType, EntityProperty } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';

/**
 * Returns true if the property chains are a match
 */
function isMatchingChain(chain: EntityProperty[], possiblePrefixChain: EntityProperty[]) {
  if (possiblePrefixChain.length !== chain.length) {
    return false;
  }

  // Check if elements in possiblePrefixChain matches the corresponding elements in the chain
  return possiblePrefixChain.every((element, index) => element === chain[index]);
}

/**
 * If the targetPropertyChain of the mergedAwayBy merge directive ends at a reference property,
 * return a new chain suffixed with the additional terminal property (e.g. an integer identity property)
 * that is relevant here.
 *
 * Merge directives often end at a reference property, but that just means the merge
 * occurs for every terminal property that is part of the identity of reference.
 *
 */
function extendTargetPropertyChainToTerminal(mergedAway: FlattenedIdentityProperty): EntityProperty[] {
  invariant(mergedAway.mergedAwayBy != null, 'mergedAway.mergedAwayBy should never be null');
  const { mergedAwayBy } = mergedAway;

  const lastPropertyInMergeTargetChain: EntityProperty | undefined = mergedAwayBy.mergeDirective.targetPropertyChain.at(-1);

  invariant(
    lastPropertyInMergeTargetChain != null,
    'mergedAway.mergedAwayBy.mergeDirective.targetPropertyChain should never be empty',
  );

  if (lastPropertyInMergeTargetChain.type === 'domainEntity' || lastPropertyInMergeTargetChain.type === 'association') {
    // The merge directive is to a reference, not a terminal property. Add the terminal property that applies here.
    const lastPropertyInMergedAwayChain = mergedAway.propertyChain.at(-1);
    invariant(lastPropertyInMergedAwayChain != null, 'mergedAway.propertyChain should never be empty');

    return [...mergedAwayBy.mergeDirective.targetPropertyChain, lastPropertyInMergedAwayChain];
  }
  return mergedAway.mergedAwayBy.mergeDirective.targetPropertyChain;
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

      if (isMatchingChain(possibleMergeCoverer.propertyChain, extendTargetPropertyChainToTerminal(mergedAway))) {
        mergedAway.mergeCoveredBy = possibleMergeCoverer;
        possibleMergeCoverer.mergeCovers = mergedAway;
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
