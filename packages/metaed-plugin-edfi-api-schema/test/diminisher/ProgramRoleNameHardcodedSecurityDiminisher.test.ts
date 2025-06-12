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
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance } from '../../src/diminisher/ProgramRoleNameHardcodedSecurityDiminisher';

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
  enhance(metaEd);
}

describe('when diminishing a Program role entity hierarchy', (): void => {
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
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('ProgramEvaluation entity should have EducationOrganization security elements', () => {
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

  it('ProgramEvaluationElement entity should have EducationOrganization security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ProgramEvaluationElement');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.programEvaluationReference.programEducationOrganizationId",
          "metaEdName": "ProgramEvaluation",
        },
      ]
    `);
  });

  it('ProgramEvaluationObjective entity should have EducationOrganization security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ProgramEvaluationObjective');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.programEvaluationReference.programEducationOrganizationId",
          "metaEdName": "ProgramEvaluation",
        },
      ]
    `);
  });

  it('EvaluationRubricDimension entity should have EducationOrganization security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('EvaluationRubricDimension');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
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

describe('when diminishing a Program role entity hierarchy with missing ProgramEvaluation resource', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
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

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
  });

  it('should throw error', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `ProgramRoleNameHardcodedSecurityDiminisher: Fatal Error: 'ProgramEvaluation' not found in EdFi Data Standard 8.0`,
    );
  });
});

describe('when diminishing a Program role entity hierarchy with missing ProgramEvaluationElement resource', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
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
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
  });

  it('should throw error', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `ProgramRoleNameHardcodedSecurityDiminisher: Fatal Error: 'ProgramEvaluationElement' not found in EdFi Data Standard 8.0`,
    );
  });
});

describe('when diminishing a Program role entity hierarchy with missing ProgramEvaluationObjective resource', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
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

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
  });

  it('should throw error', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `ProgramRoleNameHardcodedSecurityDiminisher: Fatal Error: 'ProgramEvaluationObjective' not found in EdFi Data Standard 8.0`,
    );
  });
});

describe('when diminishing a Program role entity hierarchy with missing EvaluationRubricDimension resource', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
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

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
  });

  it('should throw error', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `ProgramRoleNameHardcodedSecurityDiminisher: Fatal Error: 'EvaluationRubricDimension' not found in EdFi Data Standard 8.0`,
    );
  });
});

describe('when diminishing a Program role entity hierarchy without a valid criteria to get hardcoded securable element', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
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
      .withIdentityRenameProperty('string', 'EdorgId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
  });

  it('should throw error', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `ProgramRoleNameHardcodedSecurityDiminisher: Fatal Error: No securable paths found for entity 'ProgramEvaluation'`,
    );
  });
});
