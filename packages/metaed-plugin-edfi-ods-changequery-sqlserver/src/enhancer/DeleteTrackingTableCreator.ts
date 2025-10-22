// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Column, newColumn, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  DeleteTrackingTable,
  getPrimaryKeys,
  hasRequiredNonIdentityNamespaceColumn,
  newDeleteTrackingTable,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { changeDataColumnsFor, hardcodedOldColumnFor, TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';

export function createDeleteTrackingTableModel(_metaEd: MetaEdEnvironment, table: Table): DeleteTrackingTable {
  const trackingTableName: string = table.data.edfiOdsSqlServer.tableName;

  const changeVersionColumn: Column = {
    ...newColumn(),
    columnId: 'ChangeVersion',
    data: { edfiOdsSqlServer: { columnName: 'ChangeVersion', dataType: 'bigint' } },
    isNullable: false,
  };

  const deleteTrackingTable: DeleteTrackingTable = {
    ...newDeleteTrackingTable(),
    schema: `tracked_changes_${table.schema}`,
    tableName: trackingTableName,
    primaryKeyName: `PK_${trackingTableName}`,
    columns: [...getPrimaryKeys(table, TARGET_DATABASE_PLUGIN_NAME)],
    primaryKeyColumns: [changeVersionColumn],
    isStyle6dot0: true,
    isDescriptorTable: table.existenceReason.parentEntity?.type === 'descriptor',
    isIgnored: table.existenceReason.isSubclassTable,
    changeDataColumns: changeDataColumnsFor(table),
    hardcodedOldColumn: hardcodedOldColumnFor(table),
    omitDiscriminator: table.schema === 'edfi' && table.tableId === 'SchoolYearType',
    includeNamespace: hasRequiredNonIdentityNamespaceColumn(table),
  };

  deleteTrackingTable.columns.push({
    ...newColumn(),
    columnId: 'Id',
    data: { edfiOdsSqlServer: { columnName: 'Id', dataType: 'uniqueidentifier' } },
    isNullable: false,
  });

  deleteTrackingTable.columns.push(changeVersionColumn);

  return deleteTrackingTable;
}
