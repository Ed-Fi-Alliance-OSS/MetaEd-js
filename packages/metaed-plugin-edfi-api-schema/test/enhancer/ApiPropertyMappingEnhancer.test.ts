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
  DomainEntitySubclassBuilder,
  CommonBuilder,
  CommonSubclassBuilder,
  ChoiceBuilder,
  DomainEntityExtensionBuilder,
  CommonExtensionBuilder,
  newNamespace,
} from '@edfi/metaed-core';
import {
  choiceReferenceEnhancer,
  domainEntityReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  commonReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as commonExtensionOverrideResolverEnhancer } from '../../src/enhancer/CommonExtensionOverrideResolverEnhancer';

import { enhance } from '../../src/enhancer/ApiPropertyMappingEnhancer';

describe('when building simple domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withDomainEntityProperty('ClassPeriod', 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be valid', () => {
    expect(metaEd.propertyIndex.string).toHaveLength(4);
    expect(metaEd.propertyIndex.string[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "SectionIdentifier",
        "descriptorCollectionName": "",
        "fullName": "SectionIdentifier",
        "fullNamePreservingPrefix": "SectionIdentifier",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "SectionIdentifier",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "SectionIdentifier",
      }
    `);
    expect(metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "LocalCourseCode",
        "descriptorCollectionName": "",
        "fullName": "LocalCourseCode",
        "fullNamePreservingPrefix": "LocalCourseCode",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "LocalCourseCode",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "LocalCourseCode",
      }
    `);
    expect(metaEd.propertyIndex.string[2].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "ClassPeriodName",
        "descriptorCollectionName": "",
        "fullName": "ClassPeriodName",
        "fullNamePreservingPrefix": "ClassPeriodName",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "ClassPeriodName",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "ClassPeriodName",
      }
    `);
    expect(metaEd.propertyIndex.string[3].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "SchoolId",
        "descriptorCollectionName": "",
        "fullName": "SchoolId",
        "fullNamePreservingPrefix": "SchoolId",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "SchoolId",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "SchoolId",
      }
    `);

    expect(metaEd.propertyIndex.domainEntity).toHaveLength(4);
    expect(metaEd.propertyIndex.domainEntity[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "CourseOfferingReference",
        "descriptorCollectionName": "",
        "fullName": "CourseOffering",
        "fullNamePreservingPrefix": "CourseOffering",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": true,
        "metaEdName": "CourseOffering",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "",
        "topLevelName": "CourseOfferingReference",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "ClassPeriods",
        "descriptorCollectionName": "",
        "fullName": "ClassPeriod",
        "fullNamePreservingPrefix": "ClassPeriod",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": true,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "ClassPeriod",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "ClassPeriodReference",
        "topLevelName": "ClassPeriods",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[2].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "SchoolReference",
        "descriptorCollectionName": "",
        "fullName": "School",
        "fullNamePreservingPrefix": "School",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": true,
        "metaEdName": "School",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "",
        "topLevelName": "SchoolReference",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[3].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "SchoolReference",
        "descriptorCollectionName": "",
        "fullName": "School",
        "fullNamePreservingPrefix": "School",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": true,
        "metaEdName": "School",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "",
        "topLevelName": "SchoolReference",
      }
    `);
  });
});

describe('when domain entity has a reference with same role name as entity name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withDomainEntityProperty('ClassPeriod', 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc', 'School')
      .withEndDomainEntity()

      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be valid', () => {
    expect(metaEd.propertyIndex.string).toHaveLength(4);
    expect(metaEd.propertyIndex.string[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "SectionIdentifier",
        "descriptorCollectionName": "",
        "fullName": "SectionIdentifier",
        "fullNamePreservingPrefix": "SectionIdentifier",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "SectionIdentifier",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "SectionIdentifier",
      }
    `);
    expect(metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "LocalCourseCode",
        "descriptorCollectionName": "",
        "fullName": "LocalCourseCode",
        "fullNamePreservingPrefix": "LocalCourseCode",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "LocalCourseCode",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "LocalCourseCode",
      }
    `);
    expect(metaEd.propertyIndex.string[2].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "ClassPeriodName",
        "descriptorCollectionName": "",
        "fullName": "ClassPeriodName",
        "fullNamePreservingPrefix": "ClassPeriodName",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "ClassPeriodName",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "ClassPeriodName",
      }
    `);
    expect(metaEd.propertyIndex.string[3].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "SchoolId",
        "descriptorCollectionName": "",
        "fullName": "SchoolId",
        "fullNamePreservingPrefix": "SchoolId",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "SchoolId",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "SchoolId",
      }
    `);

    expect(metaEd.propertyIndex.domainEntity).toHaveLength(4);
    expect(metaEd.propertyIndex.domainEntity[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "CourseOfferingReference",
        "descriptorCollectionName": "",
        "fullName": "CourseOffering",
        "fullNamePreservingPrefix": "CourseOffering",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": true,
        "metaEdName": "CourseOffering",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "",
        "topLevelName": "CourseOfferingReference",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "ClassPeriods",
        "descriptorCollectionName": "",
        "fullName": "ClassPeriod",
        "fullNamePreservingPrefix": "ClassPeriod",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": true,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "ClassPeriod",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "ClassPeriodReference",
        "topLevelName": "ClassPeriods",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[2].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "SchoolReference",
        "descriptorCollectionName": "",
        "fullName": "School",
        "fullNamePreservingPrefix": "School",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": true,
        "metaEdName": "School",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "",
        "topLevelName": "SchoolReference",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[3].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "SchoolReference",
        "descriptorCollectionName": "",
        "fullName": "School",
        "fullNamePreservingPrefix": "School",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": true,
        "metaEdName": "School",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "",
        "topLevelName": "SchoolReference",
      }
    `);
  });
});

