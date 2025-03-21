// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities, Table } from '@edfi/metaed-plugin-edfi-ods-relational';

export interface TableEdfiOdsRecordOwnership {
  /** For ODS/API 3.3+ record level ownership support */
  hasOwnershipTokenColumn: boolean;
}

const enhancerName = 'RecordOwnershipTableSetupEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      if (table.data.edfiOdsRecordOwnership == null) {
        (table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership) = { hasOwnershipTokenColumn: false };
      } else {
        (table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership).hasOwnershipTokenColumn = false;
      }
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
