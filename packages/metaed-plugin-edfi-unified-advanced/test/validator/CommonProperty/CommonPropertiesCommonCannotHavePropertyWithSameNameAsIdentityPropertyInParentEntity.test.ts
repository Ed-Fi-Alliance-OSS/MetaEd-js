// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  CommonBuilder,
  CommonSubclassBuilder,
  AssociationBuilder,
  NamespaceBuilder,
  MetaEdEnvironment,
  ValidationFailure,
} from '@edfi/metaed-core';
import {
  commonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  domainEntityReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
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

  describe('when a domain entity subclass inherits an identity property that conflicts with a common property', () => {
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

        .withStartDomainEntity('BaseDomainEntity')
        .withDocumentation('Base domain documentation')
        .withStringIdentity('ConflictProp', 'Identity property', '100')
        .withEndDomainEntity()

        .withStartDomainEntitySubclass('ChildDomainEntity', 'BaseDomainEntity')
        .withDocumentation('Child domain documentation')
        .withCommonProperty('CommonEntity', 'Relationship prop', false, false)
        .withEndDomainEntitySubclass()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      domainEntitySubclassBaseClassEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have one validation failure', () => {
      expect(failures).toHaveLength(1);
    });

    it('should have the correct failure content', () => {
      expect(failures[0]).toMatchObject({
        validatorName: 'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
        category: 'error',
        message: expect.stringContaining('ConflictProp'),
      });
    });
  });

  describe('when a common subclass inherits a property that conflicts with the parent entity identity property', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartCommon('BaseCommon')
        .withDocumentation('Base common documentation')
        .withStringProperty('ConflictProp', 'Common property', true, false, '100')
        .withEndCommon()

        .withStartCommonSubclass('ChildCommon', 'BaseCommon')
        .withStringProperty('ExtraProp', 'Extra property', true, false, '100')
        .withEndCommonSubclass()

        .withStartDomainEntity('DomainEntity')
        .withDocumentation('Domain documentation')
        .withStringIdentity('ConflictProp', 'Identity property', '100')
        .withCommonProperty('ChildCommon', 'Relationship prop', false, false)
        .withEndDomainEntity()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []))
        .sendToListener(new CommonSubclassBuilder(metaEd, []));

      commonSubclassBaseClassEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have one validation failure', () => {
      expect(failures).toHaveLength(1);
    });

    it('should have the correct failure content', () => {
      expect(failures[0]).toMatchObject({
        validatorName: 'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
        category: 'error',
        message: expect.stringContaining('ConflictProp'),
      });
    });
  });

  describe('when an association has a common property that conflicts with an association identity property', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartDomainEntity('Student')
        .withDocumentation('Student entity')
        .withStringIdentity('StudentUniqueId', 'Student identity', '100')
        .withEndDomainEntity()

        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('Education organization entity')
        .withStringIdentity('EducationOrganizationId', 'Education organization identity', '100')
        .withEndDomainEntity()

        .withStartCommon('ProgramParticipation')
        .withDocumentation('Common documentation')
        .withDomainEntityProperty('EducationOrganization', 'Common property', true, false)
        .withEndCommon()

        .withStartAssociation('StudentEducationOrganizationAssociation')
        .withDocumentation('Association documentation')
        .withAssociationDomainEntityProperty('Student', 'Student reference')
        .withAssociationDomainEntityProperty('EducationOrganization', 'Education organization reference')
        .withCommonProperty('ProgramParticipation', 'Program participation', false, false)
        .withEndAssociation()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new AssociationBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have one validation failure', () => {
      expect(failures).toHaveLength(1);
    });

    it('should have the correct failure content', () => {
      expect(failures[0]).toMatchObject({
        validatorName: 'CommonPropertiesCommonCannotHavePropertyWithSameNameAsIdentityPropertyInParentEntity',
        category: 'error',
        message: expect.stringContaining('EducationOrganization'),
      });
    });
  });

  describe('when an association has a common property that does not conflict with association identity properties', () => {
    let metaEd: MetaEdEnvironment;
    let failures: ValidationFailure[];

    beforeAll(() => {
      metaEd = newMetaEdEnvironment();
      metaEd.dataStandardVersion = '6.2.0';

      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')

        .withStartDomainEntity('Student')
        .withDocumentation('Student entity')
        .withStringIdentity('StudentUniqueId', 'Student identity', '100')
        .withEndDomainEntity()

        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('Education organization entity')
        .withStringIdentity('EducationOrganizationId', 'Education organization identity', '100')
        .withEndDomainEntity()

        .withStartCommon('ProgramParticipation')
        .withDocumentation('Common documentation')
        .withStringProperty('ProgramName', 'Program name', true, false, '100')
        .withEndCommon()

        .withStartAssociation('StudentEducationOrganizationAssociation')
        .withDocumentation('Association documentation')
        .withAssociationDomainEntityProperty('Student', 'Student reference')
        .withAssociationDomainEntityProperty('EducationOrganization', 'Education organization reference')
        .withCommonProperty('ProgramParticipation', 'Program participation', false, false)
        .withEndAssociation()

        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new AssociationBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      failures = validate(metaEd);
    });

    it('should have no validation failures', () => {
      expect(failures).toHaveLength(0);
    });
  });
});
