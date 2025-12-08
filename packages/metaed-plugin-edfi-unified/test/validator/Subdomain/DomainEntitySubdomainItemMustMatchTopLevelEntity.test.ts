// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Subdomain/DomainEntitySubdomainItemMustMatchTopLevelEntity';

describe('when validating domain entity subdomain item matches top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const domainEntityName = 'DomainEntityName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntityName)
      .withEndSubdomain()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

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

describe('when validating domain entity subdomain item matches top level entity across namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const domainEntityName = 'DomainEntityName';

  let failures: ValidationFailure[];
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(`EdFi.${domainEntityName}`)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

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

describe('when validating domain entity subdomain item matches top level entity subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const domainEntityName = 'DomainEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntitySubclassName)
      .withEndSubdomain()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

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

describe('when validating domain entity subdomain item does not match top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const domainEntityName = 'DomainEntityName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    metaEd.dataStandardVersion = '5.0.0';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainEntityDomainItemName')
      .withEndSubdomain()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have one validation failure()', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DomainEntitySubdomainItemMustMatchTopLevelEntity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Domain Entity Subdomain Item property 'DomainEntityDomainItemName' does not match any declared Domain Entity or Domain Entity Subclass in namespace EdFi."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 5,
        "tokenText": "DomainEntityDomainItemName",
      }
    `);
  });
});
