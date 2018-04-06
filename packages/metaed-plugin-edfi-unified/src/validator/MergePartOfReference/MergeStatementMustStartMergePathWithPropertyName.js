// @flow
import type { PropertyType, MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { getPropertiesOfType, asReferentialProperty, isReferentialProperty } from 'metaed-core';

const validTypes: Array<PropertyType> = ['common', 'inlineCommon', 'choice', 'association', 'domainEntity'];

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  getPropertiesOfType(metaEd.propertyIndex, ...validTypes).forEach(property => {
    if (!isReferentialProperty(property)) return;
    const referentialProperty = asReferentialProperty(property);
    referentialProperty.mergedProperties.forEach(mergedProperty => {
      const prefix: string =
        referentialProperty.withContext && referentialProperty.withContext !== referentialProperty.metaEdName
          ? referentialProperty.withContext
          : '';
      if (mergedProperty.mergePropertyPath[0] === `${prefix}${referentialProperty.metaEdName}`) return;

      failures.push({
        validatorName: 'MergeStatementMustStartMergePathWithPropertyName',
        category: 'error',
        message: `Merge statement must start first property path with the current property ${
          prefix ? 'context and ' : ''
        }name: ${prefix}${referentialProperty.metaEdName}.`,
        sourceMap: mergedProperty.sourceMap.mergePropertyPath[0],
        fileMap: null,
      });
    });
  });
  return failures;
}
