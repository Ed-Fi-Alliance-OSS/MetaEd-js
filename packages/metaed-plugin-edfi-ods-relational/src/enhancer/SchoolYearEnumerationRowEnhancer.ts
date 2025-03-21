// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { EnhancerResult, EnumerationItem, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { escapeSqlSingleQuote } from '../shared/Utility';
import { newSchoolYearEnumerationRow } from '../model/database/SchoolYearEnumerationRow';
import { rowEntities } from './EnhancerHelper';
import { SchoolYearEnumerationRow } from '../model/database/SchoolYearEnumerationRow';

// Build special objects to support generating data inserts for School Year
const enhancerName = 'SchoolYearEnumerationRowEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((entity: ModelBase) => {
    R.prop('enumerationItems')(entity).forEach((item: EnumerationItem) => {
      const name: string = R.takeLast(4)(item.shortDescription);

      const row: SchoolYearEnumerationRow = {
        ...newSchoolYearEnumerationRow(),
        name,
        namespace: entity.namespace.namespaceName,
        schemaName: entity.namespace.namespaceName.toLowerCase(),
        tableName: 'SchoolYearType',
        documentation: item.documentation,
        schoolYear: parseInt(name, 10),
        schoolYearDescription: escapeSqlSingleQuote(item.shortDescription),
      };

      rowEntities(metaEd, entity.namespace).set(row.name + row.schoolYearDescription, row);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
