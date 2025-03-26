// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntityBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, domainEntitySubclassBaseClassEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance } from '../../../src/enhancer/security/StudentSecurableAuthorizationEnhancer';
import { enhance as namespaceSetupEnhancer } from '../../../src/model/Namespace';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';

function runEnhancers(metaEd: MetaEdEnvironment) {
  domainEntityReferenceEnhancer(metaEd);
  domainEntitySubclassBaseClassEnhancer(metaEd);

  namespaceSetupEnhancer(metaEd);
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  enhance(metaEd);
}

describe('when building domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '50', 'string', 'required')
      .withEndAbstractEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have no studentSecurableAuthorizationElements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const studentSecurableJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData)
      .studentSecurableAuthorizationElements;
    expect(studentSecurableJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with Student property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '50', 'string', 'required')
      .withEndAbstractEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have simple studentSecurableAuthorizationElements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const studentSecurableJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData)
      .studentSecurableAuthorizationElements;
    expect(studentSecurableJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$.studentReference.studentUniqueId",
      ]
    `);
  });
});

describe('when building domain entity with role named Student property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const resourceName = 'DisciplineAction';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '50', 'string', 'required')
      .withEndAbstractEntity()

      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withDomainEntityProperty('Student', 'doc', false, false, undefined, 'RoleName')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have empty studentSecurableAuthorizationElements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(resourceName);
    const studentSecurableJsonPaths = (entity?.data.edfiApiSchema as EntityApiSchemaData)
      .studentSecurableAuthorizationElements;
    expect(studentSecurableJsonPaths).toMatchInlineSnapshot(`Array []`);
  });
});