describe('when superclass and subclass will have a naming collision issue', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';
  const educationOrganization = 'EducationOrganization';
  const school = 'School';
  const category = 'Category';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartAbstractEntity(educationOrganization)
      .withDocumentation('doc')
      .withIntegerIdentity('Identity', 'doc')
      .withStringProperty(`${educationOrganization}${category}`, 'doc', true, true, '30')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(school, educationOrganization)
      .withDocumentation('doc')
      .withStringProperty(`${school}${category}`, 'doc', true, true, '30')
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have correct regular and collision resolved top level names', () => {
    expect(metaEd.propertyIndex.string).toHaveLength(2);
    const edOrgPropertyApiMapping = metaEd.propertyIndex.string[0].data.edfiApiSchema.apiMapping;
    expect(edOrgPropertyApiMapping.decollisionedTopLevelName).toBe('EducationOrganizationCategories');
    expect(edOrgPropertyApiMapping.topLevelName).toBe('Categories');

    const schoolPropertyApiMapping = metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping;
    expect(schoolPropertyApiMapping.decollisionedTopLevelName).toBe('SchoolCategories');
    expect(schoolPropertyApiMapping.topLevelName).toBe('Categories');
  });
});

describe('when building simple domain entity with common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withCommonProperty('MeetingTime', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('MeetingTime')
      .withIntegerIdentity('StartTime', 'doc')
      .withEndCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be valid', () => {
    expect(metaEd.propertyIndex.common).toHaveLength(1);
    expect(metaEd.propertyIndex.common[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "MeetingTimes",
        "descriptorCollectionName": "",
        "fullName": "MeetingTime",
        "fullNamePreservingPrefix": "MeetingTime",
        "isChoice": false,
        "isCommonCollection": true,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "MeetingTime",
        "metaEdType": "unknown",
        "referenceCollectionName": "",
        "topLevelName": "MeetingTimes",
      }
    `);
  });
});

describe('when building a domain entity with a descriptor collection that meets prefix removal conditions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let gradeLevelDescriptorApiName: any = null;
  let meadowlarkData: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('LearningObjective')
      .withDocumentation('doc')
      .withStringIdentity('LearningObjectiveId', 'doc', '10')
      .withDescriptorProperty('GradeLevel', 'doc', false, true, 'Objective')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);

    meadowlarkData = metaEd.propertyIndex.descriptor[0].data.edfiApiSchema;
  });

  it('should have the prefix removed from the name', () => {
    gradeLevelDescriptorApiName = meadowlarkData.apiMapping.fullName;
    expect(gradeLevelDescriptorApiName).toEqual('GradeLevel');
  });

  it('should have the prefix removed from the top level name', () => {
    gradeLevelDescriptorApiName = meadowlarkData.apiMapping.topLevelName;
    expect(gradeLevelDescriptorApiName).toEqual('GradeLevels');
  });
});

describe('when building a domain entity with a optional collections with prefix of name matching suffix of parent entity name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let assessmentScoreApiName: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ObjectiveAssessment')
      .withDocumentation('doc')
      .withStringIdentity('IdentificationCode', 'doc', '30')
      .withCommonProperty('AssessmentScore', 'doc', false, true)
      .withStringProperty('AssessmentDescription', 'doc', false, true, '100')
      .withIntegerProperty('AssessmentNumber', 'doc', false, true)
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have the prefix removed from AssessmentScore', () => {
    assessmentScoreApiName = metaEd.propertyIndex.common[0].data.edfiApiSchema.apiMapping.fullName;
    expect(assessmentScoreApiName).toEqual('Score');
  });

  it('should have the prefix removed from AssessmentScore top level name', () => {
    assessmentScoreApiName = metaEd.propertyIndex.common[0].data.edfiApiSchema.apiMapping.topLevelName;
    expect(assessmentScoreApiName).toEqual('Scores');
  });

  it('should have the prefix removed from AssessmentDescription', () => {
    assessmentScoreApiName = metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping.fullName;
    expect(assessmentScoreApiName).toEqual('Description');
  });

  it('should have the prefix removed from AssessmentDescription top level name', () => {
    assessmentScoreApiName = metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping.topLevelName;
    expect(assessmentScoreApiName).toEqual('Descriptions');
  });

  it('should have the prefix removed from AssessmentNumber', () => {
    assessmentScoreApiName = metaEd.propertyIndex.integer[0].data.edfiApiSchema.apiMapping.fullName;
    expect(assessmentScoreApiName).toEqual('Number');
  });

  it('should have the prefix removed from AssessmentNumber top level name', () => {
    assessmentScoreApiName = metaEd.propertyIndex.integer[0].data.edfiApiSchema.apiMapping.topLevelName;
    expect(assessmentScoreApiName).toEqual('Numbers');
  });
});

describe('when building a domain entity with a optional collection with prefix of role name matching suffix of parent entity name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let discussionTopicAWithRoleNameApiName: any = null;
  let meadowlarkData: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassDiscussion')
      .withDocumentation('doc')
      .withStringProperty('Topic', 'doc', false, true, '100', '0', 'DiscussionTopicWithRoleName')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);

    meadowlarkData = metaEd.propertyIndex.string[0].data.edfiApiSchema;
  });

  it('should have the prefix removed from the name', () => {
    discussionTopicAWithRoleNameApiName = meadowlarkData.apiMapping.fullName;
    expect(discussionTopicAWithRoleNameApiName).toEqual('TopicWithRoleNameTopic');
  });

  it('should have the prefix removed from the top level name', () => {
    discussionTopicAWithRoleNameApiName = meadowlarkData.apiMapping.topLevelName;
    expect(discussionTopicAWithRoleNameApiName).toEqual('TopicWithRoleNameTopics');
  });
});

describe('when building simple domain entity with inline common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withInlineCommonProperty('MeetingTime', 'doc', false, false)
      .withEndDomainEntity()

      .withStartInlineCommon('MeetingTime')
      .withIntegerIdentity('StartTime', 'doc')
      .withEndInlineCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be valid', () => {
    expect(metaEd.propertyIndex.inlineCommon).toHaveLength(1);
    expect(metaEd.propertyIndex.inlineCommon[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "MeetingTime",
        "descriptorCollectionName": "",
        "fullName": "MeetingTime",
        "fullNamePreservingPrefix": "MeetingTime",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": true,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "MeetingTime",
        "metaEdType": "common",
        "referenceCollectionName": "",
        "topLevelName": "MeetingTime",
      }
    `);
  });
});

