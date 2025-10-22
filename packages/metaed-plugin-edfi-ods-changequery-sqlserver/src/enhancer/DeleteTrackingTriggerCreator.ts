// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DeleteTrackingTrigger,
  getPrimaryKeys,
  hasRequiredNonIdentityNamespaceColumn,
  newDeleteTrackingTrigger,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { changeDataColumnsWithHardcodesFor, TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';

export function createDeleteTrackingTriggerModel(_metaEd: MetaEdEnvironment, table: Table): DeleteTrackingTrigger {
  return {
    ...newDeleteTrackingTrigger(),
    triggerSchema: table.schema,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_DeleteTracking`,
    targetTableSchema: table.schema,
    targetTableName: table.data.edfiOdsSqlServer.tableName,
    deleteTrackingTableSchema: `tracked_changes_${table.schema}`,
    deleteTrackingTableName: table.data.edfiOdsSqlServer.tableName,
    primaryKeyColumnNames: getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME).map(
      (column: Column) => column.data.edfiOdsSqlServer.columnName,
    ),
    isDescriptorTable: table.existenceReason.isEntityMainTable && table.existenceReason.parentEntity?.type === 'descriptor',
    isStyle6dot0: true,
    changeDataColumns: changeDataColumnsWithHardcodesFor(table),
    isIgnored: table.existenceReason.isSubclassTable || table.existenceReason.isBaseDescriptor,
    omitDiscriminator: table.schema === 'edfi' && table.tableId === 'SchoolYearType',
    includeNamespace: hasRequiredNonIdentityNamespaceColumn(table),
  };
}
