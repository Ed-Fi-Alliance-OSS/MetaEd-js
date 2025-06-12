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
  DomainEntityBuilder,
  DescriptorBuilder,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, descriptorReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
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
import { enhance as identityJsonPathsEnhancer } from '../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance } from '../../src/diminisher/StudentAssessmentHardcodedSecurityDiminisher';

function runEnhancers(metaEd: MetaEdEnvironment) {
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

describe('when diminishing StudentAssessment', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '4.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withDescriptorIdentity('SchoolType', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('SchoolType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDomainEntity('StudentAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'Reported')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should have ReportedSchool security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessment');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.reportedSchoolReference.schoolId",
          "metaEdName": "ReportedSchool",
        },
      ]
    `);
  });
});

describe('when diminishing StudentAssessment with missing resource', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withDescriptorIdentity('SchoolType', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('SchoolType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
  });

  it('should throw error', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `StudentAssessmentHardcodedSecurityDiminisher: Fatal Error: 'StudentAssessment' not found in EdFi Data Standard 8.0`,
    );
  });
});

describe('when diminishing StudentAssessment with invalid json path', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withDescriptorIdentity('SchoolType', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('SchoolType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDomainEntity('StudentAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', '')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
  });

  it('should throw error', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `StudentAssessmentHardcodedSecurityDiminisher: Fatal Error: EdFi Data Standard 8.0 has removed ReportedSchool resource from 'StudentAssessment'`,
    );
  });
});

describe('when diminishing StudentAssessment with missing property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('ParentSchoolId', 'doc', '30')
      .withDescriptorIdentity('SchoolType', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('SchoolType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDomainEntity('StudentAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'Reported')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
  });

  it('should throw error', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `StudentAssessmentHardcodedSecurityDiminisher: Fatal Error: EdFi Data Standard 8.0 has removed ReportedSchoolId property from 'StudentAssessment'`,
    );
  });
});
