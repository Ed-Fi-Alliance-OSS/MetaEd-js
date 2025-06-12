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
import { enhance as educationOrganizationSecurableElementEnhancer } from '../../src/enhancer/security/EducationOrganizationSecurableElementEnhancer';
import { enhance } from '../../src/diminisher/OrganizationDepartmentHardcodedSecurityDiminisher';

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
  educationOrganizationSecurableElementEnhancer(metaEd);
  enhance(metaEd);
}

describe('when diminishing OrganizationDepartment', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '3.3.0-a';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('OrganizationDepartment', 'EducationOrganizationId')
      .withDocumentation('doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc', 'Parent')
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

  it('should have ParentEducationOrganization security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntitySubclass.get('OrganizationDepartment');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.parentEducationOrganizationReference.educationOrganizationId",
          "metaEdName": "ParentEducationOrganization",
        },
      ]
    `);
  });
});

describe('when diminishing OrganizationDepartment with missing resource', (): void => {
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
      `OrganizationDepartmentHardcodedSecurityDiminisher: Fatal Error: 'OrganizationDepartment' not found in EdFi Data Standard 8.0`,
    );
  });
});

describe('when diminishing OrganizationDepartment with invalid json path', (): void => {
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

      .withStartDomainEntitySubclass('OrganizationDepartment', 'EducationOrganizationId')
      .withDocumentation('doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc', '')
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
      `OrganizationDepartmentHardcodedSecurityDiminisher: Fatal Error: EdFi Data Standard 8.0 has removed ParentEducationOrganization resource from 'OrganizationDepartment'`,
    );
  });
});

describe('when diminishing OrganizationDepartment with missing property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '8.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('ParentEdOrgId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('OrganizationDepartment', 'EducationOrganizationId')
      .withDocumentation('doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc', 'Parent')
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
      `OrganizationDepartmentHardcodedSecurityDiminisher: Fatal Error: EdFi Data Standard 8.0 has removed ParentEducationOrganizationId property from 'OrganizationDepartment'`,
    );
  });
});
