// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newPluginEnvironment,
  DomainEntitySubclassBuilder,
  DescriptorBuilder,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, domainEntitySubclassBaseClassEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../../src/model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as resourceNameEnhancer } from '../../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance } from '../../../src/enhancer/security/EducationOrganizationSecurableElementEnhancer';

function runEnhancers(metaEd: MetaEdEnvironment) {
  domainEntityReferenceEnhancer(metaEd);
  domainEntitySubclassBaseClassEnhancer(metaEd);

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
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  enhance(metaEd);
}

describe('when building descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const descriptorName = 'DescriptorName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have no EducationOrganization security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.descriptor.get(descriptorName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity without any EducationOrganization properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have empty EducationOrganization security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with EducationOrganization property as identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have EducationOrganization security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.educationOrganizationReference.educationOrganizationId",
          "metaEdName": "EducationOrganization",
        },
      ]
    `);
  });
});

describe('when building domain entity with School property as identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have EducationOrganization security element on School', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntitySubclass.get('School');
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.schoolId",
          "metaEdName": "SchoolId",
        },
      ]
    `);
  });

  it('should have EducationOrganization security element on DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.schoolReference.schoolId",
          "metaEdName": "School",
        },
      ]
    `);
  });
});

describe('when building domain entity with rolenamed School property as identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'RoleName')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should not have EducationOrganization security elements on DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with School property not as identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('Identity', 'doc')
      .withDomainEntityProperty('School', 'doc', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should not have EducationOrganization security elements on DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity in extension namespace with EducationOrganization subclass identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withEndNamespace()
      .withBeginNamespace(namespaceName, namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDomainEntityIdentity('EdFi.School', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const extensionNamespace: any = metaEd.namespace.get(namespaceName);
    extensionNamespace.dependencies = [metaEd.namespace.get('EdFi')];

    runEnhancers(metaEd);
  });

  it('should have EducationOrganization security element', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.schoolReference.schoolId",
          "metaEdName": "School",
        },
      ]
    `);
  });
});

describe('when building domain entity in extension namespace with EducationOrganization subclass non-identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withEndNamespace()
      .withBeginNamespace(namespaceName, namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanIdentity('Unused', 'doc')
      .withDomainEntityProperty('EdFi.School', 'doc', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const extensionNamespace: any = metaEd.namespace.get(namespaceName);
    extensionNamespace.dependencies = [metaEd.namespace.get('EdFi')];

    runEnhancers(metaEd);
  });

  it('should have EducationOrganization security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});
