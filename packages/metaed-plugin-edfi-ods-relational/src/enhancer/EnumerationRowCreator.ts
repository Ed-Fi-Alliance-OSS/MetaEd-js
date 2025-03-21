// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnumerationItem } from '@edfi/metaed-core';
import { normalizeEnumerationSuffix } from '@edfi/metaed-core';
import { escapeSqlSingleQuote } from '../shared/Utility';
import { newEnumerationRow } from '../model/database/EnumerationRow';
import { EnumerationRow } from '../model/database/EnumerationRow';

export const enumerationRowCreator = {
  createRows: (namespaceName: string, tableName: string, enumerationItems: EnumerationItem[]): EnumerationRow[] => {
    if (enumerationItems.length === 0) return [];

    return enumerationItems.map((item: EnumerationItem) => {
      const name: string = normalizeEnumerationSuffix(tableName);
      const description: string = escapeSqlSingleQuote(item.shortDescription);

      return {
        ...newEnumerationRow(),
        name,
        namespace: namespaceName,
        schemaName: namespaceName.toLowerCase(),
        tableName: name,
        documentation: item.documentation,
        codeValue: '',
        description,
        shortDescription: description,
      };
    });
  },
};
