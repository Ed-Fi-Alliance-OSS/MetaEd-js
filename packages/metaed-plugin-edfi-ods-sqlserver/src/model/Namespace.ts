// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, newPluginEnvironment } from '@edfi/metaed-core';
import { newSchemaContainer } from './SchemaContainer';
import { SchemaContainer } from './SchemaContainer';

export interface NamespaceEdfiOdsSqlServer {
  odsSchema: SchemaContainer;
}

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiOdsSqlServerTo(namespace: Namespace) {
  if (namespace.data.edfiOdsSqlServer == null) namespace.data.edfiOdsSqlServer = {};

  Object.assign(namespace.data.edfiOdsSqlServer, {
    odsSchema: newSchemaContainer(),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiOdsSqlServerPlugin = metaEd.plugin.get('edfiOdsSqlServer');
  if (edfiOdsSqlServerPlugin == null) {
    metaEd.plugin.set('edfiOdsSqlServer', {
      ...newPluginEnvironment(),
      shortName: 'edfiOdsSqlServer',
    });
  }

  metaEd.namespace.forEach((namespace: Namespace) => {
    addNamespaceEdfiOdsSqlServerTo(namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
