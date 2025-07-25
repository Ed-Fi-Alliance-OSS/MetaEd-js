// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  MetaEdTextBuilder,
  newPluginEnvironment,
  Namespace,
} from '@edfi/metaed-core';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance as namespaceDomainEnhancer } from '../../src/enhancer/NamespaceDomainEnhancer';
import { NamespaceEdfiApiSchema } from '../../src/model/Namespace';

describe('when namespace contains multiple domains', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domain1Name = 'StudentEnrollment';
  const domain2Name = 'StudentAcademicRecord';
  const domain3Name = 'TeacherPreparation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomain(domain1Name)
      .withDocumentation('Student Enrollment domain')
      .withEndDomain()

      .withStartDomain(domain2Name)
      .withDocumentation('Student Academic Record domain')
      .withEndDomain()

      .withStartDomain(domain3Name)
      .withDocumentation('Teacher Preparation domain')
      .withEndDomain()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    namespaceSetupEnhancer(metaEd);
    namespaceDomainEnhancer(metaEd);
  });

  it('should collect all domain names into namespace data', () => {
    const namespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    expect(namespace).toBeDefined();

    const namespaceApiSchemaData: NamespaceEdfiApiSchema = namespace!.data.edfiApiSchema as NamespaceEdfiApiSchema;
    expect(namespaceApiSchemaData.domains).toBeDefined();
    expect(namespaceApiSchemaData.domains).toHaveLength(3);
    expect(namespaceApiSchemaData.domains).toContain(domain1Name);
    expect(namespaceApiSchemaData.domains).toContain(domain2Name);
    expect(namespaceApiSchemaData.domains).toContain(domain3Name);
  });
});

describe('when namespace contains no domains', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'Empty';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      // Add a simple entity to ensure namespace is created
      .withStartDomainEntity('TestEntity')
      .withDocumentation('Test entity')
      .withStringIdentity('TestId', 'Test identifier', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespaceSetupEnhancer(metaEd);
    namespaceDomainEnhancer(metaEd);
  });

  it('should have empty domains array', () => {
    const namespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    expect(namespace).toBeDefined();

    const namespaceApiSchemaData: NamespaceEdfiApiSchema = namespace!.data.edfiApiSchema as NamespaceEdfiApiSchema;
    expect(namespaceApiSchemaData.domains).toBeDefined();
    expect(namespaceApiSchemaData.domains).toHaveLength(0);
  });
});

describe('when multiple namespaces each contain domains', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespace1Name = 'EdFi';
  const namespace2Name = 'Extension';
  const domain1Name = 'CoreDomain';
  const domain2Name = 'ExtensionDomain';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace1Name)
      .withStartDomain(domain1Name)
      .withDocumentation('Core domain')
      .withEndDomain()
      .withEndNamespace()

      .withBeginNamespace(namespace2Name)
      .withStartDomain(domain2Name)
      .withDocumentation('Extension domain')
      .withEndDomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    namespaceSetupEnhancer(metaEd);
    namespaceDomainEnhancer(metaEd);
  });

  it('should collect domains for each namespace separately', () => {
    const namespace1: Namespace | undefined = metaEd.namespace.get(namespace1Name);
    const namespace2: Namespace | undefined = metaEd.namespace.get(namespace2Name);

    expect(namespace1).toBeDefined();
    expect(namespace2).toBeDefined();

    const namespace1ApiSchemaData: NamespaceEdfiApiSchema = namespace1!.data.edfiApiSchema as NamespaceEdfiApiSchema;
    const namespace2ApiSchemaData: NamespaceEdfiApiSchema = namespace2!.data.edfiApiSchema as NamespaceEdfiApiSchema;

    expect(namespace1ApiSchemaData.domains).toEqual([domain1Name]);
    expect(namespace2ApiSchemaData.domains).toEqual([domain2Name]);
  });
});
