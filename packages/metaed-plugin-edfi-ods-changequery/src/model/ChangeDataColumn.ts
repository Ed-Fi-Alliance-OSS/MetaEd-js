/** An object supporting the 5.4+ implementation of change queries */
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
