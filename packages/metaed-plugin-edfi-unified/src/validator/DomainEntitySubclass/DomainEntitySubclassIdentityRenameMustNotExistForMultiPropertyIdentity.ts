import { MetaEdEnvironment, ValidationFailure, Namespace, TopLevelEntity } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domainEntitySubclass.forEach((domainEntitySubclass) => {
      if (!domainEntitySubclass.identityProperties.some((x) => x.isIdentityRename)) return;
      const baseEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
        domainEntitySubclass.baseEntityName,
        domainEntitySubclass.baseEntityNamespaceName,
        domainEntitySubclass.namespace,
        'domainEntity',
      ) as TopLevelEntity | null;
      if (baseEntity && baseEntity.identityProperties.length <= 1) return;

      failures.push({
        validatorName: 'DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity',
        category: 'error',
        message: `${domainEntitySubclass.typeHumanizedName} ${domainEntitySubclass.metaEdName} based on ${domainEntitySubclass.baseEntityName} is invalid for identity rename because parent entity ${domainEntitySubclass.baseEntityName} has more than one identity property.`,
        sourceMap: domainEntitySubclass.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
  return failures;
}
