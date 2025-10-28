// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, GeneratorResult, GeneratedOutput, Namespace } from '@edfi/metaed-core';
import stringify from 'json-stable-stringify';

import { NamespaceEdfiApiSchema } from '../model/Namespace';

function fileName(projectPrefix: string): string {
  const prefix: string = projectPrefix === '' ? '' : `-${projectPrefix}`;
  return `ApiSchema${prefix}.json`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    const { apiSchema } = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;

    results.push({
      name: 'DMS API Schema',
      namespace: namespace.namespaceName,
      folderName: 'ApiSchema',
      fileName: fileName(namespace.projectExtension),
      resultString: stringify(apiSchema, { space: 2 }),
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiApiSchema.ApiSchemaGenerator',
    generatedOutput: results,
  };
}
