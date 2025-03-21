// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, DescriptorSourceMap, Namespace } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.descriptor.forEach((descriptor) => {
      if (descriptor.metaEdName.endsWith('Descriptor')) {
        failures.push({
          validatorName: 'DescriptorNameCannotEndInDescriptor',
          category: 'error',
          message: `Descriptor ${descriptor.metaEdName} name is invalid.  Descriptor names cannot be suffixed with 'Descriptor'.`,
          sourceMap: (descriptor.sourceMap as DescriptorSourceMap).metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}
