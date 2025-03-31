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
import { enhance } from '../../../src/enhancer/security/StudentAuthorizationSecurableEnhancer';
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

describe('when building domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Student')
      .withStringIdentity('StudentUniqueId', 'doc', '50', 'string', 'required')
      .withEndAbstractEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should have no studentAuthorizationSecurablePaths', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const { studentAuthorizationSecurablePaths } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(studentAuthorizationSecurablePaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with Student identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should have simple studentAuthorizationSecurablePaths', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const { studentAuthorizationSecurablePaths } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(studentAuthorizationSecurablePaths).toMatchInlineSnapshot(`
      Array [
        "$.studentReference.studentUniqueId",
      ]
    `);
  });
});

describe('when building domain entity with Student not part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withDomainEntityProperty('Student', 'doc', false, false)
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should have no studentAuthorizationSecurablePaths', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const { studentAuthorizationSecurablePaths } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(studentAuthorizationSecurablePaths).toMatchInlineSnapshot(`Array []`);
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
      .withDomainEntityIdentity('StudentAcademicRecord', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentAcademicRecord')
      .withDocumentation('doc')
      .withStringIdentity('Description', 'doc', '30')
      .withDomainEntityIdentity('Student', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should be correct studentAuthorizationSecurablePaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const { studentAuthorizationSecurablePaths } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(studentAuthorizationSecurablePaths).toMatchInlineSnapshot(`
      Array [
        "$.studentAcademicRecordReference.studentUniqueId",
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
      .withDomainEntityIdentity('StudentAcademicRecord', 'doc')
      .withDomainEntityIdentity('StudentOtherAcademicRecord', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentAcademicRecord')
      .withDocumentation('doc')
      .withStringIdentity('Description', 'doc', '30')
      .withDomainEntityIdentity('Student', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentOtherAcademicRecord')
      .withDocumentation('doc')
      .withStringIdentity('Description', 'doc', '30')
      .withDomainEntityIdentity('Student', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should be two studentAuthorizationSecurablePaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const { studentAuthorizationSecurablePaths } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(studentAuthorizationSecurablePaths).toMatchInlineSnapshot(`
      Array [
        "$.studentAcademicRecordReference.studentUniqueId",
        "$.studentOtherAcademicRecordReference.studentUniqueId",
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
      .withDomainEntityProperty('Student', 'doc', false, false, false, 'Mandating')
      .withEndCommon()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentUniqueId', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runEnhancers(metaEd);
  });

  it('should be empty studentAuthorizationSecurablePaths for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const { studentAuthorizationSecurablePaths } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(studentAuthorizationSecurablePaths).toMatchInlineSnapshot(`Array []`);
  });
});
