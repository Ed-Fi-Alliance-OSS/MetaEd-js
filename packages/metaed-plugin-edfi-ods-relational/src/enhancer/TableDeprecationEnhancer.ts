// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, NoTopLevelEntity } from '@edfi/metaed-core';
import { tableEntities } from './EnhancerHelper';
import { Table } from '../model/database/Table';

const enhancerName = 'TableDeprecationEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      if (table.parentEntity === NoTopLevelEntity) return;
      if (!table.parentEntity.isDeprecated) return;
      table.isDeprecated = true;
      table.deprecationReasons.push(table.parentEntity.deprecationReason);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
