// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  ValidationFailure,
  StringProperty,
  StringPropertySourceMap,
  versionSatisfies,
  PluginEnvironment,
} from '@edfi/metaed-core';
import { asStringProperty } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.string.forEach((string) => {
    const stringProperty: StringProperty = asStringProperty(string);
    const minLength: number = Number.parseInt(stringProperty.minLength || '0', 10);
    if (minLength === 1 && stringProperty.isOptional) {
      const { targetTechnologyVersion } = metaEd.plugin.get('edfiUnified') as PluginEnvironment;
      failures.push({
        validatorName: 'StringPropertyMustNotHaveMinLengthOneOnOptionalFields',
        category: versionSatisfies(targetTechnologyVersion, '>=7.0.0') ? 'error' : 'warning',
        message: versionSatisfies(targetTechnologyVersion, '>=7.0.0')
          ? `String Property ${string.metaEdName} has min length 1 on optional field.`
          : `String Property ${string.metaEdName} has min length 1 on optional field. This warning will be treated as an error in API version 7.x`,
        sourceMap: (string.sourceMap as StringPropertySourceMap).minLength,
        fileMap: null,
      });
    }
  });

  return failures;
}
