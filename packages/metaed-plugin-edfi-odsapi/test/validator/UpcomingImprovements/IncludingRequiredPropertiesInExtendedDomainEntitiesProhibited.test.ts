// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  defaultPluginTechVersion,
  newMetaEdEnvironment,
  newPluginEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/UpcomingImprovements/IncludingRequiredPropertiesInExtendedDomainEntitiesProhibited';

describe('when a domain entity extension extends a domain entity with no required properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: defaultPluginTechVersion,
    }),
  );
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('OptionalProperty1', 'doc', false, false)
      .withBooleanProperty('OptionalProperty2', 'doc', false, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when a domain entity extension extends a domain entity with a required property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: defaultPluginTechVersion,
    }),
  );
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('RequiredProperty', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('IncludingRequiredPropertiesInExtendedDomainEntitiesProhibited');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when a domain entity extension extends a domain entity with a required property should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when a domain entity extension extends a domain entity with a required property should have validation failure -> sourceMap',
    );
  });
});

describe('when a domain entity extension extends a domain entity with a required property for ODS/API >5.1', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '5.3.0',
    }),
  );
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('RequiredProperty', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