describe('when building simple domain entity with inline common with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withInlineCommonProperty('MeetingTime', 'doc', false, false, 'RoleName')
      .withEndDomainEntity()

      .withStartInlineCommon('MeetingTime')
      .withIntegerIdentity('StartTime', 'doc')
      .withEndInlineCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be valid', () => {
    expect(metaEd.propertyIndex.inlineCommon).toHaveLength(1);
    expect(metaEd.propertyIndex.inlineCommon[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "RoleNameMeetingTime",
        "descriptorCollectionName": "",
        "fullName": "RoleNameMeetingTime",
        "fullNamePreservingPrefix": "RoleNameMeetingTime",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": true,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "MeetingTime",
        "metaEdType": "common",
        "referenceCollectionName": "",
        "topLevelName": "RoleNameMeetingTime",
      }
    `);
  });
});

describe('when building simple domain entity with choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withChoiceProperty('MeetingTime', 'doc', false, false)
      .withEndDomainEntity()

      .withStartChoice('MeetingTime')
      .withIntegerIdentity('StartTime', 'doc')
      .withEndChoice()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be valid', () => {
    expect(metaEd.propertyIndex.choice).toHaveLength(1);
    expect(metaEd.propertyIndex.choice[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "MeetingTime",
        "descriptorCollectionName": "",
        "fullName": "MeetingTime",
        "fullNamePreservingPrefix": "MeetingTime",
        "isChoice": true,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "MeetingTime",
        "metaEdType": "choice",
        "referenceCollectionName": "",
        "topLevelName": "MeetingTime",
      }
    `);
  });
});

