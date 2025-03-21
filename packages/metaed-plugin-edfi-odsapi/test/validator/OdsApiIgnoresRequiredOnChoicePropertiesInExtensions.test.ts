// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { DomainEntityBuilder, NamespaceBuilder, MetaEdTextBuilder, newMetaEdEnvironment } from '@edfi/metaed-core';
import { validate } from '../../src/validator/OdsApiIgnoresRequiredOnChoicePropertiesInExtensions';

describe('when choice property in extension is required', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanIdentity('Identity', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntityName')
      .withDocumentation('doc')
      .withBooleanIdentity('Identity', 'doc')
      .withChoiceProperty('ChoiceProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(builder);

    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "warning",
          "fileMap": null,
          "message": "Choice property ChoiceProperty is marked as required, but the ODS/API treats all choice properties as optional.",
          "sourceMap": Object {
            "column": 11,
            "line": 18,
            "tokenText": "ChoiceProperty",
          },
          "validatorName": "OdsApiIgnoresRequiredOnChoicePropertiesInExtensions",
        },
      ]
    `);
  });
});

describe('when choice property in extension is optional', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanIdentity('Identity', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntityName')
      .withDocumentation('doc')
      .withBooleanIdentity('Identity', 'doc')
      .withChoiceProperty('ChoiceProperty', 'doc', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(builder);

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when choice property in core is required', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanIdentity('Identity', 'doc')
      .withChoiceProperty('ChoiceProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(builder);

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
