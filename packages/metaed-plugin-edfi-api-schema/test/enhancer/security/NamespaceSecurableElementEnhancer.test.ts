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
  SharedStringBuilder,
  DescriptorBuilder,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, stringReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { sharedStringPropertyEnhancer } from '@edfi/metaed-plugin-edfi-unified';
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
import { enhance } from '../../../src/enhancer/security/NamespaceSecurableElementEnhancer';

function runEnhancers(metaEd: MetaEdEnvironment) {
  domainEntityReferenceEnhancer(metaEd);
  sharedStringPropertyEnhancer(metaEd);
  stringReferenceEnhancer(metaEd);

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
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have simple namespace security element', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.descriptor.get(descriptorName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$.namespace",
      ]
    `);
  });
});

describe('when building domain entity without any namespace properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have empty namespace security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity without any namespace properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have empty namespace security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with SharedString identity but not URI', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartSharedString('NotURI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withSharedStringIdentity('NotURI', null, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have empty namespace security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with SharedString identity referencing URI but not named Namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withSharedStringIdentity('URI', 'NotNamespace', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have empty namespace security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with SharedString referencing URI named Namespace but not an identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withSharedStringProperty('URI', 'Namespace', 'doc', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have empty namespace security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with required SharedString referencing URI named Namespace but not an identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withSharedStringProperty('URI', 'Namespace', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have simple namespace security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$.namespace",
      ]
    `);
  });
});

describe('when building domain entity with SharedString identity referencing URI named Namespace but role named', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withSharedStringIdentity('URI', 'Namespace', 'doc', 'RoleNamed')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have empty namespace security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with SharedString identity referencing URI named Namespace not role named', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withSharedStringIdentity('URI', 'Namespace', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have simple namespace security element', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$.namespace",
      ]
    `);
  });
});

describe('when building domain entity referencing another with proper Namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const referencingDomainEntityName = 'ReferencingDomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withSharedStringIdentity('URI', 'Namespace', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(referencingDomainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withDomainEntityProperty(domainEntityName, 'doc', false, false)
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have namespace security element on referencing entity', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(referencingDomainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$.domainEntityNameReference.namespace",
      ]
    `);
  });
});

describe('when building domain entity referencing another with role named Namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const referencingDomainEntityName = 'ReferencingDomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withSharedStringIdentity('URI', 'Namespace', 'doc', 'RoleNamed')
      .withEndDomainEntity()

      .withStartDomainEntity(referencingDomainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withDomainEntityProperty(domainEntityName, 'doc', false, false)
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should not have namespace security element on referencing entity', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(referencingDomainEntityName);
    const identityJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurableElements;
    expect(identityJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});
