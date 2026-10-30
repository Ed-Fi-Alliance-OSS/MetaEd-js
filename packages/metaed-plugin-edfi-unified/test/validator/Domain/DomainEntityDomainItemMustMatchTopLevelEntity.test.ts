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
  newState,
  runValidators,
  setupPlugins,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, State, ValidationFailure } from '@edfi/metaed-core';
import { initialize } from '../../../src';
import { validate } from '../../../src/validator/Domain/DomainEntityDomainItemMustMatchTopLevelEntity';

describe('when validating domain entity domain item matches top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const domainEntityName = 'DomainEntityName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntityName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

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

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity domain item matches top level entity across namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
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
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(`EdFi.${domainEntityName}`)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies = [coreNamespace];
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(extensionNamespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity domain item matches top level entity subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const domainEntityName = 'DomainEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntitySubclassName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

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

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when the unified plugin validates an unresolved domain entity domain item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainEntityDomainItemName')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    const state: State = { ...newState(), metaEd, metaEdPlugins: [initialize()] };
    state.metaEdConfiguration.defaultPluginTechVersion = '7.3.0';
    setupPlugins(state);
    runValidators(initialize(), state);
    failures = state.validationFailure;
  });

  it('should build one domain', (): void => {
    expect(metaEd.namespace.get('EdFi')?.entity.domain.size).toBe(1);
  });

  it('should report the unresolved member as a warning through the registered validators', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "warning",
          "fileMap": null,
          "message": "Domain Entity Domain Item property 'DomainEntityDomainItemName' does not match any declared Domain Entity or Domain Entity Subclass in namespace EdFi.",
          "sourceMap": Object {
            "column": 18,
            "line": 5,
            "tokenText": "DomainEntityDomainItemName",
          },
          "validatorName": "DomainEntityDomainItemMustMatchTopLevelEntity",
        },
      ]
    `);
  });
});
