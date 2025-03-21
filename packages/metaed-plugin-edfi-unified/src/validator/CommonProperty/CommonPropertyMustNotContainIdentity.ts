// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.common.forEach((common) => {
    if (!common.isPartOfIdentity) return;
    failures.push({
      validatorName: 'CommonPropertyMustNotContainIdentity',
      category: 'error',
      message: `Common property ${common.metaEdName} is invalid to be used for the identity of ${common.parentEntity.typeHumanizedName} ${common.parentEntityName}.`,
      sourceMap: common.sourceMap.isPartOfIdentity,
      fileMap: null,
    });
  });
  return failures;
}
