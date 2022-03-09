export interface AddColumnChangeVersionForTable {
  schema: string;
  tableName: string;
  tableNameHash: string | null;
  isStyle5dot4: boolean;
}

export function newAddColumnChangeVersionForTable(): AddColumnChangeVersionForTable {
  return {
    schema: '',
    tableName: '',
    tableNameHash: null,
    isStyle5dot4: false,
  };
}
