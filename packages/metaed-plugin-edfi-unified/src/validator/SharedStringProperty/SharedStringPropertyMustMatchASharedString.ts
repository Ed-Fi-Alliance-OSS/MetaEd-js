import { MetaEdEnvironment, ValidationFailure, ModelBase } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.sharedString.forEach((property) => {
    const referencedEntity: ModelBase | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'sharedString',
    );

    if (referencedEntity == null) {
      failures.push({
        validatorName: 'SharedStringPropertyMustMatchASharedString',
        category: 'error',
        message: `Shared string property '${property.metaEdName}' does not match any declared Shared String in namespace ${property.referencedNamespaceName}.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
