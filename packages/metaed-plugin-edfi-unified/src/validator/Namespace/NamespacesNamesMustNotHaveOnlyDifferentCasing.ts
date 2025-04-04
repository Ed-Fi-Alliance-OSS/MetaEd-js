// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

const differOnlyInCaseFunction = (name: string, index: number, array: string[]) => {
  const found: string | undefined = array.find(
    (nameInFind: string, indexInFind: number) =>
      indexInFind !== index && nameInFind !== name && nameInFind.toLowerCase() === name.toLowerCase(),
  );
  return found != null;
};

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  const namespaceNames: string[] = Array.from(metaEd.namespace.keys());
  const duplicateNames: string[] = Array.from(namespaceNames.filter(differOnlyInCaseFunction));

  duplicateNames.forEach((duplicateName) => {
    failures.push({
      validatorName: 'NamespacesNamesMustNotHaveOnlyDifferentCasing',
      category: 'error',
      message: `${duplicateName} is a project name that differs only in case from another name.  Make the casing the same to indicate the same namespace or choose a different name.`,
      sourceMap: null,
      fileMap: null,
    });
  });

  return failures;
}
