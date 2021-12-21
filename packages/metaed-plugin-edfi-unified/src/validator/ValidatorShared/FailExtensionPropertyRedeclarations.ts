import { TopLevelEntity, EntityProperty, CommonProperty, ValidationFailure } from 'metaed-core';

function isNotCommonExtensionOverride(entityProperty: EntityProperty): boolean {
  if (entityProperty.type !== 'common') return true;
  return !(entityProperty as CommonProperty).isExtensionOverride;
}

export function failExtensionPropertyRedeclarations(
  validatorName: string,
  extensionEntity: TopLevelEntity,
  baseEntity: TopLevelEntity,
  failures: ValidationFailure[],
) {
  extensionEntity.properties.forEach((extensionProperty) => {
    baseEntity.properties.forEach((baseProperty) => {
      if (
        extensionProperty.metaEdName === baseProperty.metaEdName &&
        extensionProperty.roleName === baseProperty.roleName &&
        isNotCommonExtensionOverride(extensionProperty)
      ) {
        failures.push({
          validatorName,
          category: 'error',
          message: `${extensionEntity.typeHumanizedName} ${extensionEntity.metaEdName} redeclares property ${extensionProperty.metaEdName} of base ${baseEntity.typeHumanizedName}.`,
          sourceMap: extensionProperty.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
}
