// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';

export interface EnumerationRowBase {
  name: string;
  type: string;
  namespace: string;
  schemaName: string;
  tableName: string;
  documentation: string;
}

export function newEnumerationRowBase(): EnumerationRowBase {
  return {
    name: '',
    type: 'enumerationRow',
    namespace: '',
    schemaName: '',
    tableName: '',
    documentation: '',
  };
}

export const NoEnumerationRowBase: EnumerationRowBase = deepFreeze({
  ...newEnumerationRowBase(),
  name: 'NoEnumerationRowBase',
});
