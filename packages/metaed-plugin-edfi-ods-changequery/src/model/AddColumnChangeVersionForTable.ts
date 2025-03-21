// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
