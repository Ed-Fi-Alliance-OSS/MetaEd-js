// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getEntitiesOfTypeForNamespaces, targetTechnologyVersionFor } from '@edfi/metaed-core';
import { TopLevelEntity, EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { addTables, buildMainTable, buildTablesFromProperties } from './TableCreatingEntityEnhancerBase';
import { Table } from '../../model/database/Table';

const enhancerName = 'AssociationSubclassTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'associationSubclass')
    .map((x: ModelBase) => x as TopLevelEntity)
    .forEach((entity: TopLevelEntity) => {
      const tables: Table[] = [];
      const mainTable: Table = buildMainTable(metaEd, entity, false);
      mainTable.existenceReason.isSubclassTable = true;
      tables.push(mainTable);
      buildTablesFromProperties(entity, mainTable, tables, targetTechnologyVersionFor('edfiOdsRelational', metaEd));
      entity.data.edfiOdsRelational.odsTables = tables;
      addTables(metaEd, tables);
    });

  return {
    enhancerName,
    success: true,
  };
}
