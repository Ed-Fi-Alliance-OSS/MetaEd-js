import { MetaEdEnvironment, getAllEntitiesOfType, ValidationFailure, ModelBase, TopLevelEntity } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllEntitiesOfType(metaEd, 'associationSubclass', 'domainEntitySubclass', 'commonSubclass').forEach(
    (entity: ModelBase) => {
      const { baseEntity } = entity as TopLevelEntity;
      if (baseEntity !== null && baseEntity.isDeprecated) {
        // ignore data standard subclass reference deprecations unless in alliance mode
        if (!entity.namespace.isExtension && !metaEd.allianceMode) return;
        failures.push({
          validatorName: 'DeprecatedEntitySubclassWarning',
          category: 'warning',
          message: `${entity.metaEdName} is a subclass of deprecated entity ${baseEntity.metaEdName}.`,
          sourceMap: (entity as TopLevelEntity).sourceMap.metaEdName,
          fileMap: null,
        });
      }
    },
  );

  return failures;
}
