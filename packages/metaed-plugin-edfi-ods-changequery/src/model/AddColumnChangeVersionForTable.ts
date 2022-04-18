export interface AddColumnChangeVersionForTable {
  schema: string;
  tableName: string;
  tableNameHash: string | null;
  isStyle6dot0: boolean;
}

export function newAddColumnChangeVersionForTable(): AddColumnChangeVersionForTable {
  return {
    schema: '',
    tableName: '',
    tableNameHash: null,
    isStyle6dot0: false,
  };
}
