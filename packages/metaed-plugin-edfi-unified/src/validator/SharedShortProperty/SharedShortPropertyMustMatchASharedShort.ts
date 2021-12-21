import { MetaEdEnvironment, ValidationFailure, ModelBase, SharedInteger } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.sharedShort.forEach((property) => {
    const referencedEntity: ModelBase | null = getEntityFromNamespaceChain(
      property.referencedType,
      property.referencedNamespaceName,
      property.namespace,
      'sharedInteger',
    );

    if (referencedEntity == null || !(referencedEntity as SharedInteger).isShort) {
      failures.push({
        validatorName: 'SharedShortPropertyMustMatchASharedShort',
        category: 'error',
        message: `Shared short property '${property.metaEdName}' does not match any declared Shared Short in namespace ${property.referencedNamespaceName}.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
