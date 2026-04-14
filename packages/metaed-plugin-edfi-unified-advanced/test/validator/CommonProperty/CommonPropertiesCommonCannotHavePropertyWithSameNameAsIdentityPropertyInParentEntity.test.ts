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
import { commonReferenceEnhancer, domainEntityReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/CommonProperty/CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity';

describe('CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity validator', () => {
  describe('when a common has a property with the same fullPropertyName as a parent identity property', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartCommon('CommonEntity')
        .withDocumentation('Common documentation')
        .withStringProperty('ConflictProp', 'Common property', true, false, '100')
        .withEndCommon()

        .withStartDomainEntity('DomainEntity')
        .withDocumentation('Domain documentation')
        .withStringIdentity('ConflictProp', 'Identity property', '100')
        .withCommonProperty('CommonEntity', 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have one validation failure', () => {
      expect(failures).toHaveLength(1);
    });

    it('should have the correct failure content', () => {
      expect(failures).toMatchInlineSnapshot(`
        Array [
          Object {
            "category": "error",
            "fileMap": null,
            "message": "This Common has a property 'ConflictProp' with the same name as an identity property on this entity, which is not allowed. Options include renaming, role naming, or changing identity status.",
            "sourceMap": Object {
              "column": 11,
              "line": 18,
              "tokenText": "CommonEntity",
            },
            "validatorName": "CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity",
          },
        ]
      `);
    });
  });

  describe('when common property does not match any identity property of parent entity', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartCommon('CommonEntity')
        .withDocumentation('Common documentation')
        .withStringProperty('GoodProp', 'Common property', true, false, '100')
        .withEndCommon()

        .withStartDomainEntity('DomainEntity')
        .withDocumentation('Domain documentation')
        .withStringIdentity('SomeId', 'Identity property', '100')
        .withCommonProperty('CommonEntity', 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have no validation failures', () => {
      expect(failures).toHaveLength(0);
    });
  });

  describe('when role name on identity property disambiguates from common property', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('Referenced entity')
        .withStringIdentity('EducationOrganizationId', 'Id property', '100')
        .withEndDomainEntity()

        .withStartCommon('AdministrationPointOfContact')
        .withDocumentation('Common documentation')
        .withDomainEntityProperty('EducationOrganization', 'Common property', true, false)
        .withEndCommon()

        .withStartDomainEntity('AssessmentAdministrationParticipation')
        .withDocumentation('Domain documentation')
        .withDomainEntityIdentity('EducationOrganization', 'Identity property', 'Participating')
        .withCommonProperty('AdministrationPointOfContact', 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have no validation failures', () => {
      expect(failures).toHaveLength(0);
    });
  });

  describe('when role name on common property disambiguates from identity property', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartDomainEntity('Person')
        .withDocumentation('Referenced entity')
        .withStringIdentity('PersonId', 'Id property', '100')
        .withEndDomainEntity()

        .withStartCommon('Reviewer')
        .withDocumentation('Common documentation')
        .withDomainEntityProperty('Person', 'Common property', false, false, false, 'Reviewer')
        .withEndCommon()

        .withStartDomainEntity('PerformanceEvaluationRating')
        .withDocumentation('Domain documentation')
        .withDomainEntityIdentity('Person', 'Identity property')
        .withCommonProperty('Reviewer', 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have no validation failures', () => {
      expect(failures).toHaveLength(0);
    });
  });

  describe('when data standard version is below 6.1', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '5.0.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartCommon('CommonEntity')
        .withDocumentation('Common documentation')
        .withStringProperty('ConflictProp', 'Common property', true, false, '100')
        .withEndCommon()

        .withStartDomainEntity('DomainEntity')
        .withDocumentation('Domain documentation')
        .withStringIdentity('ConflictProp', 'Identity property', '100')
        .withCommonProperty('CommonEntity', 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have no validation failures', () => {
      expect(failures).toHaveLength(0);
    });
  });

  describe('when data standard version is 6.0 (below the 6.1 threshold)', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.0.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartCommon('CommonEntity')
        .withDocumentation('Common documentation')
        .withStringProperty('ConflictProp', 'Common property', true, false, '100')
        .withEndCommon()

        .withStartDomainEntity('DomainEntity')
        .withDocumentation('Domain documentation')
        .withStringIdentity('ConflictProp', 'Identity property', '100')
        .withCommonProperty('CommonEntity', 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have no validation failures', () => {
      expect(failures).toHaveLength(0);
    });
  });
});
