// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { GeneratorResult, MetaEdEnvironment, versionSatisfies, PluginEnvironment } from '@edfi/metaed-core';
import { generateCreateChangeVersionSequence } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { getTemplateFileContents, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';

const generatorName = `${PLUGIN_NAME}.CreateChangeVersionSequenceGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const isVersion73Plus = versionSatisfies(targetTechnologyVersion, '>=7.3.0');

  const templateFileName = isVersion73Plus
    ? '0020-CreateChangeVersionSequence.sql'
    : '0020-CreateChangeVersionSequenceV72x.sql';

  const results = generateCreateChangeVersionSequence(
    metaEd,
    getTemplateFileContents(templateFileName),
    databaseSpecificFolderName,
  );
  return {
    generatorName,
    generatedOutput: results,
  };
}
