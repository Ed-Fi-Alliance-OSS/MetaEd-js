// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getEntitiesOfTypeForNamespaces, Enumeration } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { addTables } from './TableCreatingEntityEnhancerBase';
import { enumerationTableCreator } from './EnumerationTableCreator';
import { Table } from '../../model/database/Table';

const enhancerName = 'EnumerationTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'enumeration').forEach((entity: ModelBase) => {
    const table: Table = enumerationTableCreator.build(metaEd, entity as Enumeration, entity.documentation);
    entity.data.edfiOdsRelational.odsTables = [table];
    entity.data.edfiOdsRelational.odsEntityTable = table;
    addTables(metaEd, [table]);
  });

  return {
    enhancerName,
    success: true,
  };
}
