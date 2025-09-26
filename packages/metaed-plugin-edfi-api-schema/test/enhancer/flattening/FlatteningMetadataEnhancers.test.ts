// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  AssociationBuilder,
  AssociationSubclassBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import {
  associationReferenceEnhancer,
  associationSubclassBaseClassEnhancer,
  domainEntityReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { EntityApiSchemaData } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { enhance as flatteningMetadataInitializer } from '../../../src/enhancer/flattening/FlatteningMetadataInitializerEnhancer';
import { enhance as tableStructureAnalyzer } from '../../../src/enhancer/flattening/TableStructureAnalyzerEnhancer';
import { enhance as columnMappingBuilder } from '../../../src/enhancer/flattening/ColumnMappingBuilderEnhancer';
import { enhance as sqlTypeMapper } from '../../../src/enhancer/flattening/SqlTypeMapperEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';

describe('FlatteningMetadata Enhancers', () => {
  let metaEd: MetaEdEnvironment;

  beforeEach(() => {
    metaEd = newMetaEdEnvironment();

    // Create a simple test entity using MetaEdTextBuilder
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('Student')
      .withDocumentation('A student')
      .withStringIdentity('StudentUniqueId', 'A unique identifier for the student', '30')
      .withStringProperty('FirstName', 'The student first name', true, false, '75')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    // Run basic enhancers to set up data structures
    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
  });

  describe('FlatteningMetadataInitializerEnhancer', () => {
    it('should initialize flattening metadata for domain entities', () => {
      // Run the enhancer
      const result = flatteningMetadataInitializer(metaEd);

      expect(result.success).toBe(true);
      expect(result.enhancerName).toBe('FlatteningMetadataInitializerEnhancer');

      // Check that flattening metadata was initialized
      const student = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Student');
      const apiSchemaData = student?.data.edfiApiSchema as EntityApiSchemaData;

      expect(apiSchemaData.flatteningMetadata).toBeDefined();
      expect(apiSchemaData.flatteningMetadata?.table.baseName).toBe('Student');
      expect(apiSchemaData.flatteningMetadata?.table.jsonPath).toBe('$');
      expect(apiSchemaData.flatteningMetadata?.table.columns).toEqual([]);
      expect(apiSchemaData.flatteningMetadata?.table.childTables).toEqual([]);
    });

    it('should capture superclass identity metadata for domain entity subclasses', () => {
      const subclassMetaEd = newMetaEdEnvironment();

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartAbstractEntity('EducationOrganization')
        .withDocumentation('Base education organization')
        .withIntegerIdentity('EducationOrganizationId', 'Education organization identifier')
        .withEndAbstractEntity()
        .withStartDomainEntitySubclass('School', 'EducationOrganization')
        .withDocumentation('School subclass')
        .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'School identifier')
        .withEndDomainEntitySubclass()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(subclassMetaEd, []))
        .sendToListener(new DomainEntityBuilder(subclassMetaEd, []))
        .sendToListener(new DomainEntitySubclassBuilder(subclassMetaEd, []));

      domainEntitySubclassBaseClassEnhancer(subclassMetaEd);
      domainEntityReferenceEnhancer(subclassMetaEd);
      entityPropertyApiSchemaDataSetupEnhancer(subclassMetaEd);
      entityApiSchemaDataSetupEnhancer(subclassMetaEd);

      const result = flatteningMetadataInitializer(subclassMetaEd);
      expect(result.success).toBe(true);

      const school = subclassMetaEd.namespace.get('EdFi')?.entity.domainEntitySubclass.get('School');
      const apiSchemaData = school?.data.edfiApiSchema as EntityApiSchemaData;

      expect(apiSchemaData.flatteningMetadata?.superclassIdentity).toBeDefined();
      expect(apiSchemaData.flatteningMetadata?.superclassIdentity?.identityPropertyFullName).toBe('SchoolId');
    });

    it('should capture superclass identity metadata for association subclasses', () => {
      const subclassMetaEd = newMetaEdEnvironment();

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartDomainEntity('Student')
        .withDocumentation('Student entity')
        .withStringIdentity('StudentUniqueId', 'Student unique identifier', '32')
        .withEndDomainEntity()
        .withStartAssociation('StudentProgramAssociation')
        .withDocumentation('Base association')
        .withDomainEntityProperty('Student', 'Student reference', true, false)
        .withIntegerIdentity('ProgramId', 'Program identifier')
        .withEndAssociation()
        .withStartAssociationSubclass('StudentProgramSchoolAssociation', 'StudentProgramAssociation')
        .withDocumentation('Association subclass')
        .withIntegerIdentityRename('SchoolProgramId', 'ProgramId', 'Renamed program identifier')
        .withEndAssociationSubclass()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(subclassMetaEd, []))
        .sendToListener(new DomainEntityBuilder(subclassMetaEd, []))
        .sendToListener(new AssociationBuilder(subclassMetaEd, []))
        .sendToListener(new AssociationSubclassBuilder(subclassMetaEd, []));

      domainEntityReferenceEnhancer(subclassMetaEd);
      associationReferenceEnhancer(subclassMetaEd);
      associationSubclassBaseClassEnhancer(subclassMetaEd);
      entityPropertyApiSchemaDataSetupEnhancer(subclassMetaEd);
      entityApiSchemaDataSetupEnhancer(subclassMetaEd);

      const result = flatteningMetadataInitializer(subclassMetaEd);
      expect(result.success).toBe(true);

      const association = subclassMetaEd.namespace
        .get('EdFi')
        ?.entity.associationSubclass.get('StudentProgramSchoolAssociation');
      const apiSchemaData = association?.data.edfiApiSchema as EntityApiSchemaData;

      expect(apiSchemaData.flatteningMetadata?.superclassIdentity).toBeDefined();
      expect(apiSchemaData.flatteningMetadata?.superclassIdentity?.identityPropertyFullName).toBe(
        'SchoolProgramId',
      );
    });
  });

  describe('ColumnMappingBuilderEnhancer', () => {
    it('should build columns from identity properties', () => {
      // Run prerequisite enhancers
      flatteningMetadataInitializer(metaEd);
      referenceComponentEnhancer(metaEd);
      propertyCollectingEnhancer(metaEd);
      apiPropertyMappingEnhancer(metaEd);
      allJsonPathsMappingEnhancer(metaEd);
      mergeJsonPathsMappingEnhancer(metaEd);
      documentPathsMappingEnhancer(metaEd);
      identityFullnameEnhancer(metaEd);
      identityJsonPathsEnhancer(metaEd);

      // Run the column mapping builder
      const result = columnMappingBuilder(metaEd);

      expect(result.success).toBe(true);
      expect(result.enhancerName).toBe('ColumnMappingBuilderEnhancer');

      // Check that columns were created
      const student = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Student');
      const apiSchemaData = student?.data.edfiApiSchema as EntityApiSchemaData;
      const table = apiSchemaData.flatteningMetadata?.table;

      expect(table?.columns.length).toBeGreaterThan(0);

      // Check for identity column
      const identityColumn = table?.columns.find(col => col.isNaturalKey);
      expect(identityColumn).toBeDefined();
      expect(identityColumn?.columnName).toBe('StudentUniqueId');
      expect(identityColumn?.isRequired).toBe(true);
    });
  });

  describe('SqlTypeMapperEnhancer', () => {
    it('should refine column types', () => {
      // Run prerequisite enhancers
      flatteningMetadataInitializer(metaEd);
      referenceComponentEnhancer(metaEd);
      propertyCollectingEnhancer(metaEd);
      apiPropertyMappingEnhancer(metaEd);
      allJsonPathsMappingEnhancer(metaEd);
      mergeJsonPathsMappingEnhancer(metaEd);
      documentPathsMappingEnhancer(metaEd);
      identityFullnameEnhancer(metaEd);
      identityJsonPathsEnhancer(metaEd);
      columnMappingBuilder(metaEd);

      // Run the SQL type mapper
      const result = sqlTypeMapper(metaEd);

      expect(result.success).toBe(true);
      expect(result.enhancerName).toBe('SqlTypeMapperEnhancer');

      // Check that column types were refined
      const student = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Student');
      const apiSchemaData = student?.data.edfiApiSchema as EntityApiSchemaData;
      const table = apiSchemaData.flatteningMetadata?.table;

      // String columns should have maxLength set
      const stringColumn = table?.columns.find(col => col.columnType === 'string');
      expect(stringColumn?.maxLength).toBeDefined();
    });
  });

  describe('TableStructureAnalyzerEnhancer', () => {
    it('should process entity types correctly', () => {
      // Run prerequisite enhancers
      flatteningMetadataInitializer(metaEd);
      propertyCollectingEnhancer(metaEd);
      apiPropertyMappingEnhancer(metaEd);

      // Run the table structure analyzer
      const result = tableStructureAnalyzer(metaEd);

      expect(result.success).toBe(true);
      expect(result.enhancerName).toBe('TableStructureAnalyzerEnhancer');

      // Check that the table structure was analyzed
      const student = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Student');
      const apiSchemaData = student?.data.edfiApiSchema as EntityApiSchemaData;

      // Basic entity should not have special flags
      expect(apiSchemaData.flatteningMetadata?.table.isExtensionTable).toBeUndefined();
      expect(apiSchemaData.flatteningMetadata?.table.discriminatorValue).toBeUndefined();
    });
  });
});
