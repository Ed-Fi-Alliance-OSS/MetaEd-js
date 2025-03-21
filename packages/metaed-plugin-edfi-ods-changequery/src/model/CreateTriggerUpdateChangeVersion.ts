// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ChangeDataColumn } from './ChangeDataColumn';
import { HasTableName } from './HasName';

export interface CreateTriggerUpdateChangeVersion extends HasTableName {
  schema: string;
  triggerName: string;
  primaryKeyColumnNames: string[];
  changeDataColumns: ChangeDataColumn[];
  includeKeyChanges: boolean;
  isStyle6dot0: boolean;
  omitDiscriminator: boolean;
  includeNamespace: boolean;
  isUsiTable: boolean;
}

export function newCreateTriggerUpdateChangeVersion(): CreateTriggerUpdateChangeVersion {
  return {
    schema: '',
    tableName: '',
    triggerName: '',
    primaryKeyColumnNames: [],
    changeDataColumns: [],
    includeKeyChanges: false,
    isStyle6dot0: false,
    omitDiscriminator: false,
    includeNamespace: false,
    isUsiTable: false,
  };
}
