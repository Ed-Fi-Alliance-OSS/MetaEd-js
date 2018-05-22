// @flow
import type { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { getAllEntitiesNoSimpleTypesForNamespaces, asTopLevelEntity } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.isExtension) return;

    getAllEntitiesNoSimpleTypesForNamespaces([namespace]).forEach(entity => {
      if (entity.metaEdId) return;
      const topLevelEntity = asTopLevelEntity(entity);
      failures.push({
        validatorName: 'MetaEdIdIsRequiredForEntities',
        category: 'warning',
        message: `${topLevelEntity.typeHumanizedName} ${topLevelEntity.metaEdName} is missing a MetaEdId value.`,
        sourceMap: topLevelEntity.sourceMap.type,
        fileMap: null,
      });
    });
  });
  return failures;
}
