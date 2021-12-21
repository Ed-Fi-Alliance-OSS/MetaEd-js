import {
  getEntityFromNamespaceChain,
  DomainEntity,
  MetaEdEnvironment,
  ValidationFailure,
  DomainEntityExtension,
  TopLevelEntity,
} from 'metaed-core';

// METAED-805
const validatorName = 'AbstractEntityMustNotBeExtended';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    namespace.entity.domainEntityExtension.forEach((extensionEntity: DomainEntityExtension) => {
      const baseEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
        extensionEntity.metaEdName,
        extensionEntity.baseEntityNamespaceName,
        namespace,
        'domainEntity',
      ) as TopLevelEntity | null;

      if (baseEntity == null || !(baseEntity as DomainEntity).isAbstract) return;

      failures.push({
        validatorName,
        category: 'error',
        message: `${baseEntity.typeHumanizedName} ${baseEntity.metaEdName} additions is not valid.  Abstract entities cannot be extended.`,
        sourceMap: extensionEntity.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });

  return failures;
}
