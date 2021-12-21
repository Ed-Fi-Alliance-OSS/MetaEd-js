import { MetaEdEnvironment, ValidationFailure, EntityProperty, getAllProperties } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    if (!property.isIdentityRename) return;
    if (property.parentEntity.baseEntity == null) return;
    const baseProperty: EntityProperty | undefined = property.parentEntity.baseEntity.properties.find(
      (p) => p.metaEdName === property.baseKeyName,
    );
    if (baseProperty == null) {
      failures.push({
        validatorName: 'IdentityRenameTypeMustMatchBaseProperty',
        category: 'error',
        message: `'renames identity property' is invalid for property ${property.metaEdName} on ${property.parentEntity.typeHumanizedName} ${property.parentEntity.metaEdName}. 'renames identity property' must match name of property on the base entity.`,
        sourceMap: property.sourceMap.baseKeyName,
        fileMap: null,
      });
      return;
    }
    if (baseProperty.type !== property.type) {
      failures.push({
        validatorName: 'IdentityRenameTypeMustMatchBaseProperty',
        category: 'error',
        message: `'renames identity property' is invalid for property ${property.metaEdName} on ${property.parentEntity.typeHumanizedName} ${property.parentEntity.metaEdName}. 'renames identity property' must match type of property on the base entity.`,
        sourceMap: property.sourceMap.baseKeyName,
        fileMap: null,
      });
    }
  });

  return failures;
}
