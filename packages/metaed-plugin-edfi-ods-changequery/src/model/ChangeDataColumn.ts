// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
