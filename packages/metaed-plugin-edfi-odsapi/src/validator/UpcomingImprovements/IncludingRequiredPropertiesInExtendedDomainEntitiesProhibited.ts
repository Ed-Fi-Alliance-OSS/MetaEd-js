// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// 2.1.X.2 - METAED-701
import { MetaEdEnvironment, ValidationFailure, DomainEntityExtension, SemVer, PluginEnvironment } from '@edfi/metaed-core';
import { getAllEntitiesOfType, versionSatisfies } from '@edfi/metaed-core';

const targetTechnologyVersion: SemVer = '<5.3';

function isTargetTechnologyVersion(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies(
    (metaEd.plugin.get('edfiOdsApi') as PluginEnvironment).targetTechnologyVersion,
    targetTechnologyVersion,
  );
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!isTargetTechnologyVersion(metaEd)) return failures;

  (getAllEntitiesOfType(metaEd, 'domainEntityExtension') as DomainEntityExtension[]).forEach(
    (domainEntityExtension: DomainEntityExtension) => {
      domainEntityExtension.properties.forEach((property) => {
        if (property.isRequired) {
          failures.push({
            validatorName: 'IncludingRequiredPropertiesInExtendedDomainEntitiesProhibited',
            category: 'warning',
            message: `${domainEntityExtension.typeHumanizedName} ${domainEntityExtension.metaEdName} is an extension with required property ${property.metaEdName}.  The ODS/API does not currently support this pattern.`,
            sourceMap: property.sourceMap.metaEdName,
            fileMap: null,
          });
        }
      });
    },
  );

  return failures;
}
