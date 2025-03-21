// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ModelType, MetaEdEnvironment, ValidationFailure, Namespace, TopLevelEntity } from '@edfi/metaed-core';

const invalidTypes: ModelType[] = [
  'associationExtension',
  'associationSubclass',
  'choice',
  'commonExtension',
  'descriptor',
  'domainEntityExtension',
  'domainEntitySubclass',
];

const validTypeNames: string = [
  'Abstract Entity',
  'Association',
  'Common',
  'Common Subclass',
  'Domain Entity',
  'Inline Common',
].join(', ');

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    invalidTypes.forEach((invalidType: ModelType) => {
      const entities: TopLevelEntity[] = Array.from(namespace.entity[invalidType].values());
      entities.forEach((entity) => {
        if (!entity.identityProperties || entity.identityProperties.length === 0) return;
        entity.identityProperties.forEach((property) => {
          if (property.isIdentityRename) return;
          failures.push({
            validatorName: 'IdentityExistsOnlyIfIdentityIsAllowed',
            category: 'error',
            message: `'is part of identity' is invalid for property ${property.metaEdName} on ${entity.typeHumanizedName} ${entity.metaEdName}. 'is part of identity' is only valid for properties on ${validTypeNames}.`,
            sourceMap: property.sourceMap.isPartOfIdentity,
            fileMap: null,
          });
        });
      });
    });
  });
  return failures;
}
