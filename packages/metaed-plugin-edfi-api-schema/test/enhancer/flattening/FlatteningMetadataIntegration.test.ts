// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntityBuilder,
  AssociationBuilder,
  CommonBuilder,
  DescriptorBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  DomainEntitySubclassBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  commonReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  descriptorReferenceEnhancer,
  associationReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { EntityApiSchemaData } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';

// Import all flattening enhancers
import { enhance as flatteningMetadataInitializer } from '../../../src/enhancer/flattening/FlatteningMetadataInitializerEnhancer';
import { enhance as tableStructureAnalyzer } from '../../../src/enhancer/flattening/TableStructureAnalyzerEnhancer';
import { enhance as columnMappingBuilder } from '../../../src/enhancer/flattening/ColumnMappingBuilderEnhancer';
import { enhance as collectionTableBuilder } from '../../../src/enhancer/flattening/CollectionTableBuilderEnhancer';
import { enhance as referenceResolver } from '../../../src/enhancer/flattening/ReferenceResolverEnhancer';
import { enhance as sqlTypeMapper } from '../../../src/enhancer/flattening/SqlTypeMapperEnhancer';
import { enhance as polymorphicReferenceEnhancer } from '../../../src/enhancer/flattening/PolymorphicReferenceEnhancer';

// Import supporting enhancers
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';

/**
 * Helper to run all prerequisite enhancers in the correct order
 */
function runPrerequisiteEnhancers(metaEd: MetaEdEnvironment): void {
  // Basic setup from unified plugin
  domainEntityReferenceEnhancer(metaEd);
  inlineCommonReferenceEnhancer(metaEd);
  commonReferenceEnhancer(metaEd);
  descriptorReferenceEnhancer(metaEd);
  associationReferenceEnhancer(metaEd);

  // API schema data setup
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);

  // API mapping enhancers - order matches production EnhancerList
  referenceComponentEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);

  // Process all properties recursively for Commons
  // Run property collecting again to get nested properties
  propertyCollectingEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);

  apiEntityMappingEnhancer(metaEd);

  // JSON path mapping
  allJsonPathsMappingEnhancer(metaEd);
  mergeJsonPathsMappingEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
}

/**
 * Helper to run all flattening enhancers in the correct order
 */
function runFlatteningEnhancers(metaEd: MetaEdEnvironment): void {
  flatteningMetadataInitializer(metaEd);
  tableStructureAnalyzer(metaEd);
  columnMappingBuilder(metaEd);
  collectionTableBuilder(metaEd);
  referenceResolver(metaEd);
  sqlTypeMapper(metaEd);
  polymorphicReferenceEnhancer(metaEd);
}

