// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from './EnhancerHelper';
import { Table } from '../model/database/Table';
import { Column } from '../model/database/Column';

const enhancerName = 'ColumnDeprecationEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      table.columns.forEach((column: Column) => {
        column.sourceEntityProperties.forEach((property) => {
          if (property.isDeprecated) {
            column.isDeprecated = true;
            column.deprecationReasons.push(property.deprecationReason);
          }
        });
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
