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
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath, PropertyPath } from '../model/BrandedTypes';

function mergeDirectivePathStringsToPath(segments: string[]): PropertyPath {
  return segments.join('.') as PropertyPath;
}

/**
 * Creates EqualityConstraints from entity merge directives using EntityJsonPaths to find the source and
 * target JsonPaths.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const { entityJsonPaths, equalityConstraints } = entity.data.edfiApiSchema as EntityApiSchemaData;

      // find properties on entity with merge directives
      (entity as TopLevelEntity).properties.forEach((property: EntityProperty) => {
        if (isReferentialProperty(property)) {
          const referentialProperty: ReferentialProperty = property as ReferentialProperty;
          referentialProperty.mergeDirectives.forEach((mergeDirective: MergeDirective) => {
            const sourceJsonPaths: JsonPath[] =
              entityJsonPaths[mergeDirectivePathStringsToPath(mergeDirective.sourcePropertyPathStrings)];
            const targetJsonPaths: JsonPath[] =
              entityJsonPaths[mergeDirectivePathStringsToPath(mergeDirective.targetPropertyPathStrings)];
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
