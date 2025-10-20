// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import semver from 'semver';
import { MetaEdEnvironment, EnhancerResult, Namespace, SemVer, PluginEnvironment } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { deriveLogicalNameFromProjectName, newSchemaDefinition } from '../../model/apiModel/SchemaDefinition';

const enhancerName = 'BuildSchemaDefinitionEnhancer';
const targetVersions: SemVer = '>=3.1.1';

export function truncatePrereleaseIfExists(version: string): string {
  // strip off prerelease, if exists
  const semverWithoutPrerelease = semver.coerce(version);
  return semverWithoutPrerelease ? semverWithoutPrerelease.version : '3.1.0';
}

// Schema definition is the database schema and project name for a namespace
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition.schemaDefinition = {
      ...newSchemaDefinition(),
      logicalName: deriveLogicalNameFromProjectName(namespace.projectName),
      physicalName: namespace.namespaceName.toLowerCase(),
      description: versionSatisfies(targetTechnologyVersion, '>=5.3') ? namespace.projectDescription : undefined,
      version: versionSatisfies(targetTechnologyVersion, '4.0.0')
        ? truncatePrereleaseIfExists(namespace.projectVersion)
        : namespace.projectVersion,
    };
  });

  return {
    enhancerName,
    success: true,
  };
}
