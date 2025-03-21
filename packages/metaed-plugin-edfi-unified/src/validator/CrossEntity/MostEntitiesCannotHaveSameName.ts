// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EntityRepository, ValidationFailure, Namespace, ModelBase } from '@edfi/metaed-core';
import { generateValidationErrorsForDuplicates } from '../ValidatorShared/ErrorsForDuplicateMetaEdNames';

// Domains, Subdomains, Interchanges, Enumerations and Descriptors don't have standard cross entity naming issues
// and extension entities don't define a new identifier
function entitiesNeedingDuplicateChecking(...namespaces: Namespace[]): ModelBase[] {
  const result: ModelBase[] = [];

  const entityRepositories: EntityRepository[] = namespaces.map((n: Namespace) => n.entity);
  entityRepositories.forEach((entityRepository: EntityRepository) => {
    result.push(...entityRepository.association.values());
    result.push(...entityRepository.associationSubclass.values());
    result.push(...entityRepository.choice.values());
    result.push(...entityRepository.common.values());
    result.push(...entityRepository.commonSubclass.values());
    result.push(...entityRepository.domainEntity.values());
    result.push(...entityRepository.domainEntitySubclass.values());
    result.push(...entityRepository.sharedDecimal.values());
    result.push(...entityRepository.sharedInteger.values());
    result.push(...entityRepository.sharedString.values());
  });
  return result;
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    failures.push(
      ...generateValidationErrorsForDuplicates(
        entitiesNeedingDuplicateChecking(namespace),
        'MostEntitiesCannotHaveSameName',
      ),
    );
  });

  return failures;
}
