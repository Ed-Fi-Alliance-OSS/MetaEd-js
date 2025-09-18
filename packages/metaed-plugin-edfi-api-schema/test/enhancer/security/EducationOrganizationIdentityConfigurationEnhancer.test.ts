// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  newPluginEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntitySubclassBuilder,
  DomainEntityBuilder,
} from '@edfi/metaed-core';
import {
  associationReferenceEnhancer,
  domainEntityReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../../src/model/Namespace';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as resourceNameEnhancer } from '../../../src/enhancer/ResourceNameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance } from '../../../src/enhancer/security/EducationOrganizationIdentityConfigurationEnhancer';

function runEnhancers(metaEd: MetaEdEnvironment) {
  domainEntityReferenceEnhancer(metaEd);
  domainEntitySubclassBaseClassEnhancer(metaEd);
  associationReferenceEnhancer(metaEd);

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
  allJsonPathsMappingEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  enhance(metaEd);
}

describe('when processing Program role configuration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '5.0.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntity('Program')
      .withDocumentation('doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ProgramEvaluation')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Program', 'doc', 'Program')
      .withEndDomainEntity()

      .withStartDomainEntity('ProgramEvaluationElement')
      .withDocumentation('doc')
      .withDomainEntityIdentity('ProgramEvaluation', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ProgramEvaluationObjective')
      .withDocumentation('doc')
      .withDomainEntityIdentity('ProgramEvaluation', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('EvaluationRubricDimension')
      .withDocumentation('doc')
      .withDomainEntityIdentity('ProgramEvaluationElement', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    // Inject configuration for all Program-related entities
    const programEntities = [
      'ProgramEvaluation',
      'ProgramEvaluationElement',
      'ProgramEvaluationObjective',
      'EvaluationRubricDimension',
    ];
    programEntities.forEach((entityName) => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(entityName);
      if (entity) {
        entity.config = {
          edfiApiSchema: {
            versionRange: '>=5.0.0',
            roleName: 'Program',
            description: 'Discovers all identity properties with Program role that reference education organizations',
          },
        };
      }
    });

    runEnhancers(metaEd);
  });

  it('should discover Program role security elements for ProgramEvaluation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ProgramEvaluation');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.programReference.educationOrganizationId",
          "metaEdName": "Program",
        },
      ]
    `);
  });

  it('should discover Program role security elements for ProgramEvaluationElement', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ProgramEvaluationElement');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    // ProgramEvaluationElement references ProgramEvaluation which has Program role
    // So it should inherit that security element
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.programEvaluationReference.programEducationOrganizationId",
          "metaEdName": "ProgramEvaluation",
        },
      ]
    `);
  });

  it('should discover Program role security elements for ProgramEvaluationObjective', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ProgramEvaluationObjective');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    // ProgramEvaluationObjective references ProgramEvaluation which has Program role
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.programEvaluationReference.programEducationOrganizationId",
          "metaEdName": "ProgramEvaluation",
        },
      ]
    `);
  });

  it('should discover Program role security elements for EvaluationRubricDimension', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('EvaluationRubricDimension');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    // EvaluationRubricDimension references ProgramEvaluationElement which references ProgramEvaluation
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.programEvaluationElementReference.programEducationOrganizationId",
          "metaEdName": "ProgramEvaluationElement",
        },
      ]
    `);
  });
});

describe('when processing identity configuration with version constraint', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '4.0.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntity('Program')
      .withDocumentation('doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ProgramEvaluation')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Program', 'doc', 'Program')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    // Inject configuration with version constraint that doesn't match
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ProgramEvaluation');
    if (entity) {
      entity.config = {
        edfiApiSchema: {
          versionRange: '>=5.0.0',
          roleName: 'Program',
          description: 'Should not be applied due to version constraint',
        },
      };
    }

    runEnhancers(metaEd);
  });

  it('should not add security elements due to version constraint', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ProgramEvaluation');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toHaveLength(0);
  });
});

describe('when no matching role name is found', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '5.0.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentId', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    // Inject configuration looking for NonExistent role
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessment');
    if (entity) {
      entity.config = {
        edfiApiSchema: {
          roleName: 'NonExistentRole',
          description: 'Looking for a role that does not exist',
        },
      };
    }

    runEnhancers(metaEd);
  });

  it('should not add any security elements when role is not found', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessment');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toHaveLength(0);
  });
});

describe('when EducationOrganization is not found in EdFi namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '5.0.0';
  const namespaceName = 'CustomNamespace';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('CustomEntity')
      .withDocumentation('doc')
      .withStringIdentity('CustomId', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    // Inject configuration
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('CustomEntity');
    if (entity) {
      entity.config = {
        edfiApiSchema: {
          roleName: 'Program',
          description: 'Test configuration',
        },
      };
    }

    namespaceSetupEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
  });

  it('should handle missing EdFi namespace gracefully', () => {
    const result = enhance(metaEd);
    expect(result.success).toBe(false);
  });
});

describe('when multiple entities share the same configuration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '5.0.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity('EntityA')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'MySchool')
      .withEndDomainEntity()

      .withStartDomainEntity('EntityB')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'MySchool')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    // Inject same configuration for both entities
    ['EntityA', 'EntityB'].forEach((entityName) => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(entityName);
      if (entity) {
        entity.config = {
          edfiApiSchema: {
            roleName: 'MySchool',
            description: 'Testing shared configuration',
          },
        };
      }
    });

    runEnhancers(metaEd);
  });

  it('should apply configuration to EntityA', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('EntityA');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.mySchoolSchoolReference.educationOrganizationId",
          "metaEdName": "School",
        },
      ]
    `);
  });

  it('should apply configuration to EntityB', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('EntityB');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.mySchoolSchoolReference.educationOrganizationId",
          "metaEdName": "School",
        },
      ]
    `);
  });
});
