// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { orderByPath, orderByProp, MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { tableEntities, rowEntities, EnumerationRowBase, ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';

const enhancerName = 'AddSchemaContainerEnhancer';

export const orderRows = R.sortBy(R.compose(R.toLower, R.join(''), R.props(['name', 'description'])));

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const rows: EnumerationRowBase[] = Array.from(rowEntities(metaEd, namespace).values()).filter(
      (row: EnumerationRowBase) => row.namespace === namespace.namespaceName,
    );
    const tables: Table[] = orderByPath(['data', 'edfiOdsSqlServer', 'tableName'])(
      Array.from(tableEntities(metaEd, namespace).values()).filter(
        (table: Table) => table.schema === namespace.namespaceName.toLowerCase(),
      ),
    );
    const foreignKeys: ForeignKey[] = R.chain((table) => table.foreignKeys)(tables);
    const enumerationRows: EnumerationRowBase[] = orderRows(
      rows.filter((row: EnumerationRowBase) => row.type === 'enumerationRow'),
    );
    const schoolYearEnumerationRows: EnumerationRowBase[] = orderByProp('name')(
      rows.filter((row: EnumerationRowBase) => row.type === 'schoolYearEnumerationRow'),
    );

    Object.assign(namespace.data.edfiOdsSqlServer.odsSchema, {
      tables,
      foreignKeys,
      enumerationRows,
      schoolYearEnumerationRows,
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
