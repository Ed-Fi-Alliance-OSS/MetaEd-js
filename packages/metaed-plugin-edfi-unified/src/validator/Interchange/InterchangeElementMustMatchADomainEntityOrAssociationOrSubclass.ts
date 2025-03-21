// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure, Interchange, InterchangeItem, ModelType } from '@edfi/metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from '@edfi/metaed-core';

const validTypes: ModelType[] = ['association', 'associationSubclass', 'descriptor', 'domainEntity', 'domainEntitySubclass'];

const validTypeNames: string = [
  'Abstract Entity',
  'Association',
  'Association Subclass',
  'Descriptor',
  'Domain Entity',
  'Domain Entity Subclass',
].join(', ');

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  (getAllEntitiesOfType(metaEd, 'interchange') as Interchange[]).forEach((interchange: Interchange) => {
    if (interchange.elements.length === 0) return;
    interchange.elements.forEach((item: InterchangeItem) => {
      const foundEntity = getEntityFromNamespaceChain(
        item.metaEdName,
        item.referencedNamespaceName,
        interchange.namespace,
        ...validTypes,
      );
      if (foundEntity != null) return;
      failures.push({
        validatorName: 'InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass',
        category: 'error',
        message: `Interchange element ${item.metaEdName} does not match any declared ${validTypeNames}`,
        sourceMap: item.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
  return failures;
}
