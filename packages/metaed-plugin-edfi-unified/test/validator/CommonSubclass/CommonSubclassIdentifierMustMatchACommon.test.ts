// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  CommonSubclassBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CommonSubclass/CommonSubclassIdentifierMustMatchACommon';

describe('when common subclass has valid extendee', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartCommonSubclass('SubclassName', entityName)
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation1', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one common subclass', (): void => {
    expect(coreNamespace.entity.commonSubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when common subclass has invalid extendee', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommonSubclass('EntityName', 'BaseEntityName')
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName', 'PropertyDocumentation', true, false)
      .withEndCommonSubclass()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one common subclass', (): void => {
    expect(coreNamespace.entity.commonSubclass.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('CommonSubclassIdentifierMustMatchAnCommon');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Common EntityName based on BaseEntityName does not match any declared Common in namespace EdFi."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 2,
        "tokenText": "EntityName",
      }
    `);
  });
});

describe('when common subclass has valid extendee across dependent namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName', 'PropertyDocumentation', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonSubclass('SubclassName', `EdFi.${entityName}`)
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation1', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one common subclass', (): void => {
    expect(extensionNamespace.entity.commonSubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
