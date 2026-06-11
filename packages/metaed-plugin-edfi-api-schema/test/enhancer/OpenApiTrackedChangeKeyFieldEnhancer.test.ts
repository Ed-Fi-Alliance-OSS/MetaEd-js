// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntityBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  Namespace,
  NamespaceBuilder,
  TopLevelEntity,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  enumerationReferenceEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from '../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance } from '../../src/enhancer/OpenApiTrackedChangeKeyFieldEnhancer';
import { createTrackedChangeSchemasFrom } from '../../src/enhancer/OpenApiChangeQuerySchemaBuilder';
import type { EntityApiSchemaData } from '../../src/model/EntityApiSchemaData';
import type { TrackedChangeKeyField } from '../../src/model/TrackedChangeKeyField';

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
      enhance(metaEd);
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
});
