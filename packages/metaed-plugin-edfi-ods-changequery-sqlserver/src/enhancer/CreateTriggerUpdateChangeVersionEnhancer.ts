// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, versionSatisfies, SemVer } from '@edfi/metaed-core';
import { Column, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  CreateTriggerUpdateChangeVersion,
  hasRequiredNonIdentityNamespaceColumn,
  isUsiTable,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { changeDataColumnsFor } from './EnhancerHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function createTriggerModel(table: Table, targetTechnologyVersion: SemVer): CreateTriggerUpdateChangeVersion {
  const isStyle6dot0 = versionSatisfies(targetTechnologyVersion, '>=6.0.0');
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsSqlServer.tableName,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_UpdateChangeVersion`,
    primaryKeyColumnNames: table.primaryKeys.map((pkColumn: Column) => pkColumn.data.edfiOdsSqlServer.columnName),
    changeDataColumns: changeDataColumnsFor(table),
    includeKeyChanges: isStyle6dot0 && table.parentEntity?.data?.edfiOdsRelational?.odsCascadePrimaryKeyUpdates,
    isStyle6dot0,
    omitDiscriminator: table.schema === 'edfi' && table.tableId === 'SchoolYearType',
    includeNamespace: hasRequiredNonIdentityNamespaceColumn(table),
    isUsiTable: isStyle6dot0 && isUsiTable(table),
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performCreateTriggerUpdateChangeVersionEnhancement(metaEd, PLUGIN_NAME, createTriggerModel);
  return {
    enhancerName,
    success: true,
  };
}
