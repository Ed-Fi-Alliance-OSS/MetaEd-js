// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { defaultPluginTechVersion, MetaEdEnvironment, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { TableNameGroup, isTableNameGroup, isTableNameComponent, TableNameComponent } from '../model/database/Table';
import { flattenNameComponentsFromGroup } from '../model/database/TableNameGroupHelper';
import { Column, ColumnNameComponent } from '../model/database/Column';

export function prependRoleNameToMetaEdName(metaEdName: string, roleName: string) {
  return roleName + metaEdName;
}

export function escapeSqlSingleQuote(string: string): string {
  return string.replace(/'/g, "''");
}

/**
 * Implement the collapse behavior for table naming from the original ODS
 */
export function appendOverlapCollapsing(accumulated: string, current: string): string {
  const shortestLength = Math.min(accumulated.length, current.length);
  let indexOfOverlap = -1;

  for (let i = shortestLength; i > 0; i -= 1) {
    if (accumulated.endsWith(current.substring(0, i))) {
      indexOfOverlap = i;
      break;
    }
  }

  if (indexOfOverlap < 0) return accumulated + current;
  if (indexOfOverlap <= current.length) return accumulated + current.substring(indexOfOverlap);
  return accumulated;
}

function simpleColumnNameComponentCollapse(columnNameComponent: ColumnNameComponent[]): string {
  return columnNameComponent.map((nameComponent) => nameComponent.name).reduce(appendOverlapCollapsing, '');
}

function constructColumnNameFrom(columnNameComponent: ColumnNameComponent[]): string {
  return simpleColumnNameComponentCollapse(columnNameComponent);
}

/**
 * Gets the canonical column name - the naturally expected column name independent of database
 */
export function canonicalColumnNameFor(column: Column): string {
  return constructColumnNameFrom(column.nameComponents);
}

export function simpleTableNameGroupCollapse(nameGroup: TableNameGroup): string {
  return flattenNameComponentsFromGroup(nameGroup)
    .map((nameComponent) => nameComponent.name)
    .reduce(appendOverlapCollapsing, '');
}

/**
 * Implement standard Ed-Fi ODS table name collapsing
 */
export function constructCollapsedNameFrom(nameGroup: TableNameGroup): string {
  let name = '';
  // name groups from association and domain entity properties don't get table names collapsed
  if (
    nameGroup.sourceProperty != null &&
    (nameGroup.sourceProperty.type === 'association' || nameGroup.sourceProperty.type === 'domainEntity')
  ) {
    nameGroup.nameElements.forEach((element) => {
      if (isTableNameGroup(element)) name += constructCollapsedNameFrom(element as TableNameGroup);
      if (isTableNameComponent(element)) name += (element as TableNameComponent).name;
    });
  } else {
    // in all other scenarios name groups get table names collasped
    name += simpleTableNameGroupCollapse(nameGroup);
  }
  return name;
}

/**
 * Determines if the Apache-2.0 license header should be applied in a template.
 */
export function shouldApplyLicenseHeader(metaEd: MetaEdEnvironment): Boolean {
  const { targetTechnologyVersion } = (metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment) ||
    (metaEd.plugin.get('edfiOdsSqlServer') as PluginEnvironment) ||
    (metaEd.plugin.get('edfiOdsPostgresql') as PluginEnvironment) || {
      targetTechnologyVersion: defaultPluginTechVersion,
    };
  return metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');
}
