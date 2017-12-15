// @flow
import type { EnumerationItem } from 'metaed-core';
import { escapeSqlSingleQuote, normalizeEnumerationSuffix } from '../shared/Utility';
import { newEnumerationRow } from '../model/database/EnumerationRow';
import type { EnumerationRow } from '../model/database/EnumerationRow';

export const enumerationRowCreator = {
  createRows: (namespace: string, tableName: string, enumerationItems: Array<EnumerationItem>): Array<EnumerationRow> => {
    if (enumerationItems.length === 0) return [];

    return enumerationItems.map((item: EnumerationItem) => {
      const name: string = normalizeEnumerationSuffix(tableName);
      const description: string = escapeSqlSingleQuote(item.shortDescription);

      return Object.assign(newEnumerationRow(), {
        name,
        namespace,
        schemaName: namespace,
        tableName: name,
        documentation: item.documentation,
        codeValue: '',
        description,
        shortDescription: description,
      });
    });
  },
};
