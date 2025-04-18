// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  ValidationFailure,
  ReferentialProperty,
  SimpleProperty,
  getAllProperties,
  EntityProperty,
} from '@edfi/metaed-core';

function hasReferencedEntityDeprecated(property: EntityProperty): property is ReferentialProperty | SimpleProperty {
  return (property as ReferentialProperty | SimpleProperty).referencedEntityDeprecated !== undefined;
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  getAllProperties(metaEd.propertyIndex).forEach((property) => {
    // ignore data standard property deprecations unless in alliance mode
    if (!property.parentEntity.namespace.isExtension && !metaEd.allianceMode) return;

    if (property.isDeprecated) {
      failures.push({
        validatorName: 'DeprecatedPropertyWarning',
        category: 'warning',
        message: `${property.metaEdName} is deprecated.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    } else if (hasReferencedEntityDeprecated(property) && property.referencedEntityDeprecated) {
      failures.push({
        validatorName: 'DeprecatedPropertyWarning',
        category: 'warning',
        message: `${property.parentEntity.typeHumanizedName} ${property.parentEntity.metaEdName} references deprecated entity ${property.metaEdName}.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
