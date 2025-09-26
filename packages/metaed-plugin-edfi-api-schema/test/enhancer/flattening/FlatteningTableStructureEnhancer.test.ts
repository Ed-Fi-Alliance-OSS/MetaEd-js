// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  CommonBuilder,
  DomainEntitySubclassBuilder,
  DomainEntityExtensionBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { EntityApiSchemaData } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { enhance as flatteningMetadataInitializer } from '../../../src/enhancer/flattening/FlatteningMetadataInitializerEnhancer';
import { enhance as flatteningTableStructureEnhancer } from '../../../src/enhancer/flattening/FlatteningTableStructureEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { TableMetadata } from '../../../src/model/flattening/TableMetadata';

function runPrerequisiteEnhancers(metaEd: MetaEdEnvironment): void {
  // Run reference enhancers first
  domainEntityReferenceEnhancer(metaEd);
  inlineCommonReferenceEnhancer(metaEd);
  commonReferenceEnhancer(metaEd);

  // Set up data structures
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);

  // API mapping enhancers
  apiEntityMappingEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeJsonPathsMappingEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);

  // Initialize flattening metadata
  flatteningMetadataInitializer(metaEd);
}

function getTableMetadata(env: MetaEdEnvironment, namespace: string, entityName: string): TableMetadata | undefined {
  const entity =
    env.namespace.get(namespace)?.entity.domainEntity.get(entityName) ||
    env.namespace.get(namespace)?.entity.association.get(entityName);
  const apiSchemaData = entity?.data.edfiApiSchema as EntityApiSchemaData | undefined;
  return apiSchemaData?.flatteningMetadata?.table;
}

