// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { PropertyType, MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { getPropertiesOfType, asReferentialProperty } from '@edfi/metaed-core';

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
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  getPropertiesOfType(metaEd.propertyIndex, ...validPropertyTypes).forEach((property) => {
    // TODO: As of METAED-881, the current property here could also be one of the shared simple properties, which
    // are not currently extensions of ReferentialProperty but have an equivalent mergeDirectives field
    const referentialProperty = asReferentialProperty(property);
    referentialProperty.mergeDirectives.forEach((mergeDirective) => {
      const prefix: string =
        referentialProperty.roleName && referentialProperty.roleName !== referentialProperty.metaEdName
          ? referentialProperty.roleName
          : '';
      if (mergeDirective.sourcePropertyPathStrings[0] === `${prefix}${referentialProperty.metaEdName}`) return;

      failures.push({
        validatorName: 'MergeDirectiveMustStartSourcePathWithPropertyName',
        category: 'error',
        message: `Merge directive must start first property path with the current property ${
          prefix ? 'context and ' : ''
        }name: ${prefix}${referentialProperty.metaEdName}.`,
        sourceMap: mergeDirective.sourceMap.sourcePropertyPathStrings,
        fileMap: null,
      });
    });
  });
  return failures;
}
