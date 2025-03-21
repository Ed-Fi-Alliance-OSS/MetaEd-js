// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { versionSatisfies, V3OrGreater } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace, GeneratorResult, GeneratedOutput } from '@edfi/metaed-core';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

function fileName(projectPrefix: string): string {
  const prefix: string = projectPrefix === '' ? '' : `-${projectPrefix}`;
  return `ApiModel${prefix}.json`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];

  if (versionSatisfies(metaEd.dataStandardVersion, V3OrGreater)) {
    metaEd.namespace.forEach((namespace: Namespace) => {
      const structuredOutput = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

      results.push({
        name: 'API Model',
        namespace: namespace.namespaceName,
        folderName: 'ApiMetadata',
        fileName: fileName(namespace.projectExtension),
        resultString: JSON.stringify(structuredOutput, null, 2).replace(/\\r\\n/g, ''),
        resultStream: null,
      });
    });
  }

  return {
    generatorName: 'edfiOdsApi.ApiModelGenerator',
    generatedOutput: results,
  };
}
