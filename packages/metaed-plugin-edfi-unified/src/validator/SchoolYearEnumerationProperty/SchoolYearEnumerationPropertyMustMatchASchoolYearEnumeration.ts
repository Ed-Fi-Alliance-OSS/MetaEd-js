import { MetaEdEnvironment, ValidationFailure, ModelBase } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.schoolYearEnumeration.forEach((property) => {
    const referencedEntity: ModelBase | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'schoolYearEnumeration',
    );

    if (referencedEntity == null) {
      failures.push({
        validatorName: 'SchoolYearEnumerationPropertyMustMatchASchoolYearEnumeration',
        category: 'error',
        message: `Enumeration property '${property.metaEdName}' does not match any declared Enumeration in namespace ${property.referencedNamespaceName}.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
