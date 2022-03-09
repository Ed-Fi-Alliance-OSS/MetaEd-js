import { GeneratedOutput, MetaEdEnvironment, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { shouldApplyLicenseHeader } from '@edfi/metaed-plugin-edfi-ods-relational';
import { changeQueryIndicated } from '../enhancer/ChangeQueryIndicator';
import {
  addColumnChangeVersionForTableEntities,
  createTriggerUpdateChangeVersionEntities,
  deleteTrackingTableEntities,
  deleteTrackingTriggerEntities,
  pluginEnvironment,
} from '../enhancer/EnhancerHelper';
import { AddColumnChangeVersionForTable } from '../model/AddColumnChangeVersionForTable';
import { DeleteTrackingTable } from '../model/DeleteTrackingTable';
import { CreateTriggerUpdateChangeVersion } from '../model/CreateTriggerUpdateChangeVersion';
import { DeleteTrackingTrigger } from '../model/DeleteTrackingTrigger';
import { HasTriggerName, HasTableName } from '../model/HasName';

function prefixWithLicenseHeaderForVersion5PlusInAllianceMode(
  metaEd: MetaEdEnvironment,
  literalOutputContent: string,
): string {
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  if (useLicenseHeader) {
    return `-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

${literalOutputContent}`;
  }

  return literalOutputContent;
}

export interface ChangeQueryTemplates {
  addColumnChangeVersion: any;
  deleteTrackingSchema: any;
  deleteTrackingTable: any;
  deleteTrackingTrigger: any;
  createTriggerUpdateChangeVersion: any;
  addIndexChangeVersion: any;
}

function changeQueryPath(databaseFolderName: string) {
  return `/Database/${databaseFolderName}/ODS/Structure/Changes/`;
}

export function generateAddColumnChangeVersionForTable(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  template: () => ChangeQueryTemplates,
  databaseFolderName: string,
): GeneratedOutput[] {
  const results: GeneratedOutput[] = [];
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');

  if (changeQueryIndicated(metaEd)) {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);

    metaEd.namespace.forEach((namespace) => {
      const tables: AddColumnChangeVersionForTable[] = addColumnChangeVersionForTableEntities(plugin, namespace);
      if (tables.length > 0) {
        tables.sort(
          // by schema then by table name
          (a: AddColumnChangeVersionForTable, b: AddColumnChangeVersionForTable) => {
            if (a.schema === b.schema) {
              if (a.tableName < b.tableName) return -1;
              return a.tableName > b.tableName ? 1 : 0;
            }
            return a.schema < b.schema ? -1 : 1;
          },
        );

        const generatedResult: string = template().addColumnChangeVersion({ tables, useLicenseHeader });

        results.push({
          name: 'ODS Change Event: AddColumnChangeVersionForTable',
          namespace: namespace.namespaceName,
          folderName: changeQueryPath(databaseFolderName),
          fileName: '0030-AddColumnChangeVersionForTables.sql',
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }

  return results;
}

export function generateCreateTrackedDeleteSchemas5dot3(
  metaEd: MetaEdEnvironment,
  template: () => ChangeQueryTemplates,
  databaseFolderName: string,
) {
  const results: GeneratedOutput[] = [];

  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (versionSatisfies(targetTechnologyVersion, '<3.4.0 || >5.3.0')) {
    return results;
  }
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');

  if (changeQueryIndicated(metaEd)) {
    metaEd.namespace.forEach((namespace) => {
      const generatedResult: string = template().deleteTrackingSchema({
        schema: `tracked_deletes_${namespace.namespaceName.toLowerCase()}`,
        useLicenseHeader,
      });

      results.push({
        name: 'ODS Change Event: CreateTrackedDeleteSchemas',
        namespace: namespace.namespaceName,
        folderName: changeQueryPath(databaseFolderName),
        fileName: '0045-CreateTrackedDeleteSchema.sql',
        resultString: generatedResult,
        resultStream: null,
      });
    });
  }
  return results;
}

function originalTableNameCompare(a: HasTableName, b: HasTableName): number {
  if (a.tableName < b.tableName) return -1;
  return a.tableName > b.tableName ? 1 : 0;
}

function compareTableNameLikeCsharp(a: HasTableName, b: HasTableName): number {
  if (a.tableName.toLowerCase() < b.tableName.toLowerCase()) return -1;
  return a.tableName.toLowerCase() > b.tableName.toLowerCase() ? 1 : 0;
}

export function generateCreateTrackedDeleteTables(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  template: () => ChangeQueryTemplates,
  databaseFolderName: string,
) {
  const results: GeneratedOutput[] = [];
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');
  const isStyle5dot4 = versionSatisfies(targetTechnologyVersion, '>=5.4.0');

  if (changeQueryIndicated(metaEd)) {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);

    metaEd.namespace.forEach((namespace) => {
      const tables: DeleteTrackingTable[] = deleteTrackingTableEntities(plugin, namespace).filter(
        (table) => !table.isIgnored,
      );
      if (tables.length > 0) {
        tables.sort(
          // by schema then by table name
          (a: DeleteTrackingTable, b: DeleteTrackingTable) => {
            if (a.schema === b.schema) {
              return isStyle5dot4 ? compareTableNameLikeCsharp(a, b) : originalTableNameCompare(a, b);
            }
            return a.schema < b.schema ? -1 : 1;
          },
        );

        const generatedResult: string = template().deleteTrackingTable({
          tables,
          useLicenseHeader,
          isStyle5dot4,
          schema: tables[0].schema,
        });

        results.push({
          name: 'ODS Change Event: CreateTrackedDeleteTables',
          namespace: namespace.namespaceName,
          folderName: changeQueryPath(databaseFolderName),
          fileName: isStyle5dot4 ? '0200-CreateTrackedChangeTables.sql' : '0050-CreateTrackedDeleteTables.sql',
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }
  return results;
}

export function generateAddIndexChangeVersionForTable(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  template: () => ChangeQueryTemplates,
  databaseFolderName: string,
) {
  const results: GeneratedOutput[] = [];
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');

  if (changeQueryIndicated(metaEd)) {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);

    metaEd.namespace.forEach((namespace) => {
      const tables: AddColumnChangeVersionForTable[] = addColumnChangeVersionForTableEntities(plugin, namespace);

      if (tables.length > 0) {
        tables.sort(
          // by schema then by table name
          (a: AddColumnChangeVersionForTable, b: AddColumnChangeVersionForTable) => {
            if (a.schema === b.schema) {
              if (a.tableName < b.tableName) return -1;
              return a.tableName > b.tableName ? 1 : 0;
            }
            return a.schema < b.schema ? -1 : 1;
          },
        );

        const generatedResult: string = template().addIndexChangeVersion({ tables, useLicenseHeader });

        results.push({
          name: 'ODS Change Event: AddIndexChangeVersionForTable',
          namespace: namespace.namespaceName,
          folderName: changeQueryPath(databaseFolderName),
          fileName: '0070-AddIndexChangeVersionForTables.sql',
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }
  return results;
}

export function generateCreateChangesSchema(
  metaEd: MetaEdEnvironment,
  literalOutputContent: string,
  databaseFolderName: string,
) {
  const results: GeneratedOutput[] = [];
  const resultString = prefixWithLicenseHeaderForVersion5PlusInAllianceMode(metaEd, literalOutputContent);

  if (changeQueryIndicated(metaEd)) {
    metaEd.namespace.forEach((namespace) => {
      results.push({
        name: 'ODS Change Event: CreateChangesSchema',
        namespace: namespace.namespaceName,
        folderName: changeQueryPath(databaseFolderName),
        fileName: '0010-CreateChangesSchema.sql',
        resultString,
        resultStream: null,
      });
    });
  }
  return results;
}

export function generateCreateChangeVersionSequence(
  metaEd: MetaEdEnvironment,
  literalOutputContent: string,
  databaseFolderName: string,
) {
  const results: GeneratedOutput[] = [];

  const resultString = prefixWithLicenseHeaderForVersion5PlusInAllianceMode(metaEd, literalOutputContent);

  if (changeQueryIndicated(metaEd)) {
    metaEd.namespace.forEach((namespace) => {
      results.push({
        name: 'ODS Change Event: CreateChangeVersionSequence',
        namespace: namespace.namespaceName,
        folderName: changeQueryPath(databaseFolderName),
        fileName: '0020-CreateChangeVersionSequence.sql',
        resultString,
        resultStream: null,
      });
    });
  }
  return results;
}

function originalTriggerNameCompare(a: HasTriggerName, b: HasTriggerName): number {
  if (a.triggerName < b.triggerName) return -1;
  return a.triggerName > b.triggerName ? 1 : 0;
}

function compareTriggerNameLikeCsharp(a: HasTriggerName, b: HasTriggerName): number {
  if (a.triggerName.toLowerCase() < b.triggerName.toLowerCase()) return -1;
  return a.triggerName.toLowerCase() > b.triggerName.toLowerCase() ? 1 : 0;
}

export function generateCreateDeletedForTrackingTrigger(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  template: () => ChangeQueryTemplates,
  databaseFolderName: string,
) {
  const results: GeneratedOutput[] = [];
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');
  const isStyle5dot4 = versionSatisfies(targetTechnologyVersion, '>=5.4.0');

  if (changeQueryIndicated(metaEd)) {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);

    metaEd.namespace.forEach((namespace) => {
      const triggers: DeleteTrackingTrigger[] = deleteTrackingTriggerEntities(plugin, namespace).filter(
        (trigger) => !trigger.isIgnored,
      );
      if (triggers.length > 0) {
        triggers.sort(
          // by schema then by trigger name
          (a: DeleteTrackingTrigger, b: DeleteTrackingTrigger) => {
            if (a.triggerSchema === b.triggerSchema) {
              return isStyle5dot4 ? compareTriggerNameLikeCsharp(a, b) : originalTriggerNameCompare(a, b);
            }
            return a.triggerSchema < b.triggerSchema ? -1 : 1;
          },
        );

        const generatedResult: string = template().deleteTrackingTrigger({ triggers, useLicenseHeader });

        results.push({
          name: 'ODS Change Event: CreateDeletedForTrackingTriggers',
          namespace: namespace.namespaceName,
          folderName: changeQueryPath(databaseFolderName),
          fileName: isStyle5dot4 ? '0220-CreateTriggersForDeleteTracking.sql' : '0060-CreateDeletedForTrackingTriggers.sql',
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }
  return results;
}

export function generateCreateTriggerUpdateChangeVersion(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  template: () => ChangeQueryTemplates,
  databaseFolderName: any,
) {
  const results: GeneratedOutput[] = [];
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');
  const isStyle5dot4 = versionSatisfies(targetTechnologyVersion, '>=5.4.0');

  if (changeQueryIndicated(metaEd)) {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);

    metaEd.namespace.forEach((namespace) => {
      const triggers: CreateTriggerUpdateChangeVersion[] = createTriggerUpdateChangeVersionEntities(plugin, namespace);
      if (triggers.length > 0) {
        triggers.sort(
          // by schema then by table name
          (a: CreateTriggerUpdateChangeVersion, b: CreateTriggerUpdateChangeVersion) => {
            if (a.schema === b.schema) {
              return isStyle5dot4 ? compareTableNameLikeCsharp(a, b) : originalTableNameCompare(a, b);
            }
            return a.schema < b.schema ? -1 : 1;
          },
        );

        const generatedResult: string = template().createTriggerUpdateChangeVersion({
          triggers,
          useLicenseHeader,
          includeDropIfExists: isStyle5dot4,
        });

        results.push({
          name: 'ODS Change Event: CreateTriggerUpdateChangeVersion',
          namespace: namespace.namespaceName,
          folderName: changeQueryPath(databaseFolderName),
          fileName: isStyle5dot4
            ? '0210-CreateTriggersForChangeVersionAndKeyChanges.sql'
            : '0040-CreateTriggerUpdateChangeVersionGenerator.sql',
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }
  return results;
}
