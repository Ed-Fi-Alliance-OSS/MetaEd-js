// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  Namespace,
  AssociationBuilder,
  DomainEntitySubclassBuilder,
  AssociationSubclassBuilder,
  CommonBuilder,
  CommonSubclassBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import {
  associationSubclassBaseClassEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  commonSubclassBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/Deprecated/DeprecatedEntitySubclassWarning';

describe('when domain entity is not deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntitySubclass('SubclassName', 'EdFi.EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity is deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreDeprecationReason = 'is deprecated in core';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDeprecated(coreDeprecationReason)
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntitySubclass('SubclassName', 'EdFi.EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DeprecatedEntitySubclassWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"SubclassName is a subclass of deprecated entity EntityName."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 16,
        "line": 12,
        "tokenText": "SubclassName",
      }
    `);
  });
});

describe('when association is not deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation('EntityName')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc')
      .withAssociationDomainEntityProperty('Second', 'doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociationSubclass('SubclassName', 'EdFi.EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    associationSubclassBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association is deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreDeprecationReason = 'is deprecated in core';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation('EntityName')
      .withDeprecated(coreDeprecationReason)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc')
      .withAssociationDomainEntityProperty('Second', 'doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociationSubclass('SubclassName', 'EdFi.EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    associationSubclassBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DeprecatedEntitySubclassWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"SubclassName is a subclass of deprecated entity EntityName."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 14,
        "line": 18,
        "tokenText": "SubclassName",
      }
    `);
  });
});

describe('when common is not deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonSubclass('SubclassName', 'EdFi.EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    commonSubclassBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when common is deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreDeprecationReason = 'is deprecated in core';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon('EntityName')
      .withDeprecated(coreDeprecationReason)
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonSubclass('SubclassName', 'EdFi.EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    commonSubclassBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DeprecatedEntitySubclassWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"SubclassName is a subclass of deprecated entity EntityName."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 12,
        "tokenText": "SubclassName",
      }
    `);
  });
});
