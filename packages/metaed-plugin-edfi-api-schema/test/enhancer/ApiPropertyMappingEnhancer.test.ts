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
  ChoiceBuilder,
} from '@edfi/metaed-core';
import {
  choiceReferenceEnhancer,
  domainEntityReferenceEnhancer,
  inlineCommonReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
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
