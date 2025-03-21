// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { SourceMap, ValidationFailure, ModelBase, Namespace } from '@edfi/metaed-core';
import {
  findReferencedProperty,
  matchAll,
  matchAllButFirstAsIdentityProperties,
  matchAllIdentityReferenceProperties,
} from './FindReferencedProperty';

export function failReferencedPropertyDoesNotExist(
  validatorName: string,
  namespace: Namespace,
  entity: ModelBase,
  propertyPath: string[],
  pairedMergePropertyName: string,
  sourceMap: SourceMap,
  failures: ValidationFailure[],
) {
  const matchingProperty = findReferencedProperty(namespace, entity, [pairedMergePropertyName], matchAll());
  if (!matchingProperty) return;

  const filter =
    matchingProperty.isOptionalCollection || matchingProperty.isRequiredCollection
      ? matchAllIdentityReferenceProperties()
      : matchAllButFirstAsIdentityProperties();

  const propertyContext = findReferencedProperty(namespace, entity, propertyPath, filter);
  if (!propertyContext) {
    failures.push({
      validatorName,
      category: 'error',
      message: `Merge directive ${propertyPath.join(
        '.',
      )} must be a valid path. Either the path is not to a mergeable type, or no property '${R.last(
        propertyPath,
      )}' was found`,
      sourceMap,
      fileMap: null,
    });
  }
}
