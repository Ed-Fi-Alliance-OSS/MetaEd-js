// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  isReferentialProperty,
  ReferentialProperty,
  MergeDirective,
  EntityProperty,
  MetaEdPropertyPath,
} from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { JsonPathPropertyPair, JsonPathsInfo } from '../model/JsonPathsMapping';
import { findMergeJsonPathsMapping } from '../Utility';

function mergeDirectivePathStringsToPath(segments: string[]): MetaEdPropertyPath {
  return segments.join('.') as MetaEdPropertyPath;
}

/**
 * Joins a chain of EntityProperty objects into the dot-separated MetaEdPropertyPath used as a key
 * in mergeJsonPathsMapping. fullPropertyName is used because that's how merge directive paths are
 * already keyed throughout the pipeline.
 */
function propertyChainToPath(propertyChain: EntityProperty[]): MetaEdPropertyPath {
  return propertyChain.map((property) => property.fullPropertyName).join('.') as MetaEdPropertyPath;
}

/**
 * Returns the longest length L such that the last L properties of the merge directive property chain
 * equal the first L properties of the flattened identity property chain. Returns 0 if no overlap is found.
 *
 * The merge directive's property chain is rooted at the host entity, while a FlattenedIdentityProperty's
 * propertyChain is rooted at the entity that owns the FlattenedIdentityProperty. When the merge directive path
 * descends into the FlattenedIdentityProperty's owning entity, the tail of the merge directive chain shares
 * property objects with the head of the FlattenedIdentityProperty chain. The shared region is the merged-away suffix
 * to substitute when computing the covering path.
 */
function matchingSuffixLength(
  mergeDirectivePropertyChain: EntityProperty[],
  flattenedIdentityPropertyChain: EntityProperty[],
): number {
  const maxLength: number = Math.min(mergeDirectivePropertyChain.length, flattenedIdentityPropertyChain.length);

  for (let length = maxLength; length > 0; length -= 1) {
    const sourceSuffixStart: number = mergeDirectivePropertyChain.length - length;
    let matches = true;
    for (let index = 0; index < length; index += 1) {
      if (mergeDirectivePropertyChain[sourceSuffixStart + index] !== flattenedIdentityPropertyChain[index]) {
        matches = false;
        break;
      }
    }
    if (matches) return length;
  }

  return 0;
}

/**
 * If the JsonPathPropertyPair endpoint is merged away within the containing entity, the API document
 * collapses to the covering field (e.g. $.grades[*].gradeReference.schoolId rather than the role-name-
 * prefixed gradingPeriodSchoolId, which has no real field in the document). Returns the covering's
 * canonical JsonPath so equalityConstraints reference endpoints that actually exist; otherwise returns
 * the pair's own JsonPath. See DMS-1041.
 *
 * The covering path is rebuilt within the same branch as the merge directive endpoint by replacing the
 * merged-away suffix of the merge directive's property chain with the covering FlattenedIdentityProperty's
 * chain. A global scan of mergeJsonPathsMapping for the covering FIP is unsafe: the same FIP is reused
 * across every reference branch into the owning entity, so the first match can be from a different
 * branch (e.g. an InterimGrade branch when the merge is on FinalGrade).
 */
function jsonPathAdjustedForMergeCoverage(
  entity: TopLevelEntity,
  mergeDirectivePropertyChain: EntityProperty[],
  pair: JsonPathPropertyPair,
): JsonPath {
  const { mergeCoveredBy } = pair.flattenedIdentityProperty;
  if (mergeCoveredBy == null) return pair.jsonPath;

  const matchedLength: number = matchingSuffixLength(
    mergeDirectivePropertyChain,
    pair.flattenedIdentityProperty.propertyChain,
  );
  invariant(
    matchedLength > 0,
    'Invariant failed in MergeDirectiveEqualityConstraintEnhancer: merge directive property chain does not overlap flattened identity property chain',
  );

  const coveringPropertyChain: EntityProperty[] = [
    ...mergeDirectivePropertyChain.slice(0, mergeDirectivePropertyChain.length - matchedLength),
    ...mergeCoveredBy.propertyChain,
  ];

  const coveringInfo: JsonPathsInfo | null = findMergeJsonPathsMapping(entity, propertyChainToPath(coveringPropertyChain));
  invariant(
    coveringInfo != null && coveringInfo.jsonPathPropertyPairs.length === 1,
    'Invariant failed in MergeDirectiveEqualityConstraintEnhancer: covering JsonPathsMapping not found or ambiguous',
  );
  return coveringInfo.jsonPathPropertyPairs[0].jsonPath;
}

/**
 * Creates EqualityConstraints from entity merge directives using JsonPathsMapping to find the source and
 * target JsonPaths.
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
  ).forEach((entity: TopLevelEntity) => {
    const { equalityConstraints } = entity.data.edfiApiSchema as EntityApiSchemaData;

    // find properties on entity with merge directives
    entity.properties.forEach((property: EntityProperty) => {
      if (isReferentialProperty(property)) {
        const referentialProperty: ReferentialProperty = property as ReferentialProperty;

        referentialProperty.mergeDirectives.forEach((mergeDirective: MergeDirective) => {
          const sourceInfo: JsonPathsInfo | null = findMergeJsonPathsMapping(
            entity,
            mergeDirectivePathStringsToPath(mergeDirective.sourcePropertyPathStrings),
          );
          const targetInfo: JsonPathsInfo | null = findMergeJsonPathsMapping(
            entity,
            mergeDirectivePathStringsToPath(mergeDirective.targetPropertyPathStrings),
          );

          invariant(
            sourceInfo != null && targetInfo != null,
            'Invariant failed in MergeDirectiveEqualityConstraintEnhancer: source or target JsonPaths are undefined',
          );

          const sourcePairs: JsonPathPropertyPair[] = sourceInfo.jsonPathPropertyPairs;
          const targetPairs: JsonPathPropertyPair[] = targetInfo.jsonPathPropertyPairs;

          if (sourcePairs.length !== targetPairs.length) {
            // Occurs when property path has been merged away
            return;
          }

          sourcePairs.forEach((sourcePair, index: number) => {
            equalityConstraints.push({
              sourceJsonPath: jsonPathAdjustedForMergeCoverage(entity, mergeDirective.sourcePropertyChain, sourcePair),
              targetJsonPath: jsonPathAdjustedForMergeCoverage(
                entity,
                mergeDirective.targetPropertyChain,
                targetPairs[index],
              ),
            });
          });
        });
      }
    });
  });

  return {
    enhancerName: 'MergeDirectiveEqualityConstraintEnhancer',
    success: true,
  };
}
