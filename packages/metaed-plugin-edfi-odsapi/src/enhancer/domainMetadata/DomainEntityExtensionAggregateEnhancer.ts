// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult, TopLevelEntity, Namespace } from '@edfi/metaed-core';
import { Table, TopLevelEntityEdfiOds } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhanceSingleEntity } from './AggregateEnhancerBase';

const enhancerName = 'DomainEntityExtensionAggregateEnhancer';

function orderedAndUniqueTablesFor(entity: TopLevelEntity, namespace: Namespace): Table[] {
  const tablesForNamespace = (entity.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTables.filter(
    (t: Table) =>
      t.schema === namespace.namespaceName.toLowerCase() &&
      t.tableId !== entity.metaEdName + entity.namespace.extensionEntitySuffix,
  );
  // TODO: why is unique necessary?
  const uniquedTables = R.uniqBy(R.prop('tableId'), tablesForNamespace);
  return R.sortBy(R.path(['data', 'edfiOdsSqlServer', 'tableName']), uniquedTables);
}

const isAggregateExtension = () => true;

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntityExtension').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(
      metaEd,
      modelBase as TopLevelEntity,
      metaEd.namespace,
      undefined,
      isAggregateExtension,
      orderedAndUniqueTablesFor,
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
