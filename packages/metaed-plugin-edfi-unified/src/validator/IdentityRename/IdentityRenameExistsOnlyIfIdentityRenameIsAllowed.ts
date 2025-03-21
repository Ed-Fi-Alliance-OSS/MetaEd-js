// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  ModelType,
  MetaEdEnvironment,
  ValidationFailure,
  Namespace,
  EntityProperty,
  TopLevelEntity,
} from '@edfi/metaed-core';

const invalidTypes: ModelType[] = [
  'association',
  'associationExtension',
  'choice',
  'common',
  'commonExtension',
  'commonSubclass',
  'descriptor',
  'domainEntity',
  'domainEntityExtension',
];

const validTypeNames: string = ['Domain Entity Subclass', 'Association Subclass'].join(' and ');

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    invalidTypes.forEach((invalidType: ModelType) => {
      const entities: TopLevelEntity[] = Array.from(namespace.entity[invalidType].values());
      entities.forEach((entity: TopLevelEntity) => {
        if (!entity.identityProperties || entity.identityProperties.length === 0) return;
        entity.identityProperties.forEach((property: EntityProperty) => {
          if (!property.isIdentityRename) return;
          failures.push({
            validatorName: 'IdentityRenameExistsOnlyIfIdentityRenameIsAllowed',
            category: 'error',
            message: `'renames identity property' is invalid for property ${property.metaEdName} on ${entity.typeHumanizedName} ${entity.metaEdName}. 'renames identity property' is only valid for properties on ${validTypeNames}.`,
            sourceMap: property.sourceMap.isPartOfIdentity,
            fileMap: null,
          });
        });
      });
    });
  });
  return failures;
}
