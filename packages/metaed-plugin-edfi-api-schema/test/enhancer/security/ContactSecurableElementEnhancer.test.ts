// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  CommonBuilder,
  DomainEntityBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, commonReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance } from '../../../src/enhancer/security/ContactSecurableElementEnhancer';
import { EntityApiSchemaData } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../../src/model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';

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
  jsonSchemaForInsertEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  enhance(metaEd);
}

describe('when building Contact domain entity and unrelated DisciplineAction', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Contact')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Contact')
      .withEndDomainEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withIntegerIdentity('NotContact', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should have contactSecurableElements for Contact', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Contact');
    const { contactSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(contactSecurableElements).toMatchInlineSnapshot(`
      Array [
        "$.contactUniqueId",
      ]
    `);
  });

  it('should have no contactSecurableElements for DisciplineAction', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const { contactSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(contactSecurableElements).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with Contact identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Contact')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Contact')
      .withEndDomainEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withDomainEntityIdentity('Contact', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should have simple contactSecurableElements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const { contactSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(contactSecurableElements).toMatchInlineSnapshot(`
      Array [
        "$.contactReference.contactUniqueId",
      ]
    `);
  });
});

describe('when building domain entity with Contact not part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Contact')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Contact')
      .withEndDomainEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withDomainEntityProperty('Contact', 'doc', false, false)
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should have no contactSecurableElements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const { contactSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(contactSecurableElements).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building a domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'CourseTranscript';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('ContactAcademicRecord', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ContactAcademicRecord')
      .withDocumentation('doc')
      .withStringIdentity('Description', 'doc', '30')
      .withDomainEntityIdentity('Contact', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Contact')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Contact')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should be correct contactSecurableElements for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const { contactSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(contactSecurableElements).toMatchInlineSnapshot(`
      Array [
        "$.contactAcademicRecordReference.contactUniqueId",
      ]
    `);
  });
});

describe('when building a domain entity referencing two referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'CourseTranscript';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('ContactAcademicRecord', 'doc')
      .withDomainEntityIdentity('ContactOtherAcademicRecord', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ContactAcademicRecord')
      .withDocumentation('doc')
      .withStringIdentity('Description', 'doc', '30')
      .withDomainEntityIdentity('Contact', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ContactOtherAcademicRecord')
      .withDocumentation('doc')
      .withStringIdentity('Description', 'doc', '30')
      .withDomainEntityIdentity('Contact', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Contact')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Contact')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should be two contactSecurableElements for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const { contactSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(contactSecurableElements).toMatchInlineSnapshot(`
      Array [
        "$.contactAcademicRecordReference.contactUniqueId",
        "$.contactOtherAcademicRecordReference.contactUniqueId",
      ]
    `);
  });
});

describe('when building domain entity with a common with a domain entity reference with a role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('ContentStandard', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('ContentStandard')
      .withDocumentation('doc')
      .withStringProperty('Title', 'doc', false, false, '30')
      .withDomainEntityProperty('Contact', 'doc', false, false, false, 'Mandating')
      .withEndCommon()

      .withStartDomainEntity('Contact')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Contact')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should be empty contactSecurableElements for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const { contactSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(contactSecurableElements).toMatchInlineSnapshot(`Array []`);
  });
});
