// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  ShortProperty,
  StringProperty,
  DecimalProperty,
  IntegerProperty,
  MetaEdEnvironment,
  PropertyIndex,
  ValidationFailure,
  Namespace,
} from '@edfi/metaed-core';
import { groupByMetaEdName } from '../../shared/GroupByMetaEdName';

type SimpleProperties = ShortProperty | DecimalProperty | IntegerProperty | StringProperty;

function propertiesNeedingDuplicateChecking(properties: PropertyIndex, namespace: Namespace): SimpleProperties[] {
  const result: SimpleProperties[] = [];

  result.push(...properties.string.filter((property) => property.namespace === namespace));
  result.push(...properties.decimal.filter((property) => property.namespace === namespace));
  result.push(...properties.integer.filter((property) => property.namespace === namespace));
  result.push(...properties.short.filter((property) => property.namespace === namespace));
  result.push(...properties.sharedString.filter((property) => property.namespace === namespace));
  result.push(...properties.sharedDecimal.filter((property) => property.namespace === namespace));
  result.push(...properties.sharedInteger.filter((property) => property.namespace === namespace));
  result.push(...properties.sharedShort.filter((property) => property.namespace === namespace));
  return result;
}

function generateValidationErrorsForDuplicates(metaEdProperty: SimpleProperties[]): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  groupByMetaEdName(metaEdProperty).forEach((properties, metaEdName) => {
    if (properties.length > 1) {
      properties.forEach((property) => {
        failures.push({
          validatorName: 'SimplePropertiesCannotDuplicateNames',
          category: 'error',
          message: `${property.typeHumanizedName} named ${metaEdName} is a duplicate declaration of that name.`,
          sourceMap: property.sourceMap.metaEdName,
          fileMap: null,
        });
      });
    }
  });
  return failures;
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    failures.push(
      ...generateValidationErrorsForDuplicates(propertiesNeedingDuplicateChecking(metaEd.propertyIndex, namespace)),
    );
  });

  return failures;
}
