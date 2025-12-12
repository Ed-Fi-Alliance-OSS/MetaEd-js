// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance as sensitiveDataEnhancer } from '../../src/enhancer/SensitiveDataEnhancer';
import { enhance } from '../../src/enhancer/IdentityJsonPathsEnhancer';

function runApiSchemaEnhancers(metaEd: MetaEdEnvironment) {
  namespaceSetupEnhancer(metaEd);
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  subclassPropertyNamingCollisionEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);
  jsonSchemaForInsertEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  typeCoercionJsonPathsEnhancer(metaEd);
  sensitiveDataEnhancer(metaEd);
  enhance(metaEd);
}

describe('SensitiveDataEnhancer', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'Student';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringProperty('FirstName', 'doc1', true, false, '30', null, null, null, true)
      .withStringProperty('LastName', 'doc2', true, false, '60', null, null, null, true)
      .withStringProperty('MiddleName', 'doc3', false, false, '30', null, null, null, true)
      .withStringProperty('EmailAddress', 'doc4', false, false, '128', null, null, null, true)
      .withIntegerProperty('SocialSecurityNumber', 'doc5', false, false, null, null, null, null, false, false, true)
      .withStringProperty('StudentUniqueId', 'doc6', true, false, '32')
      .withStringProperty('NonSensitiveDataField', 'doc7', false, false, '50')
      .withIntegerProperty('NonSensitiveDataInteger', 'doc8', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should include sensitiveDataJsonPaths for properties marked as sensitive', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const sensitiveDataJsonPaths = entity?.data.edfiApiSchema.sensitiveDataJsonPaths;
    expect(sensitiveDataJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$.emailAddress",
        "$.firstName",
        "$.lastName",
        "$.middleName",
        "$.socialSecurityNumber",
      ]
    `);
  });

  it('should not include non-sensitive fields in sensitiveDataJsonPaths', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const sensitiveDataJsonPaths = entity?.data.edfiApiSchema.sensitiveDataJsonPaths;
    expect(sensitiveDataJsonPaths).not.toContain('$.NonSensitiveDataField');
    expect(sensitiveDataJsonPaths).not.toContain('$.NonSensitiveDataInteger');
    expect(sensitiveDataJsonPaths).not.toContain('$.studentUniqueId');
  });
});
