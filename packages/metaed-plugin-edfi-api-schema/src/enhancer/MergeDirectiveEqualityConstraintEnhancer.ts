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

function mergeDirectivePathStringsToPath(segments: string[]): MetaEdPropertyPath {
  return segments.join('.') as MetaEdPropertyPath;
}

/**
 * Creates EqualityConstraints from entity merge directives using JsonPathsMapping to find the source and
 * target JsonPaths.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const { allJsonPathsMapping, equalityConstraints } = entity.data.edfiApiSchema as EntityApiSchemaData;

      // find properties on entity with merge directives
      (entity as TopLevelEntity).properties.forEach((property: EntityProperty) => {
        if (isReferentialProperty(property)) {
          const referentialProperty: ReferentialProperty = property as ReferentialProperty;
          referentialProperty.mergeDirectives.forEach((mergeDirective: MergeDirective) => {
            const sourceJsonPaths: JsonPath[] | undefined =
              allJsonPathsMapping[mergeDirectivePathStringsToPath(mergeDirective.sourcePropertyPathStrings)].jsonPaths;
            const targetJsonPaths: JsonPath[] | undefined =
              allJsonPathsMapping[mergeDirectivePathStringsToPath(mergeDirective.targetPropertyPathStrings)].jsonPaths;
            invariant(
              sourceJsonPaths != null && targetJsonPaths != null,
              'Invariant failed in MergeDirectiveEqualityConstraintEnhancer: source or target JsonPaths are undefined',
            );
            invariant(
              sourceJsonPaths.length === targetJsonPaths.length,
              'Invariant failed in MergeDirectiveEqualityConstraintEnhancer: source and target JsonPath lengths not equal',
            );
            sourceJsonPaths.forEach((sourceJsonPath: JsonPath, matchingTargetJsonPathIndex: number) => {
              equalityConstraints.push({
                sourceJsonPath,
                targetJsonPath: targetJsonPaths[matchingTargetJsonPathIndex],
              });
            });
          });
        }
      });
    },
  );

  return {
    enhancerName: 'MergeDirectiveEqualityConstraintEnhancer',
    success: true,
  };
}
