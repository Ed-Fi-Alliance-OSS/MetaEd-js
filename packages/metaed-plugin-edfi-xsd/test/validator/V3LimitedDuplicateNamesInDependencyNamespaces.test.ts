// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  defaultPluginTechVersion,
  newMetaEdEnvironment,
  newPluginEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';

import { validate } from '../../src/validator/V3LimitedDuplicateNamesInDependencyNamespaces';

describe('when DEs have different names across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity('DomainEntity2')
      .withDocumentation('doc')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    metaEd.plugin.set('edfiXsd', { ...newPluginEnvironment(), targetTechnologyVersion: defaultPluginTechVersion });
    failures = validate(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension domain entity', (): void => {
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when DEs have same names across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity('DomainEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    metaEd.plugin.set('edfiXsd', { ...newPluginEnvironment(), targetTechnologyVersion: defaultPluginTechVersion });
    failures = validate(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension domain entity', (): void => {
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure for extension entity', (): void => {
    expect(failures).toHaveLength(1);

    expect(failures[0].validatorName).toBe('V3LimitedDuplicateNamesInDependencyNamespaces');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Domain Entity named DomainEntity already exists in project EdFi. The XSD specification for this is currently undefined. MetaEd XSD generation and ODS/API bulk data loading will be disabled."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 16,
              "line": 11,
              "tokenText": "DomainEntity",
            }
        `);
  });
});

// not a name collision because they are completely separate namespaces
describe('when DE Extension has same name as DE Extension that is not across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespacea: any = null;
  let extensionNamespaceb: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityXYZ')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extensiona', 'Extensiona')
      .withStartDomainEntityExtension('DomainEntityXYZ')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .withBeginNamespace('Extensionb', 'Extensionb')
      .withStartDomainEntityExtension('DomainEntityXYZ')
      .withBooleanProperty('Prop3', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespacea = metaEd.namespace.get('Extensiona');
    extensionNamespaceb = metaEd.namespace.get('Extensionb');
    extensionNamespacea.dependencies.push(coreNamespace);
    extensionNamespaceb.dependencies.push(coreNamespace);

    metaEd.plugin.set('edfiXsd', { ...newPluginEnvironment(), targetTechnologyVersion: defaultPluginTechVersion });
    failures = validate(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension1 domain entity extension', (): void => {
    expect(extensionNamespacea.entity.domainEntityExtension.size).toBe(1);
  });

  it('should build one extension2 domain entity extension', (): void => {
    expect(extensionNamespaceb.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

// not a problem for this validator because they are different types
describe('when DE has same name as DE extension across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntityExtension('DomainEntity2')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    metaEd.plugin.set('edfiXsd', { ...newPluginEnvironment(), targetTechnologyVersion: defaultPluginTechVersion });
    failures = validate(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension domain entity extension', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

// not a problem for this validator because they are different types
// however this is not legal, and should be handled by a separate validator
describe('when DE has same name as Common across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('MyEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartCommon('MyEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);
    metaEd.plugin.set('edfiXsd', { ...newPluginEnvironment(), targetTechnologyVersion: defaultPluginTechVersion });

    failures = validate(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension common', (): void => {
    expect(extensionNamespace.entity.common.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});
