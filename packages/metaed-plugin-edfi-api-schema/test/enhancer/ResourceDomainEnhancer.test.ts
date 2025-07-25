// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  AssociationBuilder,
  DescriptorBuilder,
  DomainBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  associationReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainBaseEntityEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as resourceDomainEnhancer } from '../../src/enhancer/ResourceDomainEnhancer';

describe('when building domain with domain entity, association, and descriptor items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainName = 'StudentAssessment';
  const domainEntityName = 'Student';
  const associationName = 'StudentAssessment';
  const descriptorName = 'AssessmentCategory';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomain(domainName)
      .withDocumentation('Student Assessment domain')
      .withDomainEntityDomainItem(domainEntityName)
      .withAssociationDomainItem(associationName)
      .withDescriptorDomainItem(descriptorName)
      .withEndDomain()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Student entity')
      .withStringIdentity('StudentUniqueId', 'Student unique identifier', '30')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Student Assessment association')
      .withAssociationDomainEntityProperty('Student', 'Student reference')
      .withAssociationDomainEntityProperty('Assessment', 'Assessment reference')
      .withEndAssociation()

      .withStartDomainEntity('Assessment')
      .withDocumentation('Assessment entity')
      .withStringIdentity('AssessmentIdentifier', 'Assessment identifier', '30')
      .withEndDomainEntity()

      .withStartDescriptor(descriptorName)
      .withDocumentation('Assessment Category descriptor')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    domainBaseEntityEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    resourceDomainEnhancer(metaEd);
  });

  it('should add domain to domain entity', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const domains = entity?.data.edfiApiSchema.domains;
    expect(domains).toEqual([domainName]);
  });

  it('should add domain to association', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.association.get(associationName);
    const domains = entity?.data.edfiApiSchema.domains;
    expect(domains).toEqual([domainName]);
  });

  it('should add domain to descriptor', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.descriptor.get(descriptorName);
    const domains = entity?.data.edfiApiSchema.domains;
    expect(domains).toEqual([domainName]);
  });

  it('should not add domain to entity not in any domain', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const domains = entity?.data.edfiApiSchema.domains;
    expect(domains).toEqual([]);
  });
});

describe('when entity belongs to multiple domains', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domain1Name = 'StudentEnrollment';
  const domain2Name = 'StudentAcademicRecord';
  const domainEntityName = 'Student';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomain(domain1Name)
      .withDocumentation('Student Enrollment domain')
      .withDomainEntityDomainItem(domainEntityName)
      .withEndDomain()

      .withStartDomain(domain2Name)
      .withDocumentation('Student Academic Record domain')
      .withDomainEntityDomainItem(domainEntityName)
      .withEndDomain()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Student entity')
      .withStringIdentity('StudentUniqueId', 'Student unique identifier', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    domainBaseEntityEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    resourceDomainEnhancer(metaEd);
  });

  it('should add both domains to the entity', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const domains = entity?.data.edfiApiSchema.domains;
    expect(domains).toContain(domain1Name);
    expect(domains).toContain(domain2Name);
    expect(domains).toHaveLength(2);
  });
});

describe('when domain references entity from different namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const coreNamespaceName = 'EdFi';
  const extensionNamespaceName = 'Extension';
  const domainName = 'ExtensionDomain';
  const domainEntityName = 'Student';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Student entity')
      .withStringIdentity('StudentUniqueId', 'Student unique identifier', '30')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartDomain(domainName)
      .withDocumentation('Extension domain')
      .withDomainEntityDomainItem(`${coreNamespaceName}.${domainEntityName}`)
      .withEndDomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(coreNamespaceName);
    const extensionNamespace = metaEd.namespace.get(extensionNamespaceName);
    if (coreNamespace && extensionNamespace) {
      extensionNamespace.dependencies = [coreNamespace];
    }

    domainEntityReferenceEnhancer(metaEd);
    domainBaseEntityEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    resourceDomainEnhancer(metaEd);
  });

  it('should add extension domain to core entity', () => {
    const entity = metaEd.namespace.get(coreNamespaceName)?.entity.domainEntity.get(domainEntityName);
    const domains = entity?.data.edfiApiSchema.domains;
    expect(domains).toEqual([domainName]);
  });
});

describe('when subdomain contains entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainName = 'TeacherPreparation';
  const subdomainName = 'Credentials';
  const domainEntityName = 'Credential';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomain(domainName)
      .withDocumentation('Teacher Preparation domain')
      .withEndDomain()

      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('Credentials subdomain')
      .withDomainEntityDomainItem(domainEntityName)
      .withEndSubdomain()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Credential entity')
      .withStringIdentity('CredentialIdentifier', 'Credential identifier', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    domainBaseEntityEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    resourceDomainEnhancer(metaEd);
  });

  it('should add subdomain name to entity', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const domains = entity?.data.edfiApiSchema.domains;
    expect(domains).toEqual([subdomainName]);
  });
});
