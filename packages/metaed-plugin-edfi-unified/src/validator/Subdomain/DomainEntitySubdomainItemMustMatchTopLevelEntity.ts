// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DomainItem, MetaEdEnvironment, ValidationFailure, Namespace, versionSatisfies } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

function getFailure(domainItem: DomainItem, name: string, failureMessage: string): ValidationFailure {
  return {
    validatorName: name,
    category: 'error',
    message: failureMessage,
    sourceMap: domainItem.sourceMap.referencedType,
    fileMap: null,
  };
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  // METAED-1644 Ticket Created to support Ed-Fi 5.2.0 and higher
  // Domain Entity Subdomain Item property 'StudentAssessmentItem' does not match any declared Domain Entity
  // or Domain Entity Subclass in namespace Error in StudentAssessment.metaed
  if (!versionSatisfies(metaEd.dataStandardVersion, '>5.2.0')) {
    return failures;
  }

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.subdomain.forEach((subdomain) => {
      subdomain.domainItems.forEach((domainItem) => {
        if (domainItem.referencedType !== 'domainEntity') return;
        if (
          getEntityFromNamespaceChain(
            domainItem.metaEdName,
            domainItem.referencedNamespaceName,
            namespace,
            'domainEntity',
            'domainEntitySubclass',
          ) == null
        ) {
          failures.push(
            getFailure(
              domainItem,
              'DomainEntitySubdomainItemMustMatchTopLevelEntity',
              `Domain Entity Subdomain Item property '${domainItem.metaEdName}' does not match any declared Domain Entity or Domain Entity Subclass in namespace ${domainItem.referencedNamespaceName}.`,
            ),
          );
        }
      });
    });
  });

  return failures;
}
