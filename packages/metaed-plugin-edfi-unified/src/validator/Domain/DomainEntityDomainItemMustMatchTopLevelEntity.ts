// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DomainItem, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

/** Creates a nonblocking diagnostic for an unresolved domain entity member. */
function getFailure(domainItem: DomainItem, name: string, failureMessage: string): ValidationFailure {
  return {
    validatorName: name,
    // Bundled models still contain mistyped domain members; report them without blocking builds.
    category: 'warning',
    message: failureMessage,
    sourceMap: domainItem.sourceMap.referencedType,
    fileMap: null,
  };
}

/** Warns when a domain entity member cannot resolve to a domain entity or subclass. */
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.domain.forEach((domain) => {
      domain.domainItems.forEach((domainItem) => {
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
              'DomainEntityDomainItemMustMatchTopLevelEntity',
              `Domain Entity Domain Item property '${domainItem.metaEdName}' does not match any declared Domain Entity or Domain Entity Subclass in namespace ${domainItem.referencedNamespaceName}.`,
            ),
          );
        }
      });
    });
  });

  return failures;
}
