/** An object supporting the 6.0.0+ implementation of change queries */
export interface ChangeDataColumn {
  columnName: string;
  columnDataType: string;
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
    columnDataType: '',
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
