// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { PairedForeignKeyColumnName } from './PairedForeignKeyColumnName';

export type IndirectUpdateCascadeTrigger = {
  triggerName: string;
  mainTableSchema: string;
  mainTableName: string;
  mainTableNameCasePreserved: string;
  subTableSchema: string;
  subTableName: string;
  subTableNameCasePreserved: string;
  checkForUpdateColumnNames: string[];
  fkToMainTableColumnNames: PairedForeignKeyColumnName[];
};

export function newIndirectUpdateCascadeTrigger(): IndirectUpdateCascadeTrigger {
  return {
    triggerName: '',
    mainTableSchema: '',
    mainTableName: '',
    mainTableNameCasePreserved: '',
    subTableSchema: '',
    subTableName: '',
    subTableNameCasePreserved: '',
    checkForUpdateColumnNames: [],
    fkToMainTableColumnNames: [],
  };
}
