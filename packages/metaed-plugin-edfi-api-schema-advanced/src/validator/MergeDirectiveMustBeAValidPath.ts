import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  TopLevelEntity,
  isReferentialProperty,
  ReferentialProperty,
  MergeDirective,
  EntityProperty,
  ValidationFailure,
} from '@edfi/metaed-core';
import type { EntityApiSchemaData, PropertyPath } from '@edfi/metaed-plugin-edfi-api-schema';

function mergeDirectivePathStringsToPath(segments: string[]): PropertyPath {
  return segments.join('.') as PropertyPath;
}
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  // entities with referential properties
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      // find referential properties on entity with merge directives
      (entity as TopLevelEntity).properties.forEach((property: EntityProperty) => {
        if (isReferentialProperty(property)) {
          const referentialProperty: ReferentialProperty = property as ReferentialProperty;
          referentialProperty.mergeDirectives.forEach((mergeDirective: MergeDirective) => {
            // jsonPathsMapping has all valid paths for an entity
            const { jsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

            const sourceMergePath: PropertyPath = mergeDirectivePathStringsToPath(mergeDirective.sourcePropertyPathStrings);
            if (jsonPathsMapping[sourceMergePath] == null) {
              failures.push({
                validatorName: 'MergeDirectiveMustBeAValidPath',
                category: 'error',
                message: `Merge directive path ${sourceMergePath} is not a valid path on ${entity.metaEdName}`,
                sourceMap: mergeDirective.sourceMap.sourcePropertyPathStrings,
                fileMap: null,
              });
            }

            const targetMergePath: PropertyPath = mergeDirectivePathStringsToPath(mergeDirective.targetPropertyPathStrings);
            if (jsonPathsMapping[targetMergePath] == null) {
              failures.push({
                validatorName: 'MergeDirectiveMustBeAValidPath',
                category: 'error',
                message: `Merge directive path ${targetMergePath} is not a valid path on ${entity.metaEdName}`,
                sourceMap: mergeDirective.sourceMap.targetPropertyPathStrings,
                fileMap: null,
              });
            }
          });
        }
      });
    },
  );

  return failures;
}
