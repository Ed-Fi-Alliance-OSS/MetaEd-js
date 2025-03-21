// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  PluginEnvironment,
  versionSatisfies,
  getEntitiesOfTypeForNamespaces,
  Namespace,
} from '@edfi/metaed-core';
import { ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { IndirectUpdateCascadeTrigger } from '../model/IndirectUpdateCascadeTrigger';
import { indirectUpdateCascadeTriggerEntities, pluginEnvironment, pairedForeignKeyColumnNamesFrom } from './EnhancerHelper';

const enhancerName = 'IndirectUpdateCascadeTriggerEnhancer';

export function enhance(
  metaEd: MetaEdEnvironment,
  databasePluginName: string,
  changeQueryPluginName: string,
): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (versionSatisfies(targetTechnologyVersion, '>=7.3.0')) {
    metaEd.namespace.forEach((namespace: Namespace) => {
      const result: IndirectUpdateCascadeTrigger[] = indirectUpdateCascadeTriggerEntities(
        pluginEnvironment(metaEd, changeQueryPluginName),
        namespace,
      );

      getEntitiesOfTypeForNamespaces(
        [namespace],
        'association',
        'associationSubclass',
        'domainEntity',
        'domainEntitySubclass',
      ).forEach((entity) => {
        const mainTable: Table = entity.data.edfiOdsRelational.odsEntityTable;

        const subtables: Table[] = entity.data.edfiOdsRelational.odsTables.filter((table: Table) => table !== mainTable);

        subtables.forEach((subtable) => {
          const fksWithUpdateCascade: ForeignKey[] = subtable.foreignKeys.filter((fk) => fk.withUpdateCascade);
          if (fksWithUpdateCascade.length === 0) return;

          const indirectUpdateCascadeFks: ForeignKey[] = fksWithUpdateCascade.filter((fk) => fk.foreignTable !== mainTable);
          if (indirectUpdateCascadeFks.length === 0) return;

          const fkToMainTable: ForeignKey | undefined = subtable.foreignKeys.find((fk) => fk.foreignTable === mainTable);
          if (fkToMainTable == null) return;

          const checkForUpdateColumnNames: string[] = indirectUpdateCascadeFks.flatMap(
            (fk) => fk.data[databasePluginName].parentTableColumnNames,
          );

          result.push({
            mainTableSchema: fkToMainTable.foreignTable.schema,
            mainTableName: fkToMainTable.foreignTable.data[databasePluginName].tableName,
            subTableSchema: fkToMainTable.parentTable.schema,
            subTableName: fkToMainTable.parentTable.data[databasePluginName].tableName,
            checkForUpdateColumnNames,
            fkToMainTableColumnNames: pairedForeignKeyColumnNamesFrom(fkToMainTable, databasePluginName),
          });
        });
      });
    });
  }

  return {
    enhancerName,
    success: true,
  };
}
