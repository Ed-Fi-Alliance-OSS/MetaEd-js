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
import { findMergeJsonPathsMapping } from '../Utility';

function mergeDirectivePathStringsToPath(segments: string[]): MetaEdPropertyPath {
  return segments.join('.') as MetaEdPropertyPath;
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
          const sourceJsonPaths: JsonPath[] | undefined = findMergeJsonPathsMapping(
            entity,
            mergeDirectivePathStringsToPath(mergeDirective.sourcePropertyPathStrings),
          )?.jsonPathPropertyPairs.map((jppp) => jppp.jsonPath);

          const targetJsonPaths: JsonPath[] | undefined = findMergeJsonPathsMapping(
            entity,
            mergeDirectivePathStringsToPath(mergeDirective.targetPropertyPathStrings),
          )?.jsonPathPropertyPairs.map((jppp) => jppp.jsonPath);

          invariant(
            sourceJsonPaths != null && targetJsonPaths != null,
            'Invariant failed in MergeDirectiveEqualityConstraintEnhancer: source or target JsonPaths are undefined',
          );

          if (sourceJsonPaths.length !== targetJsonPaths.length) {
            // Occurs when property path has been merged away
            return;
          }

          sourceJsonPaths.forEach((sourceJsonPath: JsonPath, matchingTargetJsonPathIndex: number) => {
            equalityConstraints.push({
              sourceJsonPath,
              targetJsonPath: targetJsonPaths[matchingTargetJsonPathIndex],
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