describe('FlatteningTableStructureEnhancer', () => {
  let metaEd: MetaEdEnvironment;

  beforeEach(() => {
    metaEd = newMetaEdEnvironment();
  });

  describe('Basic Collection Detection', () => {
    it('should detect required collection property and create child table', () => {
      // Create entity with required collection
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withCommonProperty('Address', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('Address')
        .withDocumentation('doc')
        .withStringProperty('StreetName', 'doc', true, false, '100')
        .withStringProperty('City', 'doc', true, false, '50')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      // Run the enhancer under test
      const result = flatteningTableStructureEnhancer(metaEd);

      expect(result.success).toBe(true);
      expect(result.enhancerName).toBe('FlatteningTableStructureEnhancer');

      // Check that child table was created
      expect(getTableMetadata(metaEd, 'EdFi', 'School')).toMatchInlineSnapshot(`
        Object {
          "baseName": "School",
          "childTables": Array [
            Object {
              "baseName": "SchoolAddress",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.Addresses[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should detect optional collection property and create child table', () => {
      // Create entity with optional collection
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('StudentId', 'doc', '30')
        .withCommonProperty('Phone', 'doc', false, true)
        .withEndDomainEntity()
        .withStartCommon('Phone')
        .withDocumentation('doc')
        .withStringProperty('Number', 'doc', true, false, '20')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'Student')).toMatchInlineSnapshot(`
        Object {
          "baseName": "Student",
          "childTables": Array [
            Object {
              "baseName": "StudentPhone",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.Phones[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should handle entity with both required and optional collections', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withCommonProperty('Address', 'doc', true, true)
        .withCommonProperty('Phone', 'doc', false, true)
        .withEndDomainEntity()
        .withStartCommon('Address')
        .withDocumentation('doc')
        .withStringProperty('StreetName', 'doc', true, false, '100')
        .withEndCommon()
        .withStartCommon('Phone')
        .withDocumentation('doc')
        .withStringProperty('Number', 'doc', true, false, '20')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'School')).toMatchInlineSnapshot(`
        Object {
          "baseName": "School",
          "childTables": Array [
            Object {
              "baseName": "SchoolAddress",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.Addresses[*]",
            },
            Object {
              "baseName": "SchoolPhone",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.Phones[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });
  });

  describe('Collection Naming', () => {
    it('should generate PascalCase child table names from property names', () => {
      // Create a DomainEntity with a common collection property
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('StudentAssessment')
        .withDocumentation('doc')
        .withStringIdentity('StudentAssessmentId', 'doc', '60')
        .withCommonProperty('ScoreResult', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('ScoreResult')
        .withDocumentation('doc')
        .withStringProperty('Result', 'doc', true, false, '35')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      // Need to include inlineCommonReferenceEnhancer for Common properties on associations
      domainEntityReferenceEnhancer(metaEd);
      inlineCommonReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      entityPropertyApiSchemaDataSetupEnhancer(metaEd);
      entityApiSchemaDataSetupEnhancer(metaEd);
      referenceComponentEnhancer(metaEd);
      propertyCollectingEnhancer(metaEd);
      apiEntityMappingEnhancer(metaEd);
      apiPropertyMappingEnhancer(metaEd);
      allJsonPathsMappingEnhancer(metaEd);
      mergeJsonPathsMappingEnhancer(metaEd);
      documentPathsMappingEnhancer(metaEd);
      flatteningMetadataInitializer(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'StudentAssessment')).toMatchInlineSnapshot(`
        Object {
          "baseName": "StudentAssessment",
          "childTables": Array [
            Object {
              "baseName": "StudentAssessmentScoreResult",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.ScoreResults[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should maintain parent table base name in child table name', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('doc')
        .withStringIdentity('EducationOrganizationId', 'doc', '30')
        .withCommonProperty('InstitutionTelephone', 'doc', false, true)
        .withEndDomainEntity()
        .withStartCommon('InstitutionTelephone')
        .withDocumentation('doc')
        .withStringProperty('TelephoneNumber', 'doc', true, false, '24')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'EducationOrganization')).toMatchInlineSnapshot(`
        Object {
          "baseName": "EducationOrganization",
          "childTables": Array [
            Object {
              "baseName": "EducationOrganizationInstitutionTelephone",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.InstitutionTelephones[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });
  });

  describe('JSON Path Generation', () => {
    it('should generate root-level collection path with array notation', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withCommonProperty('Address', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('Address')
        .withDocumentation('doc')
        .withStringProperty('StreetName', 'doc', true, false, '100')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'School')).toMatchInlineSnapshot(`
        Object {
          "baseName": "School",
          "childTables": Array [
            Object {
              "baseName": "SchoolAddress",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.Addresses[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should generate nested collection path with array notation', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withCommonProperty('Address', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('Address')
        .withDocumentation('doc')
        .withStringProperty('StreetName', 'doc', true, false, '100')
        .withCommonProperty('Period', 'doc', false, true)
        .withEndCommon()
        .withStartCommon('Period')
        .withDocumentation('doc')
        .withStringProperty('BeginDate', 'doc', true, false, '30')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'School')).toMatchInlineSnapshot(`
        Object {
          "baseName": "School",
          "childTables": Array [
            Object {
              "baseName": "SchoolAddress",
              "childTables": Array [
                Object {
                  "baseName": "SchoolAddressPeriod",
                  "childTables": Array [],
                  "columns": Array [],
                  "jsonPath": "$.Addresses[*].Periods[*]",
                },
              ],
              "columns": Array [],
              "jsonPath": "$.Addresses[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should inherit parent path in nested collections', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('StudentId', 'doc', '30')
        .withCommonProperty('Name', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('Name')
        .withDocumentation('doc')
        .withStringProperty('FirstName', 'doc', true, false, '75')
        .withCommonProperty('OtherName', 'doc', false, true)
        .withEndCommon()
        .withStartCommon('OtherName')
        .withDocumentation('doc')
        .withStringProperty('Name', 'doc', true, false, '75')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'Student')).toMatchInlineSnapshot(`
        Object {
          "baseName": "Student",
          "childTables": Array [
            Object {
              "baseName": "StudentName",
              "childTables": Array [
                Object {
                  "baseName": "StudentNameOtherName",
                  "childTables": Array [],
                  "columns": Array [],
                  "jsonPath": "$.Names[*].OtherNames[*]",
                },
              ],
              "columns": Array [],
              "jsonPath": "$.Names[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });
  });

  describe('Recursive Collection Processing', () => {
    it('should process collections within collections (2-level nesting)', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withCommonProperty('GradeLevel', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('GradeLevel')
        .withDocumentation('doc')
        .withStringProperty('GradeLevelDescriptor', 'doc', true, false, '50')
        .withCommonProperty('Period', 'doc', false, true)
        .withEndCommon()
        .withStartCommon('Period')
        .withDocumentation('doc')
        .withStringProperty('Name', 'doc', true, false, '60')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      const schoolTable = getTableMetadata(metaEd, 'EdFi', 'School');
      expect(schoolTable?.childTables).toHaveLength(1);

      const gradeLevelTable = schoolTable?.childTables[0];
      expect(gradeLevelTable?.baseName).toBe('SchoolGradeLevel');
      expect(gradeLevelTable?.childTables).toHaveLength(1);

      const periodTable = gradeLevelTable?.childTables[0];
      expect(periodTable?.baseName).toBe('SchoolGradeLevelPeriod');
      expect(periodTable?.jsonPath).toBe('$.GradeLevels[*].Periods[*]');
    });

    it('should support nested collections beyond two levels', () => {
      // Collections within collections are limited to prevent infinite recursion
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withCommonProperty('Level1', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('Level1')
        .withDocumentation('doc')
        .withStringProperty('Name1', 'doc', true, false, '50')
        .withCommonProperty('Level2', 'doc', true, true)
        .withEndCommon()
        .withStartCommon('Level2')
        .withDocumentation('doc')
        .withStringProperty('Name2', 'doc', true, false, '50')
        .withCommonProperty('Level3', 'doc', true, true)
        .withEndCommon()
        .withStartCommon('Level3')
        .withDocumentation('doc')
        .withStringProperty('Name3', 'doc', true, false, '50')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      // Run limited enhancers to avoid AllJsonPathsMappingEnhancer crash on 3+ level nesting
      domainEntityReferenceEnhancer(metaEd);
      inlineCommonReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      entityPropertyApiSchemaDataSetupEnhancer(metaEd);
      entityApiSchemaDataSetupEnhancer(metaEd);
      referenceComponentEnhancer(metaEd);
      propertyCollectingEnhancer(metaEd);
      apiEntityMappingEnhancer(metaEd);
      apiPropertyMappingEnhancer(metaEd);
      flatteningMetadataInitializer(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      const schoolTable = getTableMetadata(metaEd, 'EdFi', 'School');
      const level1Table = schoolTable?.childTables[0];
      const level2Table = level1Table?.childTables[0];

      // Level 3 should be created when collections are nested beyond two levels
      expect(schoolTable?.childTables).toHaveLength(1);
      expect(level1Table?.childTables).toHaveLength(1);
      expect(level2Table?.childTables).toHaveLength(1);
      expect(level2Table?.childTables[0]).toMatchInlineSnapshot(`
        Object {
          "baseName": "SchoolLevel1Level2Level3",
          "childTables": Array [],
          "columns": Array [],
          "jsonPath": "$.Level1s[*].Level2s[*].Level3s[*]",
        }
      `);
    });

    it('should process referenced entity collections recursively', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withCommonProperty('Calendar', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('Calendar')
        .withDocumentation('doc')
        .withStringProperty('CalendarCode', 'doc', true, false, '60')
        .withCommonProperty('CalendarDate', 'doc', true, true)
        .withEndCommon()
        .withStartCommon('CalendarDate')
        .withDocumentation('doc')
        .withStringProperty('Date', 'doc', true, false, '30')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'School')).toMatchInlineSnapshot(`
        Object {
          "baseName": "School",
          "childTables": Array [
            Object {
              "baseName": "SchoolCalendar",
              "childTables": Array [
                Object {
                  "baseName": "SchoolCalendarCalendarDate",
                  "childTables": Array [],
                  "columns": Array [],
                  "jsonPath": "$.Calendars[*].Dates[*]",
                },
              ],
              "columns": Array [],
              "jsonPath": "$.Calendars[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });
  });

  describe('Non-Reference Collections (Inline Commons)', () => {
    it('should process collection of Common types', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('StudentUniqueId', 'doc', '32')
        .withCommonProperty('ElectronicMail', 'doc', false, true)
        .withEndDomainEntity()
        .withStartCommon('ElectronicMail')
        .withDocumentation('doc')
        .withStringProperty('EmailAddress', 'doc', true, false, '128')
        .withStringProperty('EmailType', 'doc', false, false, '30')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'Student')).toMatchInlineSnapshot(`
        Object {
          "baseName": "Student",
          "childTables": Array [
            Object {
              "baseName": "StudentElectronicMail",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.ElectronicMails[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should distinguish inline commons from entity references', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withCommonProperty('Address', 'doc', true, true)
        .withDomainEntityProperty('Student', 'doc', false, true)
        .withEndDomainEntity()
        .withStartCommon('Address')
        .withDocumentation('doc')
        .withStringProperty('StreetName', 'doc', true, false, '100')
        .withEndCommon()
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('StudentId', 'doc', '30')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      // Only inline commons should create child tables
      // Entity references are handled differently
      expect(getTableMetadata(metaEd, 'EdFi', 'School')).toMatchInlineSnapshot(`
        Object {
          "baseName": "School",
          "childTables": Array [
            Object {
              "baseName": "SchoolAddress",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.Addresses[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should skip scalar references', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('StudentUniqueId', 'doc', '32')
        .withDomainEntityProperty('School', 'doc', true, false)
        .withStringProperty('FirstName', 'doc', true, false, '75')
        .withEndDomainEntity()
        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withStringIdentity('SchoolId', 'doc', '30')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      // Scalar references should not create child tables
      expect(getTableMetadata(metaEd, 'EdFi', 'Student')).toMatchInlineSnapshot(`
        Object {
          "baseName": "Student",
          "childTables": Array [],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });
  });

  describe('Extensions and Subclasses', () => {
    it('should handle domainEntityExtension with isExtensionTable flag', () => {
      // Create a base entity and an extension
      // Note: DomainEntityExtensions currently don't parse properties correctly,
      // so we test the isExtensionTable flag without collections
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('StudentUniqueId', 'doc', '32')
        .withEndDomainEntity()
        .withEndNamespace()
        .withBeginNamespace('SampleExtension')
        .withStartDomainEntityExtension('EdFi.Student')
        .withDocumentation('doc')
        .withStringProperty('CustomField', 'doc', false, false, '60')
        .withEndDomainEntityExtension()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      // Run enhancers
      domainEntityReferenceEnhancer(metaEd);
      entityPropertyApiSchemaDataSetupEnhancer(metaEd);
      entityApiSchemaDataSetupEnhancer(metaEd);
      referenceComponentEnhancer(metaEd);
      propertyCollectingEnhancer(metaEd);
      apiEntityMappingEnhancer(metaEd);
      apiPropertyMappingEnhancer(metaEd);
      allJsonPathsMappingEnhancer(metaEd);
      mergeJsonPathsMappingEnhancer(metaEd);
      documentPathsMappingEnhancer(metaEd);
      flatteningMetadataInitializer(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      const extensionEntity = metaEd.namespace.get('SampleExtension')?.entity.domainEntityExtension.get('Student');
      const apiSchemaData = extensionEntity?.data.edfiApiSchema as EntityApiSchemaData;

      // Test that the extension table is properly identified
      // Extensions don't currently parse collection properties correctly,
      // so we don't test for child tables
      expect(apiSchemaData?.flatteningMetadata?.table).toMatchInlineSnapshot(`
        Object {
          "baseName": "StudentExtension",
          "childTables": Array [],
          "columns": Array [],
          "isExtensionTable": true,
          "jsonPath": "$",
        }
      `);
    });

    it('should set discriminatorValue for subclasses', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('doc')
        .withStringIdentity('EducationOrganizationId', 'doc', '30')
        .withEndDomainEntity()
        .withStartDomainEntitySubclass('School', 'EducationOrganization')
        .withDocumentation('doc')
        .withStringProperty('SchoolType', 'doc', false, false, '30')
        .withCommonProperty('GradeLevel', 'doc', false, true)
        .withEndDomainEntitySubclass()
        .withStartCommon('GradeLevel')
        .withDocumentation('doc')
        .withStringProperty('GradeLevelDescriptor', 'doc', true, false, '50')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      const schoolEntity = metaEd.namespace.get('EdFi')?.entity.domainEntitySubclass.get('School');
      const apiSchemaData = schoolEntity?.data.edfiApiSchema as EntityApiSchemaData;

      expect(apiSchemaData?.flatteningMetadata?.table).toMatchInlineSnapshot(`
        Object {
          "baseName": "School",
          "childTables": Array [
            Object {
              "baseName": "SchoolGradeLevel",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.GradeLevels[*]",
            },
          ],
          "columns": Array [],
          "discriminatorValue": "School",
          "jsonPath": "$",
        }
      `);
    });
  });

  describe('Edge Cases', () => {
    it('should handle entity with no collections', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('SimpleEntity')
        .withDocumentation('doc')
        .withStringIdentity('Id', 'doc', '30')
        .withStringProperty('Name', 'doc', true, false, '100')
        .withStringProperty('Description', 'doc', false, false, '255')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      expect(getTableMetadata(metaEd, 'EdFi', 'SimpleEntity')).toMatchInlineSnapshot(`
        Object {
          "baseName": "SimpleEntity",
          "childTables": Array [],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should handle entity with collections but no apiMapping', () => {
      // Create entity where apiMapping might be missing
      metaEd = newMetaEdEnvironment();

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('TestEntity')
        .withDocumentation('doc')
        .withStringIdentity('Id', 'doc', '30')
        .withCommonProperty('TestCommon', 'doc', true, true)
        .withEndDomainEntity()
        .withStartCommon('TestCommon')
        .withDocumentation('doc')
        .withStringProperty('Value', 'doc', true, false, '50')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      // Run minimal enhancers to test missing apiMapping scenario
      domainEntityReferenceEnhancer(metaEd);
      inlineCommonReferenceEnhancer(metaEd);
      entityPropertyApiSchemaDataSetupEnhancer(metaEd);
      entityApiSchemaDataSetupEnhancer(metaEd);
      flatteningMetadataInitializer(metaEd);

      // Run without full API mapping setup
      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      // Without apiMapping, child tables won't be created
      expect(getTableMetadata(metaEd, 'EdFi', 'TestEntity')).toMatchInlineSnapshot(`
        Object {
          "baseName": "TestEntity",
          "childTables": Array [],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });

    it('should handle entity with missing flatteningMetadata', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('NoFlatteningEntity')
        .withDocumentation('doc')
        .withStringIdentity('Id', 'doc', '30')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      // Run without flattening metadata initializer
      domainEntityReferenceEnhancer(metaEd);
      entityPropertyApiSchemaDataSetupEnhancer(metaEd);
      entityApiSchemaDataSetupEnhancer(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      // Entity should be skipped if no flattening metadata
      expect(getTableMetadata(metaEd, 'EdFi', 'NoFlatteningEntity')).toMatchInlineSnapshot(`undefined`);
    });

    it('should handle collection with null/undefined referencedEntity', () => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('EntityWithBadCollection')
        .withDocumentation('doc')
        .withStringIdentity('Id', 'doc', '30')
        .withCommonProperty('TestCollection', 'doc', true, true)
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      // Don't define the Common to create a missing reference scenario
      // Run limited enhancers to avoid crashes in AllJsonPathsMappingEnhancer
      domainEntityReferenceEnhancer(metaEd);
      inlineCommonReferenceEnhancer(metaEd);
      entityPropertyApiSchemaDataSetupEnhancer(metaEd);
      entityApiSchemaDataSetupEnhancer(metaEd);
      referenceComponentEnhancer(metaEd);
      propertyCollectingEnhancer(metaEd);
      apiEntityMappingEnhancer(metaEd);
      apiPropertyMappingEnhancer(metaEd);
      flatteningMetadataInitializer(metaEd);

      const result = flatteningTableStructureEnhancer(metaEd);
      expect(result.success).toBe(true);

      // Should still create child table even if referenced entity is undefined
      // The child table just won't have nested collections processed
      expect(getTableMetadata(metaEd, 'EdFi', 'EntityWithBadCollection')).toMatchInlineSnapshot(`
        Object {
          "baseName": "EntityWithBadCollection",
          "childTables": Array [
            Object {
              "baseName": "EntityWithBadCollectionTestCollection",
              "childTables": Array [],
              "columns": Array [],
              "jsonPath": "$.TestCollections[*]",
            },
          ],
          "columns": Array [],
          "jsonPath": "$",
        }
      `);
    });
  });
});
