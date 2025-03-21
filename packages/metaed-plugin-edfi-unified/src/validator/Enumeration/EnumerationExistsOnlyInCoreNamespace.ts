// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    if (!namespace.isExtension) return;
    namespace.entity.enumeration.forEach((enumeration) => {
      failures.push({
        validatorName: 'EnumerationExistsOnlyInCoreNamespace',
        category: 'warning',
        message: `${enumeration.typeHumanizedName} ${enumeration.metaEdName} will no longer be valid in extension namespace ${enumeration.namespace.projectExtension} in future releases.  Please convert to a Descriptor.`,
        sourceMap: enumeration.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
  return failures;
}
