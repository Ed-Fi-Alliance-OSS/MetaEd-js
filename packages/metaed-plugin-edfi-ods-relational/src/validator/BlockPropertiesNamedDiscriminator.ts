// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, SemVer, PluginEnvironment } from '@edfi/metaed-core';
import { getAllProperties, versionSatisfies } from '@edfi/metaed-core';

const targetTechnologyVersion: SemVer = '>=5.1.0';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  if (
    !versionSatisfies(
      (metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment).targetTechnologyVersion,
      targetTechnologyVersion,
    )
  )
    return failures;

  getAllProperties(metaEd.propertyIndex).forEach((property) => {
    if (property.metaEdName === 'Discriminator') {
      failures.push({
        validatorName: 'BlockPropertiesNamedDiscriminator',
        category: 'warning',
        message: `The ODS does not allow properties named 'Discriminator'.  ODS generation will likely fail.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
