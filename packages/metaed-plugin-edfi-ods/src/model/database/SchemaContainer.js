// @flow
import type { ForeignKey } from './ForeignKey';
import type { Table } from './Table';
import type { Trigger } from './Trigger';
import type { EnumerationRow } from './EnumerationRow';
import type { SchoolYearEnumerationRow } from './SchoolYearEnumerationRow';

export type SchemaContainer = {
  tables: Array<Table>,
  foreignKeys: Array<ForeignKey>,
  triggers: Array<Trigger>,
  enumerationRows: Array<EnumerationRow>,
  schoolYearEnumerationRows: Array<SchoolYearEnumerationRow>,
}

export function newSchemaContainer(): SchemaContainer {
  return {
    tables: [],
    foreignKeys: [],
    triggers: [],
    enumerationRows: [],
    schoolYearEnumerationRows: [],
  };
}
