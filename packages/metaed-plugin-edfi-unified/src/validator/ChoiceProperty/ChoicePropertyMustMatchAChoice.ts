import { MetaEdEnvironment, ValidationFailure, ModelBase } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.choice.forEach((property) => {
    const referencedEntity: ModelBase | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'choice',
    );

    if (referencedEntity == null) {
      failures.push({
        validatorName: 'ChoicePropertyMustMatchAChoice',
        category: 'error',
        message: `Choice property '${property.metaEdName}' does not match any declared Choice in namespace ${property.referencedNamespaceName}.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
