import {
  MetaEdEnvironment,
  PropertyType,
  ValidationFailure,
  ReferentialProperty,
  asReferentialProperty,
  getPropertiesOfType,
  isReferentialProperty,
  TopLevelEntity,
} from '@edfi/metaed-core';

const validPropertyTypes: PropertyType[] = [
  'association',
  'choice',
  'common',
  'descriptor',
  'domainEntity',
  'enumeration',
  'inlineCommon',
  'schoolYearEnumeration',
  'sharedDecimal',
  'sharedInteger',
  'sharedShort',
  'sharedString',
];

function ancestors(entity: TopLevelEntity, accumulator: TopLevelEntity[]): TopLevelEntity[] {
  if (entity.baseEntity == null) return accumulator;
  accumulator.push(entity.baseEntity);
  return ancestors(entity.baseEntity, accumulator);
}

function hasCommonSuperClass(entity1: TopLevelEntity, entity2: TopLevelEntity): boolean {
  if (ancestors(entity1, []).includes(entity2)) return true;
  if (ancestors(entity2, []).includes(entity1)) return true;
  return false;
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getPropertiesOfType(metaEd.propertyIndex, ...validPropertyTypes).forEach((property) => {
    if (!isReferentialProperty(property)) return;
    const referentialProperty = asReferentialProperty(property);
    if (referentialProperty.mergeDirectives.length === 0) return;

    referentialProperty.mergeDirectives.forEach((mergeDirective) => {
      if (!mergeDirective.sourceProperty || !mergeDirective.targetProperty) return;

      if (mergeDirective.sourceProperty.type !== mergeDirective.targetProperty.type) {
        failures.push({
          validatorName: 'SourcePropertyAndTargetPropertyMustMatch',
          category: 'error',
          message: `The merge paths '${mergeDirective.sourcePropertyPathStrings.join(
            '.',
          )}' and '${mergeDirective.targetPropertyPathStrings.join('.')}' do not correspond to the same type.`,
          sourceMap: mergeDirective.sourceMap.sourcePropertyPathStrings,
          fileMap: null,
        });

        return;
      }

      // TODO: As of METAED-881, the current property here could also be one of the shared simple properties, which
      // are not currently extensions of ReferentialProperty but have an equivalent referencedEntity field
      const sourceReferencedEntity = (mergeDirective.sourceProperty as ReferentialProperty).referencedEntity;
      const targetReferencedEntity = (mergeDirective.targetProperty as ReferentialProperty).referencedEntity;

      if (sourceReferencedEntity === targetReferencedEntity) return;
      if (hasCommonSuperClass(sourceReferencedEntity, targetReferencedEntity)) return;

      failures.push({
        validatorName: 'SourcePropertyAndTargetPropertyMustMatch',
        category: 'error',
        message: `The merge paths '${mergeDirective.sourcePropertyPathStrings.join(
          '.',
        )}' and '${mergeDirective.targetPropertyPathStrings.join('.')}' do not correspond to the same entity.`,
        sourceMap: mergeDirective.sourceMap.sourcePropertyPathStrings,
        fileMap: null,
      });
    });
  });

  return failures;
}
