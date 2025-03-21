// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  AddColumnChangeVersionForTable,
  newAddColumnChangeVersionForTable,
  performAddColumnChangeVersionForTableEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'AddColumnChangeVersionForTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const isStyle6dot0 = versionSatisfies(targetTechnologyVersion, '>=6.0.0');

  const createAddColumnModel = (table: Table): AddColumnChangeVersionForTable => ({
    ...newAddColumnChangeVersionForTable(),
    schema: table.schema,
    tableName: table.data.edfiOdsPostgresql.tableName,
    tableNameLowercased: (table.data.edfiOdsPostgresql.tableName as string).toLowerCase(),
    tableNameHash: table.data.edfiOdsPostgresql.truncatedTableNameHash,
    isStyle6dot0,
  });

  performAddColumnChangeVersionForTableEnhancement(metaEd, PLUGIN_NAME, createAddColumnModel);

  return {
    enhancerName,
    success: true,
  };
}
