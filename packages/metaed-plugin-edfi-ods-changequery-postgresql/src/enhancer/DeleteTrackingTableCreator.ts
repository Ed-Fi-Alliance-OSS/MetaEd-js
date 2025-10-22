// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Column, newColumn, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  DeleteTrackingTable,
  newDeleteTrackingTable,
  getPrimaryKeys,
  hasRequiredNonIdentityNamespaceColumn,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { TARGET_DATABASE_PLUGIN_NAME, changeDataColumnsFor, hardcodedOldColumnFor } from './EnhancerHelper';

export function createDeleteTrackingTableModel(_metaEd: MetaEdEnvironment, table: Table): DeleteTrackingTable {
  const trackingTableName: string = table.data.edfiOdsPostgresql.tableName;

  const changeVersionColumn: Column = {
    ...newColumn(),
    columnId: 'ChangeVersion',
    data: { edfiOdsPostgresql: { columnName: 'ChangeVersion', dataType: 'BIGINT' } },
    isNullable: false,
  };

  const deleteTrackingTable: DeleteTrackingTable = {
    ...newDeleteTrackingTable(),
    schema: `tracked_changes_${table.schema}`,
    tableName: trackingTableName.toLowerCase(),
    primaryKeyName: table.data.edfiOdsPostgresql.primaryKeyName.toLowerCase(),
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
    data: { edfiOdsPostgresql: { columnName: 'Id', dataType: 'UUID' } },
    isNullable: false,
  });

  deleteTrackingTable.columns.push(changeVersionColumn);

  return deleteTrackingTable;
}
