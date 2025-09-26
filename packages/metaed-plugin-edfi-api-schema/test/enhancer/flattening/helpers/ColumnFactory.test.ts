// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPropertyFullName } from '@edfi/metaed-core';
import {
  createColumnMetadata,
  createDescriptorColumn,
  createIdentityColumn,
  createParentReferenceColumn,
  createReferenceColumn,
  createScalarColumn,
  toColumnJsonPath,
  toColumnName,
  toColumnMaxLength,
} from '../../../../src/enhancer/flattening/helpers/ColumnFactory';
import type { TableBaseName } from '../../../../src/enhancer/flattening/helpers/TableBuilder';

describe('ColumnFactory helpers', () => {
  it('creates identity columns with defaults', () => {
    const column = createIdentityColumn(toColumnJsonPath('$.schoolId'), toColumnName('SchoolId'));
    expect(column.columnName).toBe('SchoolId');
    expect(column.jsonPath).toBe('$.schoolId');
    expect(column.isNaturalKey).toBe(true);
    expect(column.isRequired).toBe(true);
    expect(column.columnType).toBe('unknown');
  });

  it('creates scalar columns', () => {
    const column = createScalarColumn(toColumnJsonPath('.nameOfInstitution'), toColumnName('NameOfInstitution'), true);
    expect(column.jsonPath).toBe('.nameOfInstitution');
    expect(column.isRequired).toBe(true);
  });

  it('creates parent reference columns', () => {
    const column = createParentReferenceColumn('School' as TableBaseName);
    expect(column.columnName).toBe('School_Id');
    expect(column.isParentReference).toBe(true);
    expect(column.columnType).toBe('bigint');
    expect(column.isRequired).toBe(true);
  });

  it('creates reference columns', () => {
    const column = createReferenceColumn(
      toColumnName('Student_Id'),
      'EdFi.StudentSchoolAssociation.StudentReference' as MetaEdPropertyFullName,
      true,
    );

    expect(column.columnName).toBe('Student_Id');
    expect(column.columnType).toBe('bigint');
    expect(column.fromReferencePath).toBe('EdFi.StudentSchoolAssociation.StudentReference');
    expect(column.isRequired).toBe(true);
  });

  it('creates descriptor columns', () => {
    const column = createDescriptorColumn(
      toColumnJsonPath('.addresses[*].addressTypeDescriptor'),
      toColumnName('AddressTypeDescriptor'),
      true,
      toColumnMaxLength('306'),
    );

    expect(column.columnType).toBe('descriptor');
    expect(column.maxLength).toBe('306');
  });

  it('creates generic columns', () => {
    const column = createColumnMetadata(toColumnName('Custom'), 'string', toColumnJsonPath('.custom'));
    expect(column.columnType).toBe('string');
    expect(column.jsonPath).toBe('.custom');
  });
});
