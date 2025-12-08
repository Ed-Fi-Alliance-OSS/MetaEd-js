// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainBuilder,
  DescriptorBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Subdomain/DescriptorSubdomainItemMustMatchTopLevelEntity';

describe('when validating descriptor subdomain item matches top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const descriptorName = 'DescriptorName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDescriptorDomainItem(descriptorName)
      .withEndSubdomain()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating descriptor subdomain item matches top level entity across namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const descriptorName = 'DescriptorName';

  let failures: ValidationFailure[];
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDescriptorDomainItem(`EdFi.${descriptorName}`)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies = [coreNamespace];
    failures = validate(metaEd);
  });

  it('should build one subdomain', (): void => {
    expect(extensionNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating descriptor subdomain item does not match top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const descriptorName = 'DescriptorName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    metaEd.dataStandardVersion = '5.0.0';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDescriptorDomainItem('DescriptorDomainItemName')
      .withEndSubdomain()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have one validation failure()', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DescriptorSubdomainItemMustMatchTopLevelEntity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Descriptor Subdomain Item property 'DescriptorDomainItemName' does not match any declared Descriptor in namespace EdFi."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 15,
        "line": 5,
        "tokenText": "DescriptorDomainItemName",
      }
    `);
  });
});
