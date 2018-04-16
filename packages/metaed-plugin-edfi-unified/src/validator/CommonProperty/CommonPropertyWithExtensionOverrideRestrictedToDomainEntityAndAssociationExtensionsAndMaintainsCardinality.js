// @flow
import type {
  CommonPropertySourceMap,
  EntityProperty,
  EntityRepository,
  MetaEdEnvironment,
  ModelType,
  ValidationFailure,
} from 'metaed-core';

const validEntityTypes: ModelType[] = ['domainEntityExtension', 'associationExtension'];

function cardinalitiesMatch(originalProperty: EntityProperty, overrideProperty: EntityProperty): boolean {
  return (
    (originalProperty.isRequired && overrideProperty.isRequired) ||
    (originalProperty.isOptional && overrideProperty.isOptional) ||
    (originalProperty.isRequiredCollection && overrideProperty.isRequiredCollection) ||
    (originalProperty.isOptionalCollection && overrideProperty.isOptionalCollection)
  );
}

function parentEntityProperty(entity: EntityRepository, overrideProperty: EntityProperty): EntityProperty | void {
  if (!validEntityTypes.includes(overrideProperty.parentEntity.type)) return undefined;
  const parentType = overrideProperty.parentEntity.type.replace('Extension', '');
  // $FlowIgnore - allowing parentType to specify the entityRepository Map property
  const parentEntity = entity[parentType].get(overrideProperty.parentEntityName);
  return parentEntity.properties.find(
    property => property.metaEdName === overrideProperty.metaEdName && property.type === overrideProperty.type,
  );
}

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  metaEd.propertyIndex.common.forEach(common => {
    if (!common.isExtensionOverride) return;
    const parentProperty = parentEntityProperty(metaEd.entity, common);
    if (!parentProperty) {
      failures.push({
        validatorName:
          'CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality',
        category: 'error',
        message: `'common extension' is invalid for property ${common.metaEdName} on ${
          common.parentEntity.typeHumanizedName
        } ${common.parentEntity.metaEdName}. 'common extension' is only valid for referencing Common extensions.`,
        sourceMap: ((common.sourceMap: any): CommonPropertySourceMap).isExtensionOverride,
        fileMap: null,
      });
    } else if (!cardinalitiesMatch(parentProperty, common)) {
      failures.push({
        validatorName:
          'CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality',
        category: 'error',
        message: `'common extension' is invalid for property ${common.metaEdName} on ${
          common.parentEntity.typeHumanizedName
        } ${common.parentEntity.metaEdName}. 'common extension' must maintain original cardinality.`,
        sourceMap: ((common.sourceMap: any): CommonPropertySourceMap).isExtensionOverride,
        fileMap: null,
      });
    }
  });
  return failures;
}
