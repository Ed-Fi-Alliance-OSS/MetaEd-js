// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Domain, DomainItem, Subdomain } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  (getAllEntitiesOfType(metaEd, 'domain', 'subdomain') as (Domain | Subdomain)[]).forEach((domain) => {
    // ignore data standard domain item deprecations unless in alliance mode
    if (!domain.namespace.isExtension && !metaEd.allianceMode) return;

    domain.domainItems.forEach((item: DomainItem) => {
      if (item.referencedEntityDeprecated) {
        failures.push({
          validatorName: 'DeprecatedDomainItemReferenceWarning',
          category: 'warning',
          message: `${domain.typeHumanizedName} ${domain.metaEdName} references deprecated entity ${item.metaEdName}.`,
          sourceMap: item.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    });
  });
  return failures;
}
