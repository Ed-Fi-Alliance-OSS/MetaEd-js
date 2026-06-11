// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DescriptorBuilder,
  DomainEntityBuilder,
  EnumerationBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  Namespace,
  NamespaceBuilder,
  TopLevelEntity,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  enumerationReferenceEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from '../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as queryFieldMappingEnhancer } from '../../src/enhancer/QueryFieldMappingEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as openApiTrackedChangeKeyFieldEnhancer } from '../../src/enhancer/OpenApiTrackedChangeKeyFieldEnhancer';
import {
  createTrackedChangeSchemasFrom,
  trackedChangeSchemaNamesFor,
} from '../../src/enhancer/OpenApiChangeQuerySchemaBuilder';
import type { EntityApiSchemaData } from '../../src/model/EntityApiSchemaData';
import type { SchemaObject, Schemas } from '../../src/model/OpenApiTypes';
import type { TrackedChangeKeyField } from '../../src/model/TrackedChangeKeyField';
import { metaEdPluginEnhancers } from '../integration/PluginHelper';

/**
 * Runs the enhancers required before tracked-change key fields can be derived.
 */
function runPrerequisiteEnhancers(metaEd: MetaEdEnvironment): void {
  domainEntityReferenceEnhancer(metaEd);
  enumerationReferenceEnhancer(metaEd);
  mergeDirectiveEnhancer(metaEd);
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
}

/**
 * Runs the enhancers needed to compare tracked-change key fields to query field mapping.
 */
function runInvariantEnhancers(metaEd: MetaEdEnvironment): void {
  metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
  namespaceSetupEnhancer(metaEd);
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  subclassPropertyNamingCollisionEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);
  mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
  openApiTrackedChangeKeyFieldEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  jsonSchemaForInsertEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  queryFieldMappingEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
}

/**
 * Returns the public tracked-change key field names from entity data.
 */
function trackedChangeKeyFieldNamesFrom(entity: TopLevelEntity): string[] {
  const entityApiSchemaData: EntityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return entityApiSchemaData.trackedChangeKeyFields.map(
    (trackedChangeKeyField: TrackedChangeKeyField) => trackedChangeKeyField.fieldName,
  );
}

/**
 * Returns whether the entity query field mapping contains a public query field.
 */
function queryFieldMappingHasField(entity: TopLevelEntity, fieldName: string): boolean {
  const entityApiSchemaData: EntityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return entityApiSchemaData.queryFieldMapping[fieldName] != null;
}

/**
 * Expects tracked-change key fields to use the same public names as identity query fields.
 */
function expectTrackedChangeKeyFieldsToMatchQueryFieldMapping(entity: TopLevelEntity, expectedFieldNames: string[]): void {
  expectedFieldNames.forEach((fieldName: string) => {
    expect(queryFieldMappingHasField(entity, fieldName)).toBe(true);
  });

  expect(trackedChangeKeyFieldNamesFrom(entity)).toEqual(expectedFieldNames);
}

/**
 * Expects descriptor tracked-change schema keys to use public descriptor query field names.
 */
function expectTrackedChangeSchemaFieldsToMatchQueryFieldMapping(
  entity: TopLevelEntity,
  expectedFieldNames: string[],
): void {
  expectedFieldNames.forEach((fieldName: string) => {
    expect(queryFieldMappingHasField(entity, fieldName)).toBe(true);
  });

  const trackedChangeSchemas: Schemas = createTrackedChangeSchemasFrom(entity);
  const keySchemaName: string = trackedChangeSchemaNamesFor(entity).keyValues;
  const keySchema: SchemaObject = trackedChangeSchemas[keySchemaName] as SchemaObject;

  expect(Object.keys(keySchema.properties ?? {})).toEqual(expectedFieldNames);
  expect(keySchema.required).toEqual(expectedFieldNames);
}

