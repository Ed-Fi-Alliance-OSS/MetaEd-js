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
} from '@edfi/metaed-core';
import {
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
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
import { enhance } from '../../src/enhancer/OpenApiReferenceComponentSubclassEnhancer';

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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_CommunityOrganization_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "communityOrganizationId": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "communityOrganizationId",
        ],
        "type": "object",
      }
    `);
  });
});
