// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SemVer, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace, newPluginEnvironment } from '@edfi/metaed-core';

export function metaEdEnvironmentForApiVersion(targetTechnologyVersion: SemVer): MetaEdEnvironment {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiOdsRelational', { ...newPluginEnvironment(), targetTechnologyVersion });
  return metaEd;
}

export function newCoreNamespace(): Namespace {
  return {
    ...newNamespace(),
    namespaceName: 'EdFi',
    isExtension: false,
    data: {
      edfiOdsRelational: {
        deleteTrackingTable: [],
        deleteTrackingTrigger: [],
        enableChangeTracking: [],
      },
    },
  };
}

export function newExtensionNamespace(namespaceName: string): Namespace {
  return {
    ...newNamespace(),
    namespaceName,
    isExtension: true,
    data: {
      edfiOdsRelational: {
        deleteTrackingTable: [],
        deleteTrackingTrigger: [],
        enableChangeTracking: [],
      },
    },
  };
}
