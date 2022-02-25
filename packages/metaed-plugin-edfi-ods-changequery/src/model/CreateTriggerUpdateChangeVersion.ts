export interface ChangeDataColumn {
  columnName: string;
  isDescriptorId: boolean;
  isDescriptorNamespace: boolean;
  isDescriptorCodeValue: boolean;
  isUsi: boolean;
  isUniqueId: boolean;
  isRegularSelectColumn: boolean;
  usiName: string;
  tableAliasSuffix: string;
}

export function newChangeDataColumn() {
  return {
    columnName: '',
    isDescriptorId: false,
    isDescriptorNamespace: false,
    isDescriptorCodeValue: false,
    isUsi: false,
    isUniqueId: false,
    isRegularSelectColumn: false,
    usiName: '',
    tableAliasSuffix: '',
  };
}

export interface CreateTriggerUpdateChangeVersion {
  schema: string;
  tableName: string;
  triggerName: string;
  primaryKeyColumnNames: string[];
  changeDataColumns: ChangeDataColumn[];
  includeKeyChanges: boolean;
}
