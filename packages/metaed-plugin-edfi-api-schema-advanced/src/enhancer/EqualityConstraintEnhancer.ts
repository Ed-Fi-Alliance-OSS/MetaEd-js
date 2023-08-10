import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  isReferentialProperty,
  ReferentialProperty,
  MergeDirective,
  EntityProperty,
} from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import type { EntityApiSchemaData, JsonPath, PropertyPath } from '@edfi/metaed-plugin-edfi-api-schema';
import type { EntityApiSchemaAdvancedData } from '../model/EntityApiSchemaAdvancedData';

function mergeDirectivePathStringsToPath(segments: string[]): PropertyPath {
  return segments.join('.') as PropertyPath;
}

/**
 * Creates EqualityConstraints from entity merge directives using JsonPathsMapping to find the source and
 * target JsonPaths.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const { jsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;
      const { equalityConstraints } = entity.data.edfiApiSchemaAdvanced as EntityApiSchemaAdvancedData;

      // find properties on entity with merge directives
      (entity as TopLevelEntity).properties.forEach((property: EntityProperty) => {
        if (isReferentialProperty(property)) {
          const referentialProperty: ReferentialProperty = property as ReferentialProperty;
          referentialProperty.mergeDirectives.forEach((mergeDirective: MergeDirective) => {
            const sourceJsonPaths: JsonPath[] | undefined =
              jsonPathsMapping[mergeDirectivePathStringsToPath(mergeDirective.sourcePropertyPathStrings)];
            const targetJsonPaths: JsonPath[] | undefined =
              jsonPathsMapping[mergeDirectivePathStringsToPath(mergeDirective.targetPropertyPathStrings)];
            invariant(
              sourceJsonPaths != null && targetJsonPaths != null,
              'Invariant failed in EqualityConstraintEnhancer: source or target JsonPaths are undefined',
            );
            invariant(
              sourceJsonPaths.length === targetJsonPaths.length,
              'Invariant failed in EqualityConstraintEnhancer: source and target JsonPath lengths not equal',
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
    enhancerName: 'EqualityConstraintEnhancer',
    success: true,
  };
}
