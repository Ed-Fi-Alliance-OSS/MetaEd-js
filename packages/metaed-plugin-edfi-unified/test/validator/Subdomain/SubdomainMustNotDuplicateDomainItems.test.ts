// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Subdomain/SubdomainMustNotDuplicateDomainItems';

describe('when validating subdomain entity domain item does not duplicate domain items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainItem1')
      .withDomainEntityDomainItem('DomainItem2')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain entity', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should build two domain entity domain items', (): void => {
    const subdomain = coreNamespace.entity.subdomain.get(subdomainName);
    expect(subdomain).toBeDefined();
    if (subdomain !== undefined) {
      expect(subdomain.domainItems.length).toBe(2);
    }
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating subdomain entity domain item has duplicate domain items', (): void => {
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
      .withDomainEntityDomainItem(domainEntityName)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain entity', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Subdomain Entity Domain Item 'DomainEntityName' of type 'domainEntity' has a duplicate within the same type.",
          "sourceMap": Object {
            "column": 18,
            "line": 5,
            "tokenText": "DomainEntityName",
          },
          "validatorName": "SubdomainMustNotDuplicateDomainItems",
        },
      ]
    `);
  });
});

describe('when validating subdomain entity domain item has multiple duplicate domain items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityName2 = 'DomainEntityName2';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('NotDuplicate')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName2)
      .withDomainEntityDomainItem(domainEntityName2)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain entity', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have multiple validation failures', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Subdomain Entity Domain Item 'DomainEntityName' of type 'domainEntity' has a duplicate within the same type.",
          "sourceMap": Object {
            "column": 18,
            "line": 6,
            "tokenText": "DomainEntityName",
          },
          "validatorName": "SubdomainMustNotDuplicateDomainItems",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Subdomain Entity Domain Item 'DomainEntityName2' of type 'domainEntity' has a duplicate within the same type.",
          "sourceMap": Object {
            "column": 18,
            "line": 9,
            "tokenText": "DomainEntityName2",
          },
          "validatorName": "SubdomainMustNotDuplicateDomainItems",
        },
      ]
    `);
  });
});

describe('when validating subdomain items with same name but different referenced types', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const sharedName = 'Student';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(sharedName)
      .withDescriptorDomainItem(sharedName)
      .withAssociationDomainItem(sharedName)
      .withCommonDomainItem(sharedName)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating subdomain items with duplicates within same referenced type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const sharedName = 'GradingPeriod';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(sharedName)
      // Duplicate domainEntity
      .withDomainEntityDomainItem(sharedName)
      // Not duplicate though same name
      .withDescriptorDomainItem(sharedName)
      .withCommonDomainItem('Address')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Subdomain Entity Domain Item 'GradingPeriod' of type 'domainEntity' has a duplicate within the same type.",
          "sourceMap": Object {
            "column": 18,
            "line": 5,
            "tokenText": "GradingPeriod",
          },
          "validatorName": "SubdomainMustNotDuplicateDomainItems",
        },
      ]
    `);
  });
});