describe('FlatteningMetadata Integration Tests', () => {
  let metaEd: MetaEdEnvironment;

  describe('Complex Entity with Collections', () => {
    beforeEach(() => {
      metaEd = newMetaEdEnvironment();

      // Create a School entity with an addresses collection
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        // Define supporting descriptor
        .withStartDescriptor('AddressTypeDescriptor')
        .withDocumentation('Address type descriptor')
        .withStringIdentity('CodeValue', 'Code', '50')
        .withEndDescriptor()

        // Define a common Address type
        .withStartCommon('Address')
        .withDocumentation('An address')
        .withDescriptorProperty('AddressTypeDescriptor', 'The type of address', true, false)
        .withStringProperty('StreetNumberName', 'The street address', true, false, '150')
        .withStringProperty('City', 'The city', true, false, '30')
        .withStringProperty('StateAbbreviation', 'The state', true, false, '2')
        .withEndCommon()

        // Define School entity with address collection
        .withStartDomainEntity('School')
        .withDocumentation('A school')
        .withIntegerIdentity('SchoolId', 'School identifier')
        .withStringProperty('NameOfInstitution', 'Name of the school', true, false, '255')
        .withCommonProperty('Address', 'Addresses for the school', false, true) // isRequired=false, isCollection=true
        .withEndDomainEntity()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DescriptorBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);
    });

    it('should create child table for address collection', () => {
      runFlatteningEnhancers(metaEd);

      const school = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('School');
      const apiSchemaData = school?.data.edfiApiSchema as EntityApiSchemaData;
      const rootTable = apiSchemaData.flatteningMetadata?.table;

      // Check root table
      expect(rootTable?.baseName).toBe('School');
      expect(rootTable?.jsonPath).toBe('$');

      // Check for child table created for addresses collection
      expect(rootTable?.childTables.length).toBeGreaterThan(0);

      const addressTable = rootTable?.childTables[0];
      expect(addressTable?.baseName).toContain('Address');
      expect(addressTable?.jsonPath).toContain('Addresses[*]');

      // Check for parent reference column in child table
      const parentRefColumn = addressTable?.columns.find((col) => col.isParentReference);
      expect(parentRefColumn).toBeDefined();
      expect(parentRefColumn?.columnName).toContain('_Id');
      expect(parentRefColumn?.columnType).toBe('bigint');
      expect(parentRefColumn?.isRequired).toBe(true);
    });

    it('should create columns for root table properties', () => {
      runFlatteningEnhancers(metaEd);

      const school = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('School');
      const apiSchemaData = school?.data.edfiApiSchema as EntityApiSchemaData;
      const rootTable = apiSchemaData.flatteningMetadata?.table;

      // Check for identity column
      const schoolIdColumn = rootTable?.columns.find((col) => col.columnName === 'SchoolId');
      expect(schoolIdColumn).toBeDefined();
      expect(schoolIdColumn?.isNaturalKey).toBe(true);
      expect(schoolIdColumn?.isRequired).toBe(true);

      // Check for property column
      const nameColumn = rootTable?.columns.find((col) => col.columnName === 'NameOfInstitution');
      expect(nameColumn).toBeDefined();
      expect(nameColumn?.columnType).toBe('string');
      expect(nameColumn?.maxLength).toBe('255');
    });
  });

  describe('Association with References', () => {
    beforeEach(() => {
      metaEd = newMetaEdEnvironment();

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        // Define Student entity
        .withStartDomainEntity('Student')
        .withDocumentation('A student')
        .withStringIdentity('StudentUniqueId', 'Student unique identifier', '100')
        .withEndDomainEntity()

        // Define School entity
        .withStartDomainEntity('School')
        .withDocumentation('A school')
        .withIntegerIdentity('SchoolId', 'School identifier')
        .withEndDomainEntity()

        // Define StudentSchoolAssociation
        .withStartAssociation('StudentSchoolAssociation')
        .withDocumentation('Student school association')
        .withDomainEntityProperty('Student', 'The student', true, false)
        .withDomainEntityProperty('School', 'The school', true, false)
        .withDateIdentity('EntryDate', 'Entry date')
        .withEndAssociation()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new AssociationBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);
    });

    it('should create reference columns in association table', () => {
      runFlatteningEnhancers(metaEd);

      const association = metaEd.namespace.get('EdFi')?.entity.association.get('StudentSchoolAssociation');
      const apiSchemaData = association?.data.edfiApiSchema as EntityApiSchemaData;
      const table = apiSchemaData.flatteningMetadata?.table;

      // Check for Student reference column
      const studentRefColumn = table?.columns.find(
        (col) => col.fromReferencePath === 'StudentReference' || col.columnName === 'Student_Id',
      );
      expect(studentRefColumn).toBeDefined();
      expect(studentRefColumn?.columnType).toBe('bigint');

      // Check for School reference column
      const schoolRefColumn = table?.columns.find(
        (col) => col.fromReferencePath === 'SchoolReference' || col.columnName === 'School_Id',
      );
      expect(schoolRefColumn).toBeDefined();
      expect(schoolRefColumn?.columnType).toBe('bigint');

      // Check for identity column
      const entryDateColumn = table?.columns.find((col) => col.columnName === 'EntryDate');
      expect(entryDateColumn).toBeDefined();
      expect(entryDateColumn?.columnType).toBe('date');
      expect(entryDateColumn?.isNaturalKey).toBe(true);
    });
  });

  describe('Subclass with Discriminator', () => {
    beforeEach(() => {
      metaEd = newMetaEdEnvironment();

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        // Define supporting descriptor
        .withStartDescriptor('SchoolTypeDescriptor')
        .withDocumentation('School type descriptor')
        .withStringIdentity('CodeValue', 'Code', '50')
        .withEndDescriptor()

        // Define base EducationOrganization (as abstract)
        .withStartAbstractEntity('EducationOrganization')
        .withDocumentation('An education organization')
        .withIntegerIdentity('EducationOrganizationId', 'Education organization identifier')
        .withStringProperty('NameOfInstitution', 'Name of the institution', true, false, '255')
        .withEndAbstractEntity()

        // Define School subclass
        .withStartDomainEntitySubclass('School', 'EducationOrganization')
        .withDocumentation('A school')
        .withIntegerIdentity('SchoolId', 'School identifier', 'EducationOrganizationId')
        .withDescriptorProperty('SchoolTypeDescriptor', 'Type of school', false, true)
        .withEndDomainEntitySubclass()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DescriptorBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);
    });

    it('should set discriminator value for subclass', () => {
      runFlatteningEnhancers(metaEd);

      const school = metaEd.namespace.get('EdFi')?.entity.domainEntitySubclass.get('School');
      const apiSchemaData = school?.data.edfiApiSchema as EntityApiSchemaData;
      const table = apiSchemaData.flatteningMetadata?.table;

      // Check discriminator value
      expect(table?.discriminatorValue).toBe('School');

      // Check for superclass identity marked
      const schoolIdColumn = table?.columns.find((col) => col.columnName === 'SchoolId');
      expect(schoolIdColumn).toBeDefined();
      expect(schoolIdColumn?.isSuperclassIdentity).toBe(true);
    });
  });

  describe('Nested Collections', () => {
    beforeEach(() => {
      metaEd = newMetaEdEnvironment();

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        // Define a Period common type
        .withStartCommon('Period')
        .withDocumentation('A time period')
        .withDateProperty('BeginDate', 'Begin date', true, false)
        .withDateProperty('EndDate', 'End date', false, false)
        .withEndCommon()

        // Define Address with nested periods
        .withStartCommon('Address')
        .withDocumentation('An address')
        .withStringProperty('StreetNumberName', 'Street address', true, false, '150')
        .withCommonProperty('Period', 'Periods for this address', false, true) // isRequired=false, isCollection=true
        .withEndCommon()

        // Define Student with addresses that have periods
        .withStartDomainEntity('Student')
        .withDocumentation('A student')
        .withStringIdentity('StudentUniqueId', 'Student unique identifier', '100')
        .withCommonProperty('Address', 'Student addresses', false, true) // isRequired=false, isCollection=true
        .withEndDomainEntity()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);
    });

    it('should create nested table hierarchy for nested collections', () => {
      runFlatteningEnhancers(metaEd);

      const student = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Student');
      const apiSchemaData = student?.data.edfiApiSchema as EntityApiSchemaData;
      const rootTable = apiSchemaData.flatteningMetadata?.table;

      // Check for first-level child table (addresses)
      expect(rootTable?.childTables.length).toBeGreaterThan(0);
      const addressTable = rootTable?.childTables[0];
      expect(addressTable?.baseName).toContain('Address');
      expect(addressTable?.jsonPath).toContain('Addresses[*]');

      // Check for second-level child table (periods within addresses)
      expect(addressTable?.childTables.length).toBeGreaterThan(0);
      const periodTable = addressTable?.childTables[0];
      expect(periodTable?.baseName).toContain('Period');
      expect(periodTable?.jsonPath).toContain('Periods[*]');

      // Check parent reference in nested table
      const parentRef = periodTable?.columns.find((col) => col.isParentReference);
      expect(parentRef).toBeDefined();
      expect(parentRef?.columnType).toBe('bigint');
    });
  });

  describe('SQL Type Mapping', () => {
    beforeEach(() => {
      metaEd = newMetaEdEnvironment();

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        // Define supporting descriptor
        .withStartDescriptor('TypeDescriptor')
        .withDocumentation('Type descriptor')
        .withStringIdentity('CodeValue', 'Code', '50')
        .withEndDescriptor()

        .withStartDomainEntity('TestEntity')
        .withDocumentation('Test entity with various types')
        .withIntegerIdentity('Id', 'Identifier')
        .withStringProperty('Name', 'Name', true, false, '100')
        .withBooleanProperty('IsActive', 'Is active', true, false)
        .withDateProperty('StartDate', 'Start date', true, false)
        .withTimeProperty('StartTime', 'Start time', false, false)
        .withYearProperty('SchoolYear', 'School year', false, false)
        .withDecimalProperty('Amount', 'Amount', false, false, '10', '2')
        .withDescriptorProperty('TypeDescriptor', 'Type descriptor', false, false)
        .withEndDomainEntity()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DescriptorBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);
    });

    it('should map MetaEd types to SQL column types correctly', () => {
      runFlatteningEnhancers(metaEd);

      const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('TestEntity');
      const apiSchemaData = entity?.data.edfiApiSchema as EntityApiSchemaData;
      const table = apiSchemaData.flatteningMetadata?.table;

      // Check integer type
      const idColumn = table?.columns.find((col) => col.columnName === 'Id');
      expect(idColumn?.columnType).toBe('integer');

      // Check string type with maxLength
      const nameColumn = table?.columns.find((col) => col.columnName === 'Name');
      expect(nameColumn?.columnType).toBe('string');
      expect(nameColumn?.maxLength).toBe('100');

      // Check boolean type
      const isActiveColumn = table?.columns.find((col) => col.columnName === 'IsActive');
      expect(isActiveColumn?.columnType).toBe('boolean');

      // Check date type
      const startDateColumn = table?.columns.find((col) => col.columnName === 'StartDate');
      expect(startDateColumn?.columnType).toBe('date');

      // Check time type
      const startTimeColumn = table?.columns.find((col) => col.columnName === 'StartTime');
      expect(startTimeColumn?.columnType).toBe('time');

      // Check year type
      const yearColumn = table?.columns.find((col) => col.columnName === 'SchoolYear');
      expect(yearColumn?.columnType).toBe('year');

      // Check decimal type
      const amountColumn = table?.columns.find((col) => col.columnName === 'Amount');
      expect(amountColumn?.columnType).toBe('decimal');
      expect(amountColumn?.precision).toBe('10');
      expect(amountColumn?.scale).toBe('2');

      // Check descriptor type
      const descriptorColumn = table?.columns.find((col) => col.columnName?.includes('Descriptor'));
      expect(descriptorColumn?.columnType).toBe('descriptor');
    });
  });

  describe('Extension Tables', () => {
    beforeEach(() => {
      metaEd = newMetaEdEnvironment();

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        // Base Contact entity
        .withStartDomainEntity('Contact')
        .withDocumentation('A contact')
        .withStringIdentity('ContactUniqueId', 'Contact unique identifier', '32')
        .withStringProperty('FirstName', 'First name', false, false, '75')
        .withEndDomainEntity()

        .withEndNamespace()

        // Extension in a different namespace
        .withBeginNamespace('Sample')

        .withStartDomainEntityExtension('Contact')
        .withDocumentation('Contact extension')
        .withBooleanProperty('IsEmergencyContact', 'Is emergency contact', false, false)
        .withEndDomainEntityExtension()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);
    });

    it('should mark extension tables with isExtensionTable flag', () => {
      runFlatteningEnhancers(metaEd);

      // Check the extension
      const contactExtension = metaEd.namespace.get('Sample')?.entity.domainEntityExtension.get('Contact');
      const apiSchemaData = contactExtension?.data.edfiApiSchema as EntityApiSchemaData;
      const table = apiSchemaData.flatteningMetadata?.table;

      expect(table?.baseName).toContain('Extension');
      expect(table?.isExtensionTable).toBe(true);
    });
  });
});
