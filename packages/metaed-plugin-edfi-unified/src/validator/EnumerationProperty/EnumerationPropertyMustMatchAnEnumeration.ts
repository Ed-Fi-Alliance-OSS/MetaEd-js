import { MetaEdEnvironment, ValidationFailure, ModelBase } from 'metaed-core';
import { getEntityFromNamespaceChain } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.enumeration.forEach((property) => {
    const referencedEntity: ModelBase | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'enumeration',
    );

    if (referencedEntity == null) {
      failures.push({
        validatorName: 'EnumerationPropertyMustMatchAEnumeration',
        category: 'error',
        message: `Enumeration property '${property.metaEdName}' does not match any declared Enumeration in namespace ${property.referencedNamespaceName}.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
