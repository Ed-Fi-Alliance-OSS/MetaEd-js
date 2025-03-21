// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.descriptor.forEach((descriptorProperty) => {
    if (descriptorProperty.metaEdName.endsWith('Descriptor')) {
      failures.push({
        validatorName: 'DescriptorPropertyNameCannotEndInDescriptor',
        category: 'error',
        message: `Descriptor property ${descriptorProperty.metaEdName} name is invalid.  Descriptor names cannot be suffixed with 'Descriptor'.`,
        sourceMap: descriptorProperty.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });
  return failures;
}
