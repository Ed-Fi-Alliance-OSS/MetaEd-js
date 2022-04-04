import { MetaEdEnvironment, ValidationFailure, getAllProperties, EntityProperty } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    if (property.namespace.isExtension && property.metaEdName === property.roleName) {
      failures.push({
        validatorName: 'ExtensionNamespacePropertiesShouldNotHaveSameRoleNameAsPropertyName',
        category: 'warning',
        message: `${property.metaEdName} should not have the same name as its role name. This triggers a pattern that is not supported in extensions.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
