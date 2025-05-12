// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  CommonBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntitySubclassBuilder,
  DescriptorBuilder,
  newNamespace,
} from '@edfi/metaed-core';
import {
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  domainEntityReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as openApiRequestBodyComponentEnhancer } from '../../src/enhancer/OpenApiRequestBodyComponentEnhancer';
import { enhance } from '../../src/enhancer/OpenApiRequestBodyCollectionComponentSubclassEnhancer';

describe('when building domain entity subclass with common collection and descriptor identity in superclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntitySubclassName = 'CommunityOrganization';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withCommonProperty('EducationOrganizationIdentificationCode', 'doc', false, true)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('CommunityOrganizationId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withStartCommon('EducationOrganizationIdentificationCode')
      .withDocumentation('doc')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDescriptorIdentity('EducationOrganizationIdentificationSystem', 'doc')
      .withEndCommon()

      .withStartDescriptor('EducationOrganizationIdentificationSystem')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    subclassPropertyNamingCollisionEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    subclassPropertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    subclassApiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);

    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_EducationOrganization_EducationOrganizationIdentificationCode",
          "schema": Object {
            "properties": Object {
              "educationOrganizationIdentificationSystemDescriptor": Object {
                "description": "doc",
                "type": "string",
              },
              "identificationCode": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "identificationCode",
              "educationOrganizationIdentificationSystemDescriptor",
            ],
            "type": "object",
          },
        },
      ]
    `);
  });
});

describe('when building domain entity subclass with reference collection in subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntitySubclassName = 'CommunityOrganization';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('CommunityOrganizationId', 'EducationOrganizationId', 'doc')
      .withCommonProperty('OrganizationIdentificationCode', 'doc', false, true)
      .withEndDomainEntitySubclass()

      .withStartCommon('OrganizationIdentificationCode')
      .withDocumentation('doc')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDomainEntityProperty('Organization', 'doc', true, true)
      .withEndCommon()

      .withStartDomainEntity('Organization')
      .withDocumentation('doc')
      .withIntegerIdentity('OrganizationId', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    subclassPropertyNamingCollisionEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    subclassPropertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    subclassApiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);

    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_CommunityOrganization_OrganizationIdentificationCode",
          "schema": Object {
            "properties": Object {
              "identificationCode": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
              "organizations": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_CommunityOrganization_Organization",
                },
                "minItems": 1,
                "type": "array",
                "uniqueItems": false,
              },
            },
            "required": Array [
              "identificationCode",
              "organizations",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_CommunityOrganization_Organization",
          "schema": Object {
            "properties": Object {
              "organizationReference": Object {
                "$ref": "#/components/schemas/EdFi_Organization_Reference",
              },
            },
            "required": Array [
              "organizationReference",
            ],
            "type": "object",
          },
        },
      ]
    `);
  });
});

describe('when domain entity subclass in extension has a DS common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity('GeneralStudentProgram')
      .withDocumentation('doc')
      .withIntegerIdentity('SuperclassIdentity', 'doc')
      .withEndAbstractEntity()

      .withStartCommon('Service')
      .withDocumentation('doc')
      .withIntegerIdentity('ServiceIdentity', 'doc')
      .withDateProperty('BeginDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntitySubclass('StudentArtProgram', 'EdFi.GeneralStudentProgram')
      .withDocumentation('doc')
      .withCommonProperty('EdFi.Service', 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    subclassPropertyNamingCollisionEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    subclassPropertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    subclassApiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = extensionNamespace.entity.domainEntitySubclass.get('StudentArtProgram');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "Extension_StudentArtProgram_Service",
          "schema": Object {
            "properties": Object {
              "beginDate": Object {
                "description": "doc",
                "format": "date",
                "type": "string",
              },
              "serviceIdentity": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "serviceIdentity",
            ],
            "type": "object",
          },
        },
      ]
    `);
  });
});

describe('when domain entity superclass in DS has a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity('GeneralStudentProgram')
      .withDocumentation('doc')
      .withIntegerIdentity('SuperclassIdentity', 'doc')
      .withCommonProperty('Service', 'doc', true, true)
      .withEndAbstractEntity()

      .withStartCommon('Service')
      .withDocumentation('doc')
      .withIntegerIdentity('ServiceIdentity', 'doc')
      .withDateProperty('BeginDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntitySubclass('StudentArtProgram', 'EdFi.GeneralStudentProgram')
      .withIntegerIdentity('SubclassIdentity', 'doc')
      .withDocumentation('doc')

      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    subclassPropertyNamingCollisionEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    subclassPropertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    subclassApiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have no collection schema', () => {
    const entity = extensionNamespace.entity.domainEntitySubclass.get('StudentArtProgram');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`Array []`);
  });
});
