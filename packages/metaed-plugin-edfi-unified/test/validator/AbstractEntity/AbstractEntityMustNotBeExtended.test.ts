// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/AbstractEntity/AbstractEntityMustNotBeExtended';

describe('when validating domain entity additions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: ValidationFailure[];

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName1', 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartDomainEntityExtension(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName2', 'Documentation')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  it('should build domain entity and domain entity extension', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating abstract entity additions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: ValidationFailure[];

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartAbstractEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName1', 'Documentation')
      .withEndAbstractEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartDomainEntityExtension(`${coreNamespaceName}.${domainEntityName}`)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName2', 'Documentation')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  it('should build abstract entity and domain entity extension', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures).toMatchSnapshot();
  });
});

describe('when validating abstract entity additions in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2 = 'DomainEntityName2';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: ValidationFailure[];

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartAbstractEntity('DomainEntityName1')
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName1', 'Documentation')
      .withEndAbstractEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartAbstractEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName1', 'Documentation')
      .withEndAbstractEntity()

      .withStartDomainEntityExtension(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName2', 'Documentation')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  it('should build domain entity, abstract entity and domain entity extension', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures).toMatchSnapshot();
  });
});
