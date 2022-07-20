export interface AddColumnChangeVersionForTable {
  schema: string;
  tableName: string;
  tableNameLowercased: string;
  tableNameHash: string | null;
  isStyle6dot0: boolean;
}

export function newAddColumnChangeVersionForTable(): AddColumnChangeVersionForTable {
  return {
    schema: '',
    tableName: '',
    tableNameLowercased: '',
    tableNameHash: null,
    isStyle6dot0: false,
  };
}
