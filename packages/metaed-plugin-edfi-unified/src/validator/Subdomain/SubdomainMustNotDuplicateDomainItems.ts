// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { findDuplicates } from '../ValidatorShared/FindDuplicates';

// Validates that Domain Items within a Subdomain have unique names per referenced type
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.subdomain.forEach((subdomain) => {
      // Group domainItems by referencedType
      const groupedByType: { [key: string]: typeof subdomain.domainItems } = {};

      subdomain.domainItems.forEach((item) => {
        if (!groupedByType[item.referencedType]) {
          groupedByType[item.referencedType] = [];
        }
        groupedByType[item.referencedType].push(item);
      });

      // Check for duplicates within each referencedType group
      Object.entries(groupedByType).forEach(([referencedType, items]) => {
        const names = items.map((di) => di.metaEdName);
        const duplicates: string[] = findDuplicates(names);

        duplicates.forEach((val) => {
          const domainItem = items.find((d) => d.metaEdName === val);
          if (domainItem !== undefined) {
            failures.push({
              validatorName: 'SubdomainMustNotDuplicateDomainItems',
              category: 'error',
              message: `Subdomain Entity Domain Item '${domainItem.metaEdName}' of type '${referencedType}' has a duplicate within the same type.`,
              sourceMap: domainItem.sourceMap.metaEdName,
              fileMap: null,
            });
          }
        });
      });
    });
  });

  return failures;
}
