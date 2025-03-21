// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { generateCreateDeletedForTrackingTrigger } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';
import { PLUGIN_NAME } from '../PluginHelper';

const generatorName = `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results = generateCreateDeletedForTrackingTrigger(metaEd, PLUGIN_NAME, template, databaseSpecificFolderName);
  return {
    generatorName,
    generatedOutput: results,
  };
}