describe('when building simple domain entity with choice with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withChoiceProperty('MeetingTime', 'doc', false, false, 'RoleName')
      .withEndDomainEntity()

      .withStartChoice('MeetingTime')
      .withIntegerIdentity('StartTime', 'doc')
      .withEndChoice()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be valid', () => {
    expect(metaEd.propertyIndex.choice).toHaveLength(1);
    expect(metaEd.propertyIndex.choice[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "RoleNameMeetingTime",
        "descriptorCollectionName": "",
        "fullName": "RoleNameMeetingTime",
        "fullNamePreservingPrefix": "RoleNameMeetingTime",
        "isChoice": true,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "MeetingTime",
        "metaEdType": "choice",
        "referenceCollectionName": "",
        "topLevelName": "RoleNameMeetingTime",
      }
    `);
  });
});

describe('when building domain entity with role name as prefix name of referenced entity BalanceSheetDimension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ChartOfAccount')
      .withDocumentation('doc')
      .withStringIdentity('IdentityProperty', 'doc', '30')
      .withDomainEntityProperty('BalanceSheetDimension', 'doc', true, false, false, 'BalanceSheet')
      .withEndDomainEntity()

      .withStartDomainEntity('BalanceSheetDimension')
      .withDocumentation('doc')
      .withStringIdentity('IdentityProperty', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should not have BalanceSheet repeated in naming', () => {
    expect(metaEd.propertyIndex.domainEntity).toHaveLength(1);
    expect(metaEd.propertyIndex.domainEntity[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "BalanceSheetDimensionReference",
        "descriptorCollectionName": "",
        "fullName": "BalanceSheetDimension",
        "fullNamePreservingPrefix": "BalanceSheetDimension",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": true,
        "metaEdName": "BalanceSheetDimension",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "",
        "topLevelName": "BalanceSheetDimensionReference",
      }
    `);
  });
});

describe('when building domain entity with scalar collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withStringProperty(`${domainEntityName}SuffixName`, 'doc', true, true, '30')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have fullName and topLevelName with prefix truncated but not decollisionedTopLevelName or fullNamePreservingPrefix', () => {
    expect(metaEd.propertyIndex.string).toHaveLength(2);
    expect(metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "EducationContentSuffixNames",
        "descriptorCollectionName": "",
        "fullName": "SuffixName",
        "fullNamePreservingPrefix": "EducationContentSuffixName",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "EducationContentSuffixName",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "SuffixNames",
      }
    `);
  });
});

describe('when building CommonSubclass with inherited properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon('BaseCommon')
      .withDocumentation('doc')
      .withStringProperty('BaseProperty', 'doc', false, false, '50')
      .withIntegerProperty('BaseIdentifier', 'doc', true, false)
      .withEndCommon()

      .withStartCommonSubclass('StudentCommon', 'BaseCommon')
      .withDocumentation('doc')
      .withStringProperty('StudentSpecificProperty', 'doc', false, false, '30')
      .withBooleanProperty('IsActive', 'doc', false, false)
      .withEndCommonSubclass()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '32')
      .withCommonProperty('StudentCommon', 'doc', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    commonSubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should correctly handle inherited properties from base Common', () => {
    // Test inherited string property from base common
    const inheritedStringProperty = metaEd.propertyIndex.string.find((p) => p.metaEdName === 'BaseProperty');
    expect(inheritedStringProperty?.parentEntity.metaEdName).toBe('BaseCommon');
    expect(inheritedStringProperty?.data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "BaseProperty",
        "descriptorCollectionName": "",
        "fullName": "BaseProperty",
        "fullNamePreservingPrefix": "BaseProperty",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "BaseProperty",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "BaseProperty",
      }
    `);

    // Test inherited integer identity property from base common
    const inheritedIntegerProperty = metaEd.propertyIndex.integer.find((p) => p.metaEdName === 'BaseIdentifier');
    expect(inheritedIntegerProperty?.parentEntity.metaEdName).toBe('BaseCommon');
    expect(inheritedIntegerProperty?.data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "BaseIdentifier",
        "descriptorCollectionName": "",
        "fullName": "BaseIdentifier",
        "fullNamePreservingPrefix": "BaseIdentifier",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "BaseIdentifier",
        "metaEdType": "integer",
        "referenceCollectionName": "",
        "topLevelName": "BaseIdentifier",
      }
    `);

    // Test own property from CommonSubclass
    const ownStringProperty = metaEd.propertyIndex.string.find((p) => p.metaEdName === 'StudentSpecificProperty');
    expect(ownStringProperty?.parentEntity.metaEdName).toBe('StudentCommon');
    expect(ownStringProperty?.data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "StudentSpecificProperty",
        "descriptorCollectionName": "",
        "fullName": "StudentSpecificProperty",
        "fullNamePreservingPrefix": "StudentSpecificProperty",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "StudentSpecificProperty",
        "metaEdType": "string",
        "referenceCollectionName": "",
        "topLevelName": "StudentSpecificProperty",
      }
    `);

    // Test own boolean property from CommonSubclass
    const ownBooleanProperty = metaEd.propertyIndex.boolean.find((p) => p.metaEdName === 'IsActive');
    expect(ownBooleanProperty?.parentEntity.metaEdName).toBe('StudentCommon');
    expect(ownBooleanProperty?.data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "IsActive",
        "descriptorCollectionName": "",
        "fullName": "IsActive",
        "fullNamePreservingPrefix": "IsActive",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "IsActive",
        "metaEdType": "boolean",
        "referenceCollectionName": "",
        "topLevelName": "IsActive",
      }
    `);

    // Test the common property reference in the domain entity
    const commonProperty = metaEd.propertyIndex.common.find((p) => p.metaEdName === 'StudentCommon');
    expect(commonProperty?.parentEntity.metaEdName).toBe('Student');
    expect(commonProperty?.data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "StudentCommon",
        "descriptorCollectionName": "",
        "fullName": "Common",
        "fullNamePreservingPrefix": "StudentCommon",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": true,
        "isScalarReference": false,
        "metaEdName": "StudentCommon",
        "metaEdType": "commonSubclass",
        "referenceCollectionName": "",
        "topLevelName": "Common",
      }
    `);
  });
});

