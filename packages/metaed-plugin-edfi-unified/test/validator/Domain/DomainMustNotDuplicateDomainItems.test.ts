// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Domain/DomainMustNotDuplicateDomainItems';

describe('when validating domain entity domain item does not duplicate domain items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainItem1')
      .withDomainEntityDomainItem('DomainItem2')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity domain item duplicates domain items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const domainEntityName = 'DomainEntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

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
          "message": "Domain Item 'DomainEntityName' of type 'domainEntity' has a duplicate within the same type.",
          "sourceMap": Object {
            "column": 18,
            "line": 5,
            "tokenText": "DomainEntityName",
          },
          "validatorName": "DomainMustNotDuplicateDomainItems",
        },
      ]
    `);
  });
});

describe('when validating domain entity domain item has multiple duplicate domain items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityName2 = 'DomainEntityName2';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName2)
      .withDomainEntityDomainItem(domainEntityName2)
      .withDomainEntityDomainItem('NotDuplicate')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have multiple validation failures', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Domain Item 'DomainEntityName' of type 'domainEntity' has a duplicate within the same type.",
          "sourceMap": Object {
            "column": 18,
            "line": 5,
            "tokenText": "DomainEntityName",
          },
          "validatorName": "DomainMustNotDuplicateDomainItems",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Domain Item 'DomainEntityName2' of type 'domainEntity' has a duplicate within the same type.",
          "sourceMap": Object {
            "column": 18,
            "line": 8,
            "tokenText": "DomainEntityName2",
          },
          "validatorName": "DomainMustNotDuplicateDomainItems",
        },
      ]
    `);
  });
});

describe('when validating domain items with same name but different referenced types', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const sharedName = 'Student';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(sharedName)
      .withDescriptorDomainItem(sharedName)
      .withAssociationDomainItem(sharedName)
      .withCommonDomainItem(sharedName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain items with duplicates within same referenced type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const sharedName = 'GradingPeriod';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(sharedName)
      // Duplicate domainEntity
      .withDomainEntityDomainItem(sharedName)
      // Not duplicate though same name
      .withDescriptorDomainItem(sharedName)
      .withCommonDomainItem('Address')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

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
          "message": "Domain Item 'GradingPeriod' of type 'domainEntity' has a duplicate within the same type.",
          "sourceMap": Object {
            "column": 18,
            "line": 5,
            "tokenText": "GradingPeriod",
          },
          "validatorName": "DomainMustNotDuplicateDomainItems",
        },
      ]
    `);
  });
});
