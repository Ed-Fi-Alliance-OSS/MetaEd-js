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
        'MergePropertyPathMustExist',
        metaEd.entity,
        referentialProperty.parentEntity,
        mergedProperty.mergePropertyPath,
        R.head(mergedProperty.targetPropertyPath),
        R.head(mergedProperty.sourceMap.mergePropertyPath),
        failures,
      );
    });
  });

  return failures;
}