describe('OpenApiTrackedChangeKeyFieldEnhancer', () => {
  describe('when CourseOffering has a merged School identity through Session', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespaceName = 'EdFi';
    let namespace: Namespace;

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity('CourseOffering')
        .withDocumentation('doc')
        .withStringIdentity('LocalCourseCode', 'doc', '30')
        .withDomainEntityIdentity('School', 'doc')
        .withDomainEntityIdentity('Session', 'doc')
        .withMergeDirective('School', 'Session.School')
        .withEndDomainEntity()

        .withStartDomainEntity('Session')
        .withDocumentation('doc')
        .withStringIdentity('SessionName', 'doc', '30')
        .withEnumerationIdentity('SchoolYear', 'doc')
        .withDomainEntityIdentity('School', 'doc')
        .withEndDomainEntity()

        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withIntegerIdentity('SchoolId', 'doc')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      namespace = metaEd.namespace.get(namespaceName) as Namespace;

      runPrerequisiteEnhancers(metaEd);
      openApiTrackedChangeKeyFieldEnhancer(metaEd);
    });

    it('should derive public tracked-change key fields from merge-aware identity metadata', () => {
      const entity = namespace.entity.domainEntity.get('CourseOffering') as TopLevelEntity;
      const { trackedChangeKeyFields } = entity.data.edfiApiSchema as EntityApiSchemaData;

      expect(trackedChangeKeyFields.map((field: TrackedChangeKeyField) => field.fieldName)).toMatchInlineSnapshot(`
        Array [
          "localCourseCode",
          "schoolId",
          "schoolYear",
          "sessionName",
        ]
      `);
    });

    it('should create tracked-change key schemas from the derived public key fields', () => {
      const entity = namespace.entity.domainEntity.get('CourseOffering') as TopLevelEntity;

      expect(createTrackedChangeSchemasFrom(entity).EdFi_CourseOffering_TrackedChangeKey).toMatchInlineSnapshot(`
        Object {
          "properties": Object {
            "localCourseCode": Object {
              "maxLength": 30,
              "type": "string",
            },
            "schoolId": Object {
              "format": "int32",
              "type": "integer",
            },
            "schoolYear": Object {
              "format": "int32",
              "type": "integer",
            },
            "sessionName": Object {
              "maxLength": 30,
              "type": "string",
            },
          },
          "required": Array [
            "localCourseCode",
            "schoolId",
            "schoolYear",
            "sessionName",
          ],
          "type": "object",
        }
      `);
    });
  });

  describe('when non-merged-away identity fields produce the same public key field name', () => {
    it('should fail rather than silently choosing one source property', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      const namespaceName = 'EdFi';

      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
        .withEndDomainEntity()

        .withStartDomainEntity('Grade')
        .withDocumentation('doc')
        .withDomainEntityIdentity('Student', 'doc')
        .withIntegerIdentity('StudentUniqueId', 'doc')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      runPrerequisiteEnhancers(metaEd);

      expect(() => openApiTrackedChangeKeyFieldEnhancer(metaEd)).toThrow(
        'Tracked-change key field name collision for EdFi.Grade: studentUniqueId is produced by multiple non-merged-away identity properties with different schemas.',
      );
    });
  });

  describe('when comparing tracked-change key fields to query field mapping', () => {
    it('should keep merge-aware identity names aligned', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
      const namespaceName = 'EdFi';

      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity('CourseOffering')
        .withDocumentation('doc')
        .withStringIdentity('LocalCourseCode', 'doc', '30')
        .withDomainEntityIdentity('School', 'doc')
        .withDomainEntityIdentity('Session', 'doc')
        .withMergeDirective('School', 'Session.School')
        .withEndDomainEntity()

        .withStartDomainEntity('Session')
        .withDocumentation('doc')
        .withStringIdentity('SessionName', 'doc', '30')
        .withEnumerationIdentity('SchoolYear', 'doc')
        .withDomainEntityIdentity('School', 'doc')
        .withEndDomainEntity()

        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withIntegerIdentity('SchoolId', 'doc')
        .withEndDomainEntity()

        .withStartEnumeration('SchoolYear')
        .withDocumentation('doc')
        .withEnumerationItem('2022')
        .withEndEnumeration()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new EnumerationBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      enumerationReferenceEnhancer(metaEd);
      mergeDirectiveEnhancer(metaEd);
      runInvariantEnhancers(metaEd);

      const namespace: Namespace = metaEd.namespace.get(namespaceName) as Namespace;
      const entity: TopLevelEntity = namespace.entity.domainEntity.get('CourseOffering') as TopLevelEntity;

      expectTrackedChangeKeyFieldsToMatchQueryFieldMapping(entity, [
        'localCourseCode',
        'schoolId',
        'schoolYear',
        'sessionName',
      ]);
    });

    it('should keep USI to UniqueId identity names aligned', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
      const namespaceName = 'EdFi';

      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
        .withEndDomainEntity()

        .withStartDomainEntity('Grade')
        .withDocumentation('doc')
        .withDomainEntityIdentity('Student', 'doc')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      runInvariantEnhancers(metaEd);

      const namespace: Namespace = metaEd.namespace.get(namespaceName) as Namespace;
      const entity: TopLevelEntity = namespace.entity.domainEntity.get('Grade') as TopLevelEntity;

      expectTrackedChangeKeyFieldsToMatchQueryFieldMapping(entity, ['studentUniqueId']);
    });

    it('should keep role-name-prefixed identity names aligned', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
      const namespaceName = 'EdFi';

      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
        .withEndDomainEntity()

        .withStartDomainEntity('Grade')
        .withDocumentation('doc')
        .withDomainEntityIdentity('Student', 'doc')
        .withDomainEntityIdentity('Student', 'doc', 'Tutoring')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      runInvariantEnhancers(metaEd);

      const namespace: Namespace = metaEd.namespace.get(namespaceName) as Namespace;
      const entity: TopLevelEntity = namespace.entity.domainEntity.get('Grade') as TopLevelEntity;

      expectTrackedChangeKeyFieldsToMatchQueryFieldMapping(entity, ['studentUniqueId', 'tutoringStudentUniqueId']);
    });

    it('should keep descriptor identity schema names aligned', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
      const namespaceName = 'EdFi';

      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDescriptor('GradeLevel')
        .withDocumentation('doc')
        .withEndDescriptor()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DescriptorBuilder(metaEd, []));

      runInvariantEnhancers(metaEd);

      const namespace: Namespace = metaEd.namespace.get(namespaceName) as Namespace;
      const entity: TopLevelEntity = namespace.entity.descriptor.get('GradeLevel') as TopLevelEntity;

      expectTrackedChangeSchemaFieldsToMatchQueryFieldMapping(entity, ['namespace', 'codeValue']);
    });

    it('should keep SchoolYearType identity names aligned', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
      const namespaceName = 'EdFi';

      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartEnumeration('SchoolYear')
        .withDocumentation('doc')
        .withEnumerationItem('2022')
        .withEndEnumeration()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new EnumerationBuilder(metaEd, []));

      runInvariantEnhancers(metaEd);

      const namespace: Namespace = metaEd.namespace.get(namespaceName) as Namespace;
      const entity: TopLevelEntity = namespace.entity.schoolYearEnumeration.get('SchoolYear') as TopLevelEntity;

      expectTrackedChangeKeyFieldsToMatchQueryFieldMapping(entity, ['schoolYear']);
    });
  });
});
