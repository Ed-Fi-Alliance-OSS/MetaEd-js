// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { SchemaContainer } from './schema/SchemaContainer';
import { newSchemaContainer } from './schema/SchemaContainer';

export interface NamespaceEdfiXsd {
  xsdSchema: SchemaContainer;
}

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiXsdTo(namespace: Namespace) {
  if (namespace.data.edfiXsd == null) namespace.data.edfiXsd = {};

  Object.assign(namespace.data.edfiXsd, {
    xsdSchema: newSchemaContainer(),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    addNamespaceEdfiXsdTo(namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
