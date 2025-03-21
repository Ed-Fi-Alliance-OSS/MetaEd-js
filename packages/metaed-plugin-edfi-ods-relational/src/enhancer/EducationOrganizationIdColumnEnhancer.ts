// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  EnhancerResult,
  EntityProperty,
  MetaEdEnvironment,
  Namespace,
  targetTechnologyVersionFor,
  versionSatisfies,
} from '@edfi/metaed-core';
import { tableEntities } from './EnhancerHelper';
import { Column } from '../model/database/Column';
import { Table } from '../model/database/Table';

const enhancerName = 'EducationOrganizationIdColumnEnhancer';

/**
 * From METAED-1485, flag indexes for creation that would improve the performance of the filters applied to queries
 * for relationship-based authorization on non-role named educationOrganizationIds (including renames).
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfies(targetTechnologyVersionFor('edfiOdsRelational', metaEd), '>=7.1.0')) {
    metaEd.namespace.forEach((namespace: Namespace) => {
      const tables: Map<string, Table> = tableEntities(metaEd, namespace);
      tables.forEach((table: Table) => {
        // Only main tables/root tables
        if (table.isAggregateRootTable) {
          table.columns.forEach((column: Column) => {
            // Not role named columns
            if (column.sourceEntityProperties.some((p: EntityProperty) => p.roleName !== '')) return;

            // Either EducationOrganizationId or a rename of EducationOrganizationId
            if (
              column.sourceEntityProperties.some(
                (p: EntityProperty) =>
                  p.metaEdName === 'EducationOrganizationId' || p.baseKeyName === 'EducationOrganizationId',
              )
            ) {
              table.educationOrganizationIdColumns.push(column);
              table.hasEducationOrganizationIdColumns = true;
            }
          });
        }
      });
    });
  }
  return {
    enhancerName,
    success: true,
  };
}
