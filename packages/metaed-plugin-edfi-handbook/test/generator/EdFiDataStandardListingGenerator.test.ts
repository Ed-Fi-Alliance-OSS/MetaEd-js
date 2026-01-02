// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  newNamespace,
  newDomain,
  newDomainEntity,
  newEntityProperty,
  newMetaEdEnvironment,
  EntityProperty,
} from '@edfi/metaed-core';
import { generate, extractDataType } from '../../src/generator/EdFiDataStandardListingGenerator';

describe('EdFiDataStandardListingGenerator', () => {
  it('should create data standard listing with three worksheets', async () => {
    // Create a minimal test MetaEd environment
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    // Create test namespace
    const testNamespace = newNamespace();
    testNamespace.namespaceName = 'TestNamespace';
    testNamespace.projectVersion = '1.0.0';

    // Create test domain
    const testDomain = newDomain();
    testDomain.metaEdName = 'TestDomain';
    testDomain.documentation = 'Test domain description';

    // Create test entity
    const testEntity = newDomainEntity();
    testEntity.metaEdName = 'TestEntity';
    testEntity.documentation = 'Test entity description';

    // Create test property
    const testProperty = newEntityProperty();
    testProperty.metaEdName = 'TestProperty';
    testProperty.documentation = 'Test property description';
    testProperty.type = 'string';

    // Wire up the relationships
    testEntity.properties = [testProperty];
    testDomain.entities = [testEntity];
    testNamespace.entity.domain.set('TestDomain', testDomain);
    metaEd.namespace.set('TestNamespace', testNamespace);

    // Generate the result
    const result = await generate(metaEd);

    // Verify the generator result
    expect(result.generatorName).toBe('edfiHandbook.DataStandardListingGenerator');
    expect(result.generatedOutput).toHaveLength(1);
    expect(result.generatedOutput[0].fileName).toBe('Data-Standard-Listing.xlsx');
    expect(result.generatedOutput[0].name).toBe('Data Standard Listing Excel');
  });

  describe('extractDataType', () => {
    it('should return empty string for unknown type', () => {
      const property = { type: 'unknown' } as EntityProperty;
      expect(extractDataType(property)).toBe('');
    });

    it('should return "reference" for association type', () => {
      const property = { type: 'association' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "Boolean" for boolean type', () => {
      const property = { type: 'boolean' } as EntityProperty;
      expect(extractDataType(property)).toBe('Boolean');
    });

    it('should return "reference" for choice type', () => {
      const property = { type: 'choice' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "reference" for common type', () => {
      const property = { type: 'common' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "decimal(19,4)" for currency type', () => {
      const property = { type: 'currency' } as EntityProperty;
      expect(extractDataType(property)).toBe('decimal(19,4)');
    });

    it('should return "date" for date type', () => {
      const property = { type: 'date' } as EntityProperty;
      expect(extractDataType(property)).toBe('date');
    });

    it('should return "timestamp" for datetime type', () => {
      const property = { type: 'datetime' } as EntityProperty;
      expect(extractDataType(property)).toBe('timestamp');
    });

    it('should return formatted decimal for decimal type', () => {
      const property = { type: 'decimal', totalDigits: 10, decimalPlaces: 2 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('decimal(10, 2)');
    });

    it('should return "descriptor" for descriptor type', () => {
      const property = { type: 'descriptor' } as EntityProperty;
      expect(extractDataType(property)).toBe('descriptor');
    });

    it('should return "reference" for domainEntity type', () => {
      const property = { type: 'domainEntity' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "string(30)" for duration type', () => {
      const property = { type: 'duration' } as EntityProperty;
      expect(extractDataType(property)).toBe('string(30)');
    });

    it('should return "reference" for enumeration type', () => {
      const property = { type: 'enumeration' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "reference" for inlineCommon type', () => {
      const property = { type: 'inlineCommon' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "int32" for integer type without big hint', () => {
      const property = { type: 'integer', hasBigHint: false } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('int32');
    });

    it('should return "int64" for integer type with big hint', () => {
      const property = { type: 'integer', hasBigHint: true } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('int64');
    });

    it('should return "decimal(5, 4)" for percent type', () => {
      const property = { type: 'percent' } as EntityProperty;
      expect(extractDataType(property)).toBe('decimal(5, 4)');
    });

    it('should return "reference" for schoolYearEnumeration type', () => {
      const property = { type: 'schoolYearEnumeration' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return formatted decimal for sharedDecimal type', () => {
      const property = { type: 'sharedDecimal', totalDigits: 15, decimalPlaces: 3 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('decimal(15, 3)');
    });

    it('should return "int32" for sharedInteger type without big hint', () => {
      const property = { type: 'sharedInteger', hasBigHint: false } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('int32');
    });

    it('should return "int64" for sharedInteger type with big hint', () => {
      const property = { type: 'sharedInteger', hasBigHint: true } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('int64');
    });

    it('should return "int16" for sharedShort type', () => {
      const property = { type: 'sharedShort' } as EntityProperty;
      expect(extractDataType(property)).toBe('int16');
    });

    it('should return formatted string for sharedString type with minLength and maxLength', () => {
      const property = { type: 'sharedString', minLength: 5, maxLength: 100 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('string(5,100)');
    });

    it('should return formatted string for sharedString type with only maxLength', () => {
      const property = { type: 'sharedString', maxLength: 50 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('string(0,50)');
    });

    it('should return "int16" for short type', () => {
      const property = { type: 'short' } as EntityProperty;
      expect(extractDataType(property)).toBe('int16');
    });

    it('should return formatted string for string type with minLength and maxLength', () => {
      const property = { type: 'string', minLength: 1, maxLength: 255 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('string(1,255)');
    });

    it('should return formatted string for string type with only maxLength', () => {
      const property = { type: 'string', maxLength: 200 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('string(0,200)');
    });

    it('should return "time" for time type', () => {
      const property = { type: 'time' } as EntityProperty;
      expect(extractDataType(property)).toBe('time');
    });

    it('should return "int16" for year type', () => {
      const property = { type: 'year' } as EntityProperty;
      expect(extractDataType(property)).toBe('int16');
    });
  });
});
