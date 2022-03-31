import R from 'ramda';
import {
  PropertyType,
  MetaEdEnvironment,
  ValidationFailure,
  MergeDirective,
  getPropertiesOfType,
  asReferentialProperty,
  EntityProperty,
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

function isIdentityLikeProperty(property: EntityProperty): boolean {
  return (
    property.isPartOfIdentity || property.isIdentityRename || ['choice', 'inlineCommon'].includes(property.parentEntity.type)
  );
}

function makeFailure(failures: ValidationFailure[], mergeDirective: MergeDirective) {
  failures.push({
    validatorName: 'SourcePropertyPathMustExist',
    category: 'error',
    message: `Merge directive ${mergeDirective.sourcePropertyPathStrings.join(
      '.',
    )} must be a valid path. Either the path is not to a mergeable type, or no property '${R.last(
      mergeDirective.sourcePropertyPathStrings,
    )}' was found`,
    sourceMap: mergeDirective.sourceMap.sourcePropertyPathStrings,
    fileMap: null,
  });
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getPropertiesOfType(metaEd.propertyIndex, ...validPropertyTypes).forEach((property) => {
    // TODO: As of METAED-881, the current property here could also be one of the shared simple properties, which
    // are not currently extensions of ReferentialProperty but have an equivalent mergeDirectives field
    const referentialProperty = asReferentialProperty(property);
    referentialProperty.mergeDirectives.forEach((mergeDirective) => {
      if (mergeDirective.sourceProperty == null) {
        makeFailure(failures, mergeDirective);
        return;
      }
      if (mergeDirective.sourcePropertyPathStrings.length !== mergeDirective.sourcePropertyChain.length) {
        makeFailure(failures, mergeDirective);
        return;
      }
      const firstSourceProperty = mergeDirective.sourcePropertyChain[0];

      if (mergeDirective.targetPropertyChain.length < 1) return; // something wrong but not this validators problem
      const firstTargetProperty = mergeDirective.targetPropertyChain[0];
      if (firstTargetProperty.isCollection && !isIdentityLikeProperty(firstSourceProperty)) {
        makeFailure(failures, mergeDirective);
        return;
      }
      R.tail(mergeDirective.sourcePropertyChain).forEach((propertyInChain) => {
        if (!isIdentityLikeProperty(propertyInChain)) makeFailure(failures, mergeDirective);
      });
    });
  });

  return failures;
}
