// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { findDuplicates } from '../ValidatorShared/FindDuplicates';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.subdomain.forEach((subdomain) => {
      const names = subdomain.domainItems.map((di) => di.metaEdName);
      const duplicates: string[] = findDuplicates(names);

      duplicates.forEach((val) => {
        const domainItem = subdomain.domainItems.find((d) => d.metaEdName === val);
        if (domainItem !== undefined) {
          failures.push({
            validatorName: 'SubdomainMustNotDuplicateDomainItems',
            category: 'error',
            message: `Subdomain Entity Domain Item '${domainItem.metaEdName}' has a duplicate Domain Item.`,
            sourceMap: domainItem.sourceMap.metaEdName,
            fileMap: null,
          });
        }
      });
    });
  });

  return failures;
}
