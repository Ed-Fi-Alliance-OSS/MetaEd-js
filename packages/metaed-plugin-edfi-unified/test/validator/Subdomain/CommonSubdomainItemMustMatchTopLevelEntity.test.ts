// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, CommonBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Subdomain/CommonSubdomainItemMustMatchTopLevelEntity';

describe('when validating common subdomain item matches top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const commonName = 'CommonName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withCommonDomainItem(commonName)
      .withEndSubdomain()

      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common subdomain item in cross-namespace scenario', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreNamespaceName = 'EdFi';
  const extensionNamespaceName = 'Extension';
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const commonName = 'CommonName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName, 'Extension')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withCommonDomainItem(`${coreNamespaceName}.${commonName}`)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(coreNamespaceName);
    const extensionNamespace = metaEd.namespace.get(extensionNamespaceName);
    if (extensionNamespace != null && coreNamespace != null) {
      extensionNamespace.dependencies.push(coreNamespace);
    }

    failures = validate(metaEd);
  });

  it('should have no validation failures for cross-namespace common reference', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating inline common in subdomain item matches', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const inlineCommonName = 'InlineCommonName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withCommonDomainItem(inlineCommonName)
      .withEndSubdomain()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndInlineCommon()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures for inline common', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common subdomain item does not match top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const commonName = 'NonExistentCommon';

  let failures: ValidationFailure[];

  beforeAll(() => {
    metaEd.dataStandardVersion = '5.0.0';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withCommonDomainItem(commonName)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('CommonSubdomainItemMustMatchTopLevelEntity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toContain(commonName);
    expect(failures[0].message).toContain('does not match any declared Common');
  });
});
