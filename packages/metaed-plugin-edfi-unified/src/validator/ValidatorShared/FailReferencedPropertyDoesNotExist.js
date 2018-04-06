// @flow
import R from 'ramda';
import type { SourceMap, ValidationFailure, ModelBase } from 'metaed-core';
import { EntityRepository } from 'metaed-core';
import {
  findReferencedProperty,
  matchAll,
  matchAllButFirstAsIdentityProperties,
  matchAllIdentityReferenceProperties,
} from '../ValidatorShared/FindReferencedProperty';

export function failReferencedPropertyDoesNotExist(
  validatorName: string,
  repository: EntityRepository,
  entity: ModelBase,
  propertyPath: Array<string>,
  pairedMergePropertyName: string,
  sourceMap: SourceMap,
  failures: Array<ValidationFailure>,
) {
  const matchingProperty = findReferencedProperty(repository, entity, [pairedMergePropertyName], matchAll());
  if (!matchingProperty) return;

  const filter =
    matchingProperty.isOptionalCollection || matchingProperty.isRequiredCollection
      ? matchAllIdentityReferenceProperties()
      : matchAllButFirstAsIdentityProperties();

  const propertyContext = findReferencedProperty(repository, entity, propertyPath, filter);
  if (!propertyContext) {
    failures.push({
      validatorName,
      category: 'error',
      message: `Merge statement ${propertyPath.join('.')} must be a valid path. No Property ${R.last(
        propertyPath,
      )} was found`,
      sourceMap,
      fileMap: null,
    });
  }
}
