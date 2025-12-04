// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import semver from 'semver';
import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { deriveLogicalNameFromProjectName, newSchemaDefinition } from '../../model/apiModel/SchemaDefinition';

const enhancerName = 'BuildSchemaDefinitionEnhancer';

export function truncatePrereleaseIfExists(version: string): string {
  // strip off prerelease, if exists
  const semverWithoutPrerelease = semver.coerce(version);
  return semverWithoutPrerelease ? semverWithoutPrerelease.version : '3.1.0';
}

// Schema definition is the database schema and project name for a namespace
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition.schemaDefinition = {
      ...newSchemaDefinition(),
      logicalName: deriveLogicalNameFromProjectName(namespace.projectName),
      physicalName: namespace.namespaceName.toLowerCase(),
      description: namespace.projectDescription,
      version: namespace.projectVersion,
    };
  });

  return {
    enhancerName,
    success: true,
  };
}