describe('when building comprehensive Address/AddressExtension scenario with CommonExtension via override', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreNamespaceName = 'EdFi';
  const extensionNamespaceName = 'Sample';
  const commonName = 'Address';
  const domainEntityName = 'Student';
  let coreNamespace: any = null;
  let extensionNamespace: any = null;
  const validationFailures: any[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withStringIdentity('City', 'doc', '30')
      .withStringProperty('StreetNumberName', 'doc', true, false, '150')
      .withStringProperty('PostalCode', 'doc', false, false, '17')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '32')
      .withCommonProperty(commonName, 'doc', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartDomainEntityExtension(`${coreNamespaceName}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${coreNamespaceName}.${commonName}`, 'doc', false, true)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${coreNamespaceName}.${commonName}`)
      .withStringProperty('Complex', 'doc', false, false, '30')
      .withBooleanProperty('OnBusRoute', 'doc', true, false)
      .withStringProperty('SchoolDistrict', 'doc', false, true, '250')
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, validationFailures))
      .sendToListener(new CommonBuilder(metaEd, validationFailures))
      .sendToListener(new CommonExtensionBuilder(metaEd, validationFailures));

    coreNamespace = metaEd.namespace.get(coreNamespaceName);
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName);

    // Set up namespace dependencies properly
    extensionNamespace.dependencies.push(coreNamespace ?? newNamespace());

    // Run all enhancers in proper order
    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct apiMapping for common property', () => {
    // Test the common property reference in the domain entity
    const commonProperty = metaEd.propertyIndex.common.find((p) => p.metaEdName === commonName && !p.isExtensionOverride);

    expect(commonProperty?.data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "Addresses",
        "descriptorCollectionName": "",
        "fullName": "Address",
        "fullNamePreservingPrefix": "Address",
        "isChoice": false,
        "isCommonCollection": true,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "Address",
        "metaEdType": "common",
        "referenceCollectionName": "",
        "topLevelName": "Addresses",
      }
    `);
  });

  it('should be correct apiMapping for common extension override property', () => {
    // Test the common property reference in the domain entity
    const commonProperty = metaEd.propertyIndex.common.find((p) => p.metaEdName === commonName && p.isExtensionOverride);

    expect(commonProperty?.data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "Addresses",
        "descriptorCollectionName": "",
        "fullName": "Address",
        "fullNamePreservingPrefix": "Address",
        "isChoice": false,
        "isCommonCollection": true,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": false,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "Address",
        "metaEdType": "common",
        "referenceCollectionName": "",
        "topLevelName": "Addresses",
      }
    `);
  });
});
