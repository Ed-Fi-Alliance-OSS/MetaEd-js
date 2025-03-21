// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/MergeDirective/MergeDirectiveMustStartSourcePathWithPropertyName';

describe('when validating reference property starts merge path with matching property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const entityName = 'DomainEntityPropertyName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty(entityName, 'DomainEntityPropertyDocumentation', true, false)
      .withMergeDirective(`${entityName}.Property`, 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating reference property starts merge path with mismatched property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty('DomainEntityPropertyName', 'DomainEntityPropertyDocumentation', true, false)
      .withMergeDirective('EntityName.PropertyName', 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergeDirectiveMustStartSourcePathWithPropertyName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating reference property starts merge path with mismatched property name should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating reference property starts merge path with mismatched property name should have validation failure -> sourceMap',
    );
  });
});

describe('when validating reference property starts merge path with matching property name and context', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const entityName = 'DomainEntityPropertyName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty(entityName, 'DomainEntityPropertyDocumentation', true, false, false, entityName)
      .withMergeDirective(`${entityName}.Property`, 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating reference property starts merge path with property name and different context', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const entityName = 'DomainEntityPropertyName';
    const contextName = 'ContextName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty(entityName, 'DomainEntityPropertyDocumentation', true, false, false, contextName)
      .withMergeDirective(`${contextName}${entityName}.Property`, 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating reference property starts merge path with property name and missing context', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const entityName = 'DomainEntityPropertyName';
    const contextName = 'ContextName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty(entityName, 'DomainEntityPropertyDocumentation', true, false, false, contextName)
      .withMergeDirective(`${entityName}.Property`, 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergeDirectiveMustStartSourcePathWithPropertyName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating reference property starts merge path with property name and missing context should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating reference property starts merge path with property name and missing context should have validation failure -> sourceMap',
    );
  });
});

describe('when validating reference property starts merge path with matching property name for simple type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const propertyName = 'PropertyName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withSharedStringIdentity(propertyName, propertyName, 'doc')
      .withMergeDirective(`${propertyName}.Property`, 'TargetPropertyName')
      .withDomainEntityProperty('DomainEntityPropertyName', 'DomainEntityPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});
