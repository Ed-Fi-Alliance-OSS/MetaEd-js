// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  CommonBuilder,
  NamespaceBuilder,
  MetaEdEnvironment,
  ValidationFailure,
} from '@edfi/metaed-core';

import { commonReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';

import { validate } from '../../../src/validator/CommonProperty/CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity';

describe('CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity validator', () => {
  const COMMON_ENTITY = 'CommonEntity';
  const DOMAIN_ENTITY = 'DomainEntity';

  describe('when a common property has the same name as an identity property in the parent entity', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];
    let coreNamespace: any;

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        // Define the Common Entity with a property that conflicts with parent identity
        .withStartCommon(COMMON_ENTITY)
        .withDocumentation('Common documentation')
        .withStringProperty('ConflictProp', 'Common property', true, false, '100')
        .withStringProperty('OtherProp', 'Common property', true, false, '100')
        .withEndCommon()

        // Define the Domain Entity with identity properties named the same as Common properties
        .withStartDomainEntity(DOMAIN_ENTITY)
        .withDocumentation('Domain documentation')
        .withStringIdentity('ConflictProp', 'Identity property', '100')
        .withStringIdentity('OtherProp', 'Identity property', '100')
        .withCommonProperty(COMMON_ENTITY, 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      coreNamespace = metaEd.namespace.get('EdFi');
      commonReferenceEnhancer(metaEd);

      failures = validate(metaEd);
    });

    it('should build the common entity', () => {
      expect(coreNamespace.entity.common.size).toBe(1);
    });

    it('should build the domain entity', () => {
      expect(coreNamespace.entity.domainEntity.size).toBe(1);
    });

    it('should create four validation failures (two entries for each conflicting property)', () => {
      expect(failures).toHaveLength(4);
    });

    it('should validate the first failure content', () => {
      expect(failures[0].validatorName).toBe(
        'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
      );
      expect(failures[0].category).toBe('error');
      expect(failures[0].message).toMatchInlineSnapshot(
        `"The Common entity 'CommonEntity' referenced in 'DomainEntity' cannot declare a property 'ConflictProp' with the same name as identity property 'ConflictProp' in this entity."`,
      );
      expect(failures[0].sourceMap).toMatchInlineSnapshot(`
        Object {
          "column": 11,
          "line": 28,
          "tokenText": "CommonEntity",
        }
      `);
    });

    it('should validate the identity-side failure for the first property', () => {
      expect(failures[1].validatorName).toBe(
        'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
      );
      expect(failures[1].message).toMatchInlineSnapshot(
        `"The Common entity 'CommonEntity' referenced in 'DomainEntity' cannot declare a property 'ConflictProp' with the same name as identity property 'ConflictProp' in this entity."`,
      );
      expect(failures[1].sourceMap).toMatchInlineSnapshot(`
        Object {
          "column": 11,
          "line": 18,
          "tokenText": "ConflictProp",
        }
      `);
    });

    it('should validate the failures for the second property', () => {
      expect(failures[2].validatorName).toBe(
        'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
      );
      expect(failures[2].message).toContain('OtherProp');
      expect(failures[2].sourceMap).toMatchInlineSnapshot(`
        Object {
          "column": 11,
          "line": 28,
          "tokenText": "CommonEntity",
        }
      `);

      expect(failures[3].validatorName).toBe(
        'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
      );
      expect(failures[3].message).toContain('OtherProp');
      expect(failures[3].sourceMap).toMatchInlineSnapshot(`
        Object {
          "column": 11,
          "line": 23,
          "tokenText": "OtherProp",
        }
      `);
    });
  });

  describe('when common property does NOT match any identity property of parent entity', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartCommon(COMMON_ENTITY)
        .withDocumentation('Common documentation')
        .withStringProperty('GoodProp', 'Common property', true, false, '100')
        .withEndCommon()

        .withStartDomainEntity(DOMAIN_ENTITY)
        .withDocumentation('Domain documentation')
        .withStringIdentity('SomeId', 'Identity property', '100')
        .withCommonProperty(COMMON_ENTITY, 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      commonReferenceEnhancer(metaEd);

      failures = validate(metaEd);
    });

    it('should have zero failures when there is no naming conflict', () => {
      expect(failures).toHaveLength(0);
    });
  });
});
