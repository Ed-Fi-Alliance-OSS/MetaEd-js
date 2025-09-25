// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { deriveTypeInfo, resolveAbsoluteJsonPath } from '../../../../src/enhancer/flattening/helpers/SqlTypeDeriver';
import { buildApiSchemaData } from './TestApiSchemaData';

describe('SqlTypeDeriver helpers', () => {
  it('derives column types from ApiSchema metadata', () => {
    const jsonSchema = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      title: 'SampleResource',
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string', description: 'Name', maxLength: 255 },
        active: { type: 'boolean', description: 'Is active' },
        amount: { type: 'number', description: 'Amount' },
        effectiveDate: { type: 'string', description: 'Effective date', format: 'date' },
        lastModifiedDateTime: { type: 'string', description: 'Last modified', format: 'date-time' },
      },
    } as any;

    const apiSchemaData = buildApiSchemaData({
      jsonSchemaForInsert: jsonSchema,
      booleanJsonPaths: ['$.active'] as any,
      numericJsonPaths: ['$.sampleId'] as any,
      decimalPropertyValidationInfos: [
        {
          path: '$.amount' as any,
          totalDigits: 10,
          decimalPlaces: 2,
        },
      ],
    });

    const tableJsonPath = '$';

    const nameColumn = { columnName: 'Name', jsonPath: '.name', columnType: 'unknown' as const };
    const nameType = deriveTypeInfo(apiSchemaData, tableJsonPath, nameColumn);
    expect(nameType?.columnType).toBe('string');
    expect(nameType?.maxLength).toBe('255');

    const activeColumn = { columnName: 'Active', jsonPath: '.active', columnType: 'unknown' as const };
    expect(deriveTypeInfo(apiSchemaData, tableJsonPath, activeColumn)?.columnType).toBe('boolean');

    const amountColumn = { columnName: 'Amount', jsonPath: '.amount', columnType: 'unknown' as const };
    const amountType = deriveTypeInfo(apiSchemaData, tableJsonPath, amountColumn);
    expect(amountType?.columnType).toBe('decimal');
    expect(amountType?.precision).toBe('10');
    expect(amountType?.scale).toBe('2');

    const dateColumn = { columnName: 'EffectiveDate', jsonPath: '.effectiveDate', columnType: 'unknown' as const };
    expect(deriveTypeInfo(apiSchemaData, tableJsonPath, dateColumn)?.columnType).toBe('date');

    const dateTimeColumn = {
      columnName: 'LastModifiedDateTime',
      jsonPath: '.lastModifiedDateTime',
      columnType: 'unknown' as const,
    };
    expect(deriveTypeInfo(apiSchemaData, tableJsonPath, dateTimeColumn)?.columnType).toBe('datetime');

    expect(resolveAbsoluteJsonPath('$.items[*]', '.value')).toBe('$.items[*].value');
  });
});
