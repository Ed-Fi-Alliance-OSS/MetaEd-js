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
