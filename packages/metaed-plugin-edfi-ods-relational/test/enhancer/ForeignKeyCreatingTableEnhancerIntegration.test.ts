// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DomainEntityBuilder, MetaEdTextBuilder, NamespaceBuilder, newMetaEdEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as initializeOdsPlugin } from '../../index';

// METAED-1180 - Fix FK gen issue with rolenamed collection of entities themselves having rolenamed properties
describe('when an entity has a role named collection of entities with role named references to another entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('Org')
      .withDocumentation('doc')
      .withIntegerIdentity('OrgId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Other')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Org', 'doc')
      // role named
      .withDomainEntityIdentity('Org', 'doc', 'Another')
      .withEndDomainEntity()

      .withStartDomainEntity('Base')
      .withDocumentation('doc')
      .withIntegerIdentity('Dummy', 'doc')
      // role named
      .withDomainEntityProperty('Other', 'doc', false, true, false, 'New')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEd.dataStandardVersion = '5.2.0';
    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeOdsPlugin().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should not crash, because ForeignKeyCreatingTableEnhancer correctly matches foreign key columns', (): void => {
    expect(true).toBe(true);
  });
});
