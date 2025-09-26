// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPropertyFullName } from '@edfi/metaed-core';
import type { ColumnMetadata } from '../../../../src/model/flattening/ColumnMetadata';

describe('ColumnFactory helpers', () => {
  it('creates identity columns with defaults', () => {
    const column: ColumnMetadata = {
      columnName: 'SchoolId',
      jsonPath: '$.schoolId',
      columnType: 'unknown',
      isNaturalKey: true,
      isRequired: true,
    };
    expect(column.columnName).toBe('SchoolId');
    expect(column.jsonPath).toBe('$.schoolId');
    expect(column.isNaturalKey).toBe(true);
    expect(column.isRequired).toBe(true);
    expect(column.columnType).toBe('unknown');
  });

  it('creates scalar columns', () => {
    const column: ColumnMetadata = {
      columnName: 'NameOfInstitution',
      jsonPath: '.nameOfInstitution',
      columnType: 'unknown',
      isRequired: true,
    };
    expect(column.jsonPath).toBe('.nameOfInstitution');
    expect(column.isRequired).toBe(true);
  });

  it('creates parent reference columns', () => {
    const column: ColumnMetadata = {
      columnName: 'School_Id',
      columnType: 'bigint',
      isParentReference: true,
      isRequired: true,
    };
    expect(column.columnName).toBe('School_Id');
    expect(column.isParentReference).toBe(true);
    expect(column.columnType).toBe('bigint');
    expect(column.isRequired).toBe(true);
  });

  it('creates reference columns', () => {
    const column: ColumnMetadata = {
      columnName: 'Student_Id',
      columnType: 'bigint',
      fromReferencePath: 'EdFi.StudentSchoolAssociation.StudentReference' as MetaEdPropertyFullName,
      isRequired: true,
    };

    expect(column.columnName).toBe('Student_Id');
    expect(column.columnType).toBe('bigint');
    expect(column.fromReferencePath).toBe('EdFi.StudentSchoolAssociation.StudentReference');
    expect(column.isRequired).toBe(true);
  });

  it('creates descriptor columns', () => {
    const column: ColumnMetadata = {
      columnName: 'AddressTypeDescriptor',
      columnType: 'descriptor',
      jsonPath: '.addresses[*].addressTypeDescriptor',
      isRequired: true,
      maxLength: '306',
    };

    expect(column.columnType).toBe('descriptor');
    expect(column.maxLength).toBe('306');
  });

  it('creates generic columns', () => {
    const column: ColumnMetadata = {
      columnName: 'Custom',
      columnType: 'string',
      jsonPath: '.custom',
    };
    expect(column.columnType).toBe('string');
    expect(column.jsonPath).toBe('.custom');
  });
});
