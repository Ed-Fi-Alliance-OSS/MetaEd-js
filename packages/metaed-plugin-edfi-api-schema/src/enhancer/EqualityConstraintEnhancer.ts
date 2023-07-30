import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  isReferentialProperty,
  ReferentialProperty,
  MergeDirective,
  EntityProperty,
  ModelBase,
} from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath, PropertyPath } from '../model/PathTypes';

/**
 * StudentCompetency/LearningObjective.StudentCompetency/LearningObjectiveSectionOrProgramChoice appear to have
 * an invalid merge directive target in GradingPeriod.Session
 *
 * METAED-1488 and METAED-1489 will address this. Once implemented, this check can be removed.
 */
function isErrorInDataStandard(entity: ModelBase, property: EntityProperty, mergeDirective: MergeDirective) {
  return (
    (entity.metaEdName === 'StudentCompetencyObjective' || entity.metaEdName === 'StudentLearningObjective') &&
    (property.metaEdName === 'StudentCompetencyObjectiveSectionOrProgramChoice' ||
      property.metaEdName === 'StudentLearningObjectiveSectionOrProgramChoice') &&
    mergeDirective.targetPropertyPathStrings.length === 2 &&
    mergeDirective.targetPropertyPathStrings[0] === 'GradingPeriod' &&
    mergeDirective.targetPropertyPathStrings[1] === 'Session'
  );
}

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
      const { jsonPathsMapping, equalityConstraints } = entity.data.edfiApiSchema as EntityApiSchemaData;

      // find properties on entity with merge directives
      (entity as TopLevelEntity).properties.forEach((property: EntityProperty) => {
        if (isReferentialProperty(property)) {
          const referentialProperty: ReferentialProperty = property as ReferentialProperty;
          referentialProperty.mergeDirectives.forEach((mergeDirective: MergeDirective) => {
            // StudentCompetencyObjective.StudentCompetencyObjectiveSectionOrProgramChoice appears to have
            // an invalid merge directive target in GradingPeriod.Session
            if (isErrorInDataStandard(entity, property, mergeDirective)) return;

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
