// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newTableNameGroup,
  newTableNameComponent,
  TableNameGroup,
  newTable,
  Table,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { buildTableNameFrom, buildTriggerFunctionNameFrom } from '../../src/enhancer/PostgresqlTableNamingEnhancer';

function buildTableNameGroupFrom(tableName: string): TableNameGroup {
  return { ...newTableNameGroup(), nameElements: [{ ...newTableNameComponent(), name: tableName }] };
}

function buildTableFrom(tableName: string): Table {
  return { ...newTable(), nameGroup: buildTableNameGroupFrom(tableName) };
}

describe('when constructing a table name', () => {
  it('should not truncate a short table name', () => {
    const { tableName, primaryKeyName } = buildTableNameFrom(buildTableNameGroupFrom('ShortTableName'));
    expect(tableName).toBe('ShortTableName');
    expect(primaryKeyName).toBe('ShortTableName_PK');
  });

  it('should truncate a long table name', () => {
    const { tableName, primaryKeyName } = buildTableNameFrom(
      buildTableNameGroupFrom('AveryLongTableNameThatWillCauseTruncationAndAHashSuffixWillBeAppended'),
    );
    expect(tableName).toBe('AveryLongTableNameThatWillCauseTruncationAndAHashSuffixW_c635b8');
    expect(primaryKeyName).toBe('AveryLongTableNameThatWillCauseTruncationAndAHashS_c635b8_PK');
  });
});

describe('when constructing a trigger name', () => {
  it('should not truncate a short trigger name', () => {
    const triggerName = buildTriggerFunctionNameFrom(buildTableFrom('Assessment'), 'updlastmoddate');
    expect(triggerName).toBe('Assessment_updlastmoddate');
  });

  it('should truncate a long trigger name', () => {
    const triggerName = buildTriggerFunctionNameFrom(
      buildTableFrom('AveryLongTableNameThatWillCauseTruncationAndAHashSuffixWillBeAppended'),
      'updlastmoddate',
    );
    expect(triggerName).toBe('AveryLongTableNameThatWillCauseTruncation_c635b8_updlastmoddate');
  });
});
