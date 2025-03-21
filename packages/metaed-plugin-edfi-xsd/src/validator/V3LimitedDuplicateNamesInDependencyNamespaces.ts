// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  Namespace,
  ValidationFailure,
  PluginEnvironment,
  TopLevelEntity,
  versionSatisfies,
  V3OrGreater,
} from '@edfi/metaed-core';
import { duplicateNameFinder } from './DuplicateNameFinder';

function isTargetTechnologyVersion(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies((metaEd.plugin.get('edfiXsd') as PluginEnvironment).targetTechnologyVersion, V3OrGreater);
}

function failureCollector(
  failures: ValidationFailure[],
  entityWithDuplicateName: TopLevelEntity,
  dependencyNamespace: Namespace,
) {
  failures.push({
    validatorName: 'V3LimitedDuplicateNamesInDependencyNamespaces',
    category: 'warning',
    message: `${entityWithDuplicateName.typeHumanizedName} named ${entityWithDuplicateName.metaEdName} already exists in project ${dependencyNamespace.projectName}. The XSD specification for this is currently undefined. MetaEd XSD generation and ODS/API bulk data loading will be disabled.`,
    sourceMap: entityWithDuplicateName.sourceMap.metaEdName,
    fileMap: null,
  });
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!isTargetTechnologyVersion(metaEd)) return failures;
  duplicateNameFinder(metaEd, failures, failureCollector);
  return failures;
}
