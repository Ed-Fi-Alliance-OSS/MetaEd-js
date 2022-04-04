import {
  MetaEdEnvironment,
  ValidationFailure,
  getAllProperties,
  EntityProperty,
  isReferentialProperty,
  ReferentialProperty,
} from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    if (isReferentialProperty(property) && (property as ReferentialProperty).referencedEntity === property.parentEntity) {
      if (property.type === 'inlineCommon' || property.type === 'choice') {
        failures.push({
          validatorName: 'SelfReferencingPropertiesMustHaveRoleNameIfAllowed',
          category: 'error',
          message: `${property.parentEntity.typeHumanizedName} may not have a property that references its parent.`,
          sourceMap: property.sourceMap.metaEdName,
          fileMap: null,
        });
      } else if (property.roleName === '') {
        failures.push({
          validatorName: 'SelfReferencingPropertiesMustHaveRoleNameIfAllowed',
          category: 'error',
          message: `Property referencing parent ${property.parentEntity.typeHumanizedName} ${property.parentEntityName} must have a role name.`,
          sourceMap: property.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    }
  });

  return failures;
}
