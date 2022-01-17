import { MetaEdEnvironment, ValidationFailure, CommonProperty } from '@edfi/metaed-core';

function hasIdentity(commonProperty: CommonProperty): boolean {
  return (
    commonProperty.referencedEntity.identityProperties.length > 0 ||
    (commonProperty.referencedEntity.baseEntity != null &&
      commonProperty.referencedEntity.baseEntity.identityProperties.length > 0)
  );
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.common.forEach((commonProperty) => {
    if (!commonProperty.isOptionalCollection && !commonProperty.isRequiredCollection) return;

    if (!hasIdentity(commonProperty)) {
      failures.push({
        validatorName: 'CommonPropertyCollectionTargetMustContainIdentity',
        category: 'error',
        message: `Common property ${commonProperty.metaEdName} cannot be used as a collection because ${commonProperty.referencedEntity.typeHumanizedName} ${commonProperty.referencedEntity.metaEdName} does not have any identity properties.`,
        sourceMap: commonProperty.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
