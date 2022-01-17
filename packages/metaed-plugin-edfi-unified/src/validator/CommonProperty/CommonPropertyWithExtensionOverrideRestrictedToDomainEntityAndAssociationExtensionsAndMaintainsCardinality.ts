import {
  CommonPropertySourceMap,
  EntityProperty,
  TopLevelEntity,
  MetaEdEnvironment,
  ModelType,
  ValidationFailure,
  Namespace,
} from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

const validEntityTypes: ModelType[] = ['domainEntityExtension', 'associationExtension'];

function cardinalitiesMatch(originalProperty: EntityProperty, overrideProperty: EntityProperty): boolean {
  return (
    (originalProperty.isRequired && overrideProperty.isRequired) ||
    (originalProperty.isOptional && overrideProperty.isOptional) ||
    (originalProperty.isRequiredCollection && overrideProperty.isRequiredCollection) ||
    (originalProperty.isOptionalCollection && overrideProperty.isOptionalCollection)
  );
}

function baseEntityMatchingProperty(namespace: Namespace, overrideProperty: EntityProperty): EntityProperty | undefined {
  if (!validEntityTypes.includes(overrideProperty.parentEntity.type)) return undefined;
  // base type being extended - sketchy string manipulation here
  const baseType: ModelType = overrideProperty.parentEntity.type.replace('Extension', '') as ModelType;
  const baseSubclassType: ModelType = `${baseType}Subclass` as ModelType;

  const baseEntity: TopLevelEntity | null = getEntityFromNamespaceChain(
    overrideProperty.parentEntity.baseEntityName,
    overrideProperty.parentEntity.baseEntityNamespaceName,
    namespace,
    baseSubclassType,
    baseType,
  ) as TopLevelEntity | null;

  if (baseEntity == null) return undefined;

  return baseEntity.properties.find(
    (property) =>
      property.metaEdName === overrideProperty.metaEdName &&
      property.referencedNamespaceName === overrideProperty.referencedNamespaceName &&
      property.type === overrideProperty.type,
  );
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.common.forEach((commonProperty) => {
    if (!commonProperty.isExtensionOverride) return;
    const baseMatchingProperty: EntityProperty | undefined = baseEntityMatchingProperty(
      commonProperty.namespace,
      commonProperty,
    );
    if (baseMatchingProperty == null) {
      failures.push({
        validatorName:
          'CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality',
        category: 'error',
        message: `'common extension' is invalid for property ${commonProperty.metaEdName} on ${commonProperty.parentEntity.typeHumanizedName} ${commonProperty.parentEntity.metaEdName}. 'common extension' is only valid for referencing common properties with the same declaration as in the base entity.`,
        sourceMap: (commonProperty.sourceMap as CommonPropertySourceMap).isExtensionOverride,
        fileMap: null,
      });
    } else if (!cardinalitiesMatch(baseMatchingProperty, commonProperty)) {
      failures.push({
        validatorName:
          'CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality',
        category: 'error',
        message: `'common extension' is invalid for property ${commonProperty.metaEdName} on ${commonProperty.parentEntity.typeHumanizedName} ${commonProperty.parentEntity.metaEdName}. 'common extension' must maintain the same cardinality as in the base entity.`,
        sourceMap: (commonProperty.sourceMap as CommonPropertySourceMap).isExtensionOverride,
        fileMap: null,
      });
    }
  });
  return failures;
}
