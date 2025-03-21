// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/InlineCommonProperty/InlineCommonPropertyMustNotBeACollection';

describe('when inline common property is not a collection', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInlineCommon(entityName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, '100')
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withInlineCommonProperty(entityName, 'doc', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should not have validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when inline common property is an optional collection', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInlineCommon(entityName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, '100')
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withInlineCommonProperty(entityName, 'doc', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('InlineCommonPropertyMustNotBeACollection');
    expect(failures[0].category).toBe('error');

    expect(failures[0].message).toMatchInlineSnapshot(
      `"Inline Common property 'EntityName' is not allowed to be a collection"`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 13,
        "tokenText": "EntityName",
      }
    `);
  });
});

describe('when inline common property is a required collection', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInlineCommon(entityName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, '100')
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withInlineCommonProperty(entityName, 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('InlineCommonPropertyMustNotBeACollection');
    expect(failures[0].category).toBe('error');

    expect(failures[0].message).toMatchInlineSnapshot(
      `"Inline Common property 'EntityName' is not allowed to be a collection"`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 13,
        "tokenText": "EntityName",
      }
    `);
  });
});
