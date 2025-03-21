// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace) => {
    if (!namespace.isExtension) return;
    namespace.entity.common.forEach((common) => {
      if (!common.inlineInOds || !common.namespace.isExtension) return;
      failures.push({
        validatorName: 'InlineCommonExistsOnlyInCoreNamespace',
        category: 'error',
        message: `${common.typeHumanizedName} ${common.metaEdName} is not valid in extension namespace ${common.namespace.namespaceName}.`,
        sourceMap: common.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
  return failures;
}
