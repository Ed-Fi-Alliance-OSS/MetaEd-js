// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { versionSatisfies } from '@edfi/metaed-core';
import type { GeneratedOutput, GeneratorResult, MetaEdEnvironment, PluginEnvironment } from '@edfi/metaed-core';
import { changeQueryPath } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';

const generatorName = `${PLUGIN_NAME}.CreateChangeVersionSequenceGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const generatedOutput: GeneratedOutput[] = [];
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');
  const isStyle6dot0 = versionSatisfies(targetTechnologyVersion, '>=6.0.0');

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().createChangeVersionSequence({
      useLicenseHeader,
      isStyle6dot0,
    });

    generatedOutput.push({
      name: 'ODS Change Event: CreateChangeVersionSequenceGenerator',
      namespace: namespace.namespaceName,
      folderName: changeQueryPath(databaseSpecificFolderName),
      fileName: '0020-CreateChangeVersionSequence.sql',
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName,
    generatedOutput,
  };
}
