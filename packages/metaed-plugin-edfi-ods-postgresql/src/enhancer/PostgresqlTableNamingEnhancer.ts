// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import hash from 'hash.js';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  tableEntities,
  Table,
  TableNameGroup,
  flattenNameComponentsFromGroup,
  constructCollapsedNameFrom,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { TableEdfiOdsPostgresql } from '../model/Table';

const enhancerName = 'PostgresqlTableNamingEnhancer';
const maxPostgresqlIdentifierNameLength = 63;

type TableNaming = {
  tableName: string;
  primaryKeyName: string;
  truncatedTableNameHash: string;
};

function postgresqlPrimaryKeyName(collapsedName: string, truncatedTableNameHash: string): string {
  const untruncatedName = `${collapsedName}_PK`;
  if (untruncatedName.length <= maxPostgresqlIdentifierNameLength) return untruncatedName;

  const maxLengthBeforeHash = 50;
  return `${untruncatedName.substring(0, maxLengthBeforeHash)}_${truncatedTableNameHash}_PK`;
}

function createHash(text: string): string {
  return hash.sha256().update(text).digest('hex');
}

function tableNameHash(nameGroup: TableNameGroup): string {
  const untruncatedName = flattenNameComponentsFromGroup(nameGroup)
    .map((nameComponent) => nameComponent.name)
    .join('');
  return createHash(untruncatedName);
}

/**
 * Generates a table name, primary key name, and hash that conform to
 * PostgreSQL's maximum identifier length of 63 characters. If the table/PK name
 * exceeds this limit, it truncates the name and appends a 6-character hash to
 * ensure uniqueness.
 */
export function buildTableNameFrom(nameGroup: TableNameGroup): TableNaming {
  const truncatedTableNameHash = tableNameHash(nameGroup).substring(0, 6);

  const collapsedName = constructCollapsedNameFrom(nameGroup);
  const primaryKeyName = postgresqlPrimaryKeyName(collapsedName, truncatedTableNameHash);

  if (collapsedName.length <= maxPostgresqlIdentifierNameLength) {
    return { tableName: collapsedName, primaryKeyName, truncatedTableNameHash };
  }

  const maxLengthBeforeHash = 56;
  const tableNameBeforeHash = collapsedName.substring(0, maxLengthBeforeHash);

  return {
    tableName: `${tableNameBeforeHash}_${truncatedTableNameHash}`,
    primaryKeyName,
    truncatedTableNameHash,
  };
}

/**
 * Generates a trigger function name that conforms to PostgreSQL's
 * maximum identifier length of 63 characters. The name is constructed by combining
 * the table name with the given suffix. If the resulting name
 * exceeds the length limit, it truncates the table name portion
 * and includes a 6-character hash to maintain uniqueness.
 */
export function buildTriggerFunctionNameFrom(table: Table, triggerSuffix: string): string {
  const separator = '_';

  const tableName = flattenNameComponentsFromGroup(table.nameGroup)
    .map((nameComponent) => nameComponent.name)
    .join('');

  const proposedTriggerName = `${tableName}${separator}${triggerSuffix}`;

  if (proposedTriggerName.length <= maxPostgresqlIdentifierNameLength) return proposedTriggerName;

  const triggerHash: string = createHash(tableName).substring(0, 6);

  const allowedLengthBeforeHash =
    maxPostgresqlIdentifierNameLength - separator.length - triggerHash.length - separator.length - triggerSuffix.length;

  return `${tableName.substring(0, allowedLengthBeforeHash)}${separator}${triggerHash}${separator}${triggerSuffix}`;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      if (table.data.edfiOdsPostgresql == null) table.data.edfiOdsPostgresql = {};
      Object.assign(table.data.edfiOdsPostgresql as TableEdfiOdsPostgresql, buildTableNameFrom(table.nameGroup));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
