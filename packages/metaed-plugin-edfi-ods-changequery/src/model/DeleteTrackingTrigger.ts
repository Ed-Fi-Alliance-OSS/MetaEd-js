// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ChangeDataColumn } from './ChangeDataColumn';
import { HasTriggerName } from './HasName';

export interface DeleteTrackingTrigger extends HasTriggerName {
  triggerSchema: string;
  targetTableSchema: string;
  targetTableName: string;
  targetTableNameCasePreserved: string;
  deleteTrackingTableSchema: string;
  deleteTrackingTableName: string;
  primaryKeyColumnNames: string[];
  targetTableIsSubclass: boolean;
  foreignKeyToSuperclass: ForeignKey | null;
  isDescriptorTable: boolean;
  isStyle6dot0: boolean;
  changeDataColumns: ChangeDataColumn[];
  hardcodedOldColumn: ChangeDataColumn | null;
  needsDeclare: boolean;
  isIgnored: boolean;
  omitDiscriminator: boolean;
  includeNamespace: boolean;
}

export function newDeleteTrackingTrigger(): DeleteTrackingTrigger {
  return {
    triggerSchema: '',
    triggerName: '',
    targetTableSchema: '',
    targetTableName: '',
    targetTableNameCasePreserved: '',
    deleteTrackingTableSchema: '',
    deleteTrackingTableName: '',
    primaryKeyColumnNames: [],
    targetTableIsSubclass: false,
    foreignKeyToSuperclass: null,
    isDescriptorTable: false,
    isStyle6dot0: false,
    changeDataColumns: [],
    hardcodedOldColumn: null,
    needsDeclare: false,
    isIgnored: false,
    omitDiscriminator: false,
    includeNamespace: false,
  };
}
