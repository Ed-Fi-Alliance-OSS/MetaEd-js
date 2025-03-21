// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import { Column, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { EntityIdentifier } from '../../model/apiModel/EntityIdentifier';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { tableFor } from './EnhancerHelper';

const enhancerName = 'EntityDefinitionIdentifierEnhancer';
const targetVersions: SemVer = '>=3.3.0';

function shouldIncludeAlternateKeys(table: Table): boolean {
  // true for the hardcoded Descriptor table
  return table.tableId === 'Descriptor' && table.schema === 'edfi';
}

function isUpdatable(table: Table): boolean {
  return table.existenceReason.isEntityMainTable && table.parentEntity.allowPrimaryKeyUpdates;
}

// "identifiers" are the primary key columns of the table
export function identifiersFrom(table: Table): EntityIdentifier[] {
  const result: EntityIdentifier[] = [];

  result.push({
    identifierName: `${table.data.edfiOdsSqlServer.tableName}_PK`,
    identifyingPropertyNames: table.primaryKeys.map((column: Column) => column.data.edfiOdsSqlServer.columnName),
    isPrimary: true,
    isUpdatable: isUpdatable(table),
    constraintNames: {
      sqlServer: `${table.data.edfiOdsSqlServer.tableName}_PK`,
      postgreSql: table.data.edfiOdsPostgresql.primaryKeyName,
    },
  });

  if (shouldIncludeAlternateKeys(table)) {
    result.push({
      identifierName: `${table.data.edfiOdsSqlServer.tableName}_AK`,
      identifyingPropertyNames: table.alternateKeys.map((column: Column) => column.data.edfiOdsSqlServer.columnName),
      isPrimary: false,
      isUpdatable: false,
      constraintNames: {
        sqlServer: `${table.data.edfiOdsSqlServer.tableName}_AK`,
        // only applies to base descriptor entity and cannot be triggered by extensions
        postgreSql: `${table.data.edfiOdsPostgresql.tableName}_AK`,
      },
    });
  }

  if (table.uniqueIndexes.length > 0) {
    result.push({
      identifierName: `${table.data.edfiOdsSqlServer.tableName}_UI_${table.uniqueIndexes[0].data.edfiOdsSqlServer.columnName}`,
      identifyingPropertyNames: table.uniqueIndexes.map((column: Column) => column.data.edfiOdsSqlServer.columnName),
      isPrimary: false,
      isUpdatable: false,
      constraintNames: {
        sqlServer: `${table.data.edfiOdsSqlServer.tableName}_UI_${table.uniqueIndexes[0].data.edfiOdsSqlServer.columnName}`,
        // only applies to person entities and cannot be triggered by extensions
        postgreSql: `${table.data.edfiOdsPostgresql.tableName}_UI_${table.uniqueIndexes[0].data.edfiOdsPostgresql.columnName}`,
      },
    });
  }

  if (table.includeLastModifiedDateAndIdColumn) {
    result.push({
      identifierName: `UX_${table.data.edfiOdsSqlServer.tableName}_Id`,
      identifyingPropertyNames: ['Id'],
      isPrimary: false,
      isUpdatable: isUpdatable(table),
      constraintNames: {
        sqlServer: `UX_${table.data.edfiOdsSqlServer.tableName}_Id`,
        // truncatedTableNameHash is a 6 character hash
        postgreSql: `UX_${table.data.edfiOdsPostgresql.truncatedTableNameHash}_Id`,
      },
    });
  }

  return result;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const { entityDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

    entityDefinitions.forEach((entityDefinition: EntityDefinition) => {
      const table = tableFor(metaEd, namespace, entityDefinition.name);
      if (table == null) return;

      entityDefinition.identifiers.push(...identifiersFrom(table));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
