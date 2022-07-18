export interface AddColumnChangeVersionForTable {
  schema: string;
  isCoreSchema: boolean;
  tableName: string;
  tableNameHash: string | null;
  isStyle6dot0: boolean;
}

export function newAddColumnChangeVersionForTable(): AddColumnChangeVersionForTable {
  return {
    schema: '',
    isCoreSchema: false,
    tableName: '',
    tableNameHash: null,
    isStyle6dot0: false,
  };
}
