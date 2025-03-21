// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DescriptorSourceMap,
  MetaEdEnvironment,
  Namespace,
  PluginEnvironment,
  SemVer,
  ValidationFailure,
  versionSatisfies,
} from '@edfi/metaed-core';

const targetTechnologyVersion: SemVer = '>=5.2';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  if (
    !versionSatisfies(
      (metaEd.plugin.get('edfiUnified') as PluginEnvironment).targetTechnologyVersion,
      targetTechnologyVersion,
    )
  ) {
    return [];
  }

  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.descriptor.forEach((descriptor) => {
      if (descriptor.properties.length > 0) {
        failures.push({
          validatorName: 'DescriptorMustNotHaveAttributes',
          category: 'error',
          message: `Disallowed as of ODS/API v5.2. The recommended pattern for descriptors that require additional attributes is to model as common entities.`,
          sourceMap: (descriptor.sourceMap as DescriptorSourceMap).metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
