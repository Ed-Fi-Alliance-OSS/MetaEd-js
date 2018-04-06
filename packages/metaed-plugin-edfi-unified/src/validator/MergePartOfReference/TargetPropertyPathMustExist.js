// @flow
import R from 'ramda';
import type { PropertyType, MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { getPropertiesOfType, asReferentialProperty, isReferentialProperty } from 'metaed-core';
import { failReferencedPropertyDoesNotExist } from '../ValidatorShared/FailReferencedPropertyDoesNotExist';

const validPropertyTypes: Array<PropertyType> = [
  'association',
  'choice',
  'common',
  'descriptor',
  'domainEntity',
  'enumeration',
  'inlineCommon',
  'schoolYearEnumeration',
];

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];

  getPropertiesOfType(metaEd.propertyIndex, ...validPropertyTypes).forEach(property => {
    if (!isReferentialProperty(property)) return;
    const referentialProperty = asReferentialProperty(property);
    referentialProperty.mergedProperties.forEach(mergedProperty => {
      failReferencedPropertyDoesNotExist(
        'TargetPropertyPathMustExist',
        metaEd.entity,
        referentialProperty.parentEntity,
        mergedProperty.targetPropertyPath,
        R.head(mergedProperty.mergePropertyPath),
        R.head(mergedProperty.sourceMap.targetPropertyPath),
        failures,
      );
    });
  });

  return failures;
}
