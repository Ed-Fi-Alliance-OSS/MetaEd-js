import { ModelBase, ValidationFailure } from '@edfi/metaed-core';
import { asTopLevelEntity } from '@edfi/metaed-core';
import { groupByMetaEdName } from '../../shared/GroupByMetaEdName';

export function generateValidationErrorsForDuplicates(
  metaEdEntity: ModelBase[],
  validatorName: string,
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  groupByMetaEdName(metaEdEntity).forEach((entities, metaEdName) => {
    if (entities.length > 1) {
      entities.forEach((entity) => {
        failures.push({
          validatorName,
          category: 'error',
          message: `${
            asTopLevelEntity(entity).typeHumanizedName
          } named ${metaEdName} is a duplicate declaration of that name.`,
          sourceMap: asTopLevelEntity(entity).sourceMap.metaEdName,
          fileMap: null,
        });
      });
    }
  });
  return failures;
}
