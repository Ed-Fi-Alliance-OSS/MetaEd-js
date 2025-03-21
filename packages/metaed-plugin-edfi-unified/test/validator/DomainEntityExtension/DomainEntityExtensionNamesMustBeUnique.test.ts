// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityExtensionBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/DomainEntityExtension/DomainEntityExtensionNamesMustBeUnique';

describe('when entities in same namespace have different names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntityExtension('ValidName1')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartDomainEntityExtension('ValidName2')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domainEntityExtension', (): void => {
    expect(coreNamespace.entity.domainEntityExtension.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when entities in same namespace have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domainEntityExtension because TopLevelEntityBuilder will not let it get that far', (): void => {
    expect(coreNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures because of TopLevelEntityBuilder', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domainEntityExtensions in separate dependency-linked namespaces have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one domainEntityExtension in core namespace', (): void => {
    expect(coreNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should build one domainEntityExtension in extension namespace', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domainEntityExtensions in non-dependency-linked namespaces have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespacea: any = null;
  let extensionNamespaceb: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntityExtension('NotADuplicate')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .withBeginNamespace('Extensiona', 'Extensiona')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .withBeginNamespace('Extensionb', 'Extensionb')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespacea = metaEd.namespace.get('Extensiona');
    extensionNamespaceb = metaEd.namespace.get('Extensionb');
    extensionNamespacea.dependencies.push(coreNamespace);
    extensionNamespaceb.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one core domainEntityExtension', (): void => {
    expect(coreNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should build one extension1 domainEntityExtension', (): void => {
    expect(extensionNamespacea.entity.domainEntityExtension.size).toBe(1);
  });

  it('should build one extension2 domainEntityExtension', (): void => {
    expect(extensionNamespaceb.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
