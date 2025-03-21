// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, GeneratedOutput, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { pluginEnvironment, indirectUpdateCascadeTriggerEntities } from '../enhancer/EnhancerHelper';
import { changeQueryPath } from './GeneratorHelper';
import { IndirectUpdateCascadeTrigger } from '../model/IndirectUpdateCascadeTrigger';
import { ChangeQueryTemplates } from './ChangeQueryTemplates';

export function generateIndirectUpdateCascadeTrigger(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  template: () => ChangeQueryTemplates,
  databaseFolderName: string,
): GeneratedOutput[] {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, '>=7.3.0')) return [];

  const useLicenseHeader = metaEd.allianceMode;
  const results: GeneratedOutput[] = [];

  metaEd.namespace.forEach((namespace) => {
    const triggers: IndirectUpdateCascadeTrigger[] = indirectUpdateCascadeTriggerEntities(
      pluginEnvironment(metaEd, pluginName),
      namespace,
    );
    if (triggers.length > 0) {
      triggers.sort(
        // by schema then by main table name
        (a: IndirectUpdateCascadeTrigger, b: IndirectUpdateCascadeTrigger) => {
          if (a.mainTableSchema === b.mainTableSchema) {
            if (a.mainTableName < b.mainTableName) return -1;
            return a.mainTableName > b.mainTableName ? 1 : 0;
          }
          return a.mainTableSchema < b.mainTableSchema ? -1 : 1;
        },
      );

      const generatedResult: string = template().indirectUpdateCascadeTrigger({ triggers, useLicenseHeader });

      results.push({
        name: 'ODS Change Event: CreateIndirectUpdateCascadeTriggers',
        namespace: namespace.namespaceName,
        folderName: changeQueryPath(databaseFolderName),
        fileName: '0230-CreateIndirectUpdateCascadeTriggers.sql',
        resultString: generatedResult,
        resultStream: null,
      });
    }
  });

  return results;
}
