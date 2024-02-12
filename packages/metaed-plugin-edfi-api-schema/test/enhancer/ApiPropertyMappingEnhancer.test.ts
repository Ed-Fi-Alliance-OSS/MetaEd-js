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
        "decollisionedTopLevelName": "sectionIdentifier",
        "descriptorCollectionName": "",
        "fullName": "sectionIdentifier",
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
        "topLevelName": "sectionIdentifier",
      }
    `);
    expect(metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "localCourseCode",
        "descriptorCollectionName": "",
        "fullName": "localCourseCode",
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
        "topLevelName": "localCourseCode",
      }
    `);
    expect(metaEd.propertyIndex.string[2].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "classPeriodName",
        "descriptorCollectionName": "",
        "fullName": "classPeriodName",
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
        "topLevelName": "classPeriodName",
      }
    `);
    expect(metaEd.propertyIndex.string[3].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "schoolId",
        "descriptorCollectionName": "",
        "fullName": "schoolId",
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
        "topLevelName": "schoolId",
      }
    `);

    expect(metaEd.propertyIndex.domainEntity).toHaveLength(4);
    expect(metaEd.propertyIndex.domainEntity[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "courseOfferingReference",
        "descriptorCollectionName": "",
        "fullName": "courseOffering",
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
        "topLevelName": "courseOfferingReference",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "classPeriods",
        "descriptorCollectionName": "",
        "fullName": "classPeriods",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": true,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "ClassPeriod",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "classPeriodReference",
        "topLevelName": "classPeriods",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[2].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "schoolReference",
        "descriptorCollectionName": "",
        "fullName": "school",
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
        "topLevelName": "schoolReference",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[3].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "schoolReference",
        "descriptorCollectionName": "",
        "fullName": "school",
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
        "topLevelName": "schoolReference",
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
        "decollisionedTopLevelName": "sectionIdentifier",
        "descriptorCollectionName": "",
        "fullName": "sectionIdentifier",
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
        "topLevelName": "sectionIdentifier",
      }
    `);
    expect(metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "localCourseCode",
        "descriptorCollectionName": "",
        "fullName": "localCourseCode",
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
        "topLevelName": "localCourseCode",
      }
    `);
    expect(metaEd.propertyIndex.string[2].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "classPeriodName",
        "descriptorCollectionName": "",
        "fullName": "classPeriodName",
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
        "topLevelName": "classPeriodName",
      }
    `);
    expect(metaEd.propertyIndex.string[3].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "schoolId",
        "descriptorCollectionName": "",
        "fullName": "schoolId",
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
        "topLevelName": "schoolId",
      }
    `);

    expect(metaEd.propertyIndex.domainEntity).toHaveLength(4);
    expect(metaEd.propertyIndex.domainEntity[0].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "courseOfferingReference",
        "descriptorCollectionName": "",
        "fullName": "courseOffering",
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
        "topLevelName": "courseOfferingReference",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[1].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "classPeriods",
        "descriptorCollectionName": "",
        "fullName": "classPeriods",
        "isChoice": false,
        "isCommonCollection": false,
        "isDescriptorCollection": false,
        "isInlineCommon": false,
        "isReferenceCollection": true,
        "isScalarCommon": false,
        "isScalarReference": false,
        "metaEdName": "ClassPeriod",
        "metaEdType": "domainEntity",
        "referenceCollectionName": "classPeriodReference",
        "topLevelName": "classPeriods",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[2].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "schoolReference",
        "descriptorCollectionName": "",
        "fullName": "school",
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
        "topLevelName": "schoolReference",
      }
    `);
    expect(metaEd.propertyIndex.domainEntity[3].data.edfiApiSchema.apiMapping).toMatchInlineSnapshot(`
      Object {
        "decollisionedTopLevelName": "schoolReference",
        "descriptorCollectionName": "",
        "fullName": "school",
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
        "topLevelName": "schoolReference",
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
    expect(edOrgPropertyApiMapping.decollisionedTopLevelName).toBe('educationOrganizationCategories');
    expect(edOrgPropertyApiMapping.topLevelName).toBe('categories');

    const schoolPropertyApiMapping = metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping;
    expect(schoolPropertyApiMapping.decollisionedTopLevelName).toBe('schoolCategories');
    expect(schoolPropertyApiMapping.topLevelName).toBe('categories');
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
        "decollisionedTopLevelName": "meetingTimes",
        "descriptorCollectionName": "",
        "fullName": "meetingTimes",
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
        "topLevelName": "meetingTimes",
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
      .withStringIdentity('LearningObjectiveId', 'doc', '0z41dmrtgsm4wqbwv3k0v5vkbdurrgeu')
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
    expect(gradeLevelDescriptorApiName).toEqual('gradeLevels');
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
    expect(assessmentScoreApiName).toEqual('scores');
  });

  it('should have the prefix removed from AssessmentDescription', () => {
    assessmentScoreApiName = metaEd.propertyIndex.string[1].data.edfiApiSchema.apiMapping.fullName;
    expect(assessmentScoreApiName).toEqual('descriptions');
  });

  it('should have the prefix removed from AssessmentNumber', () => {
    assessmentScoreApiName = metaEd.propertyIndex.integer[0].data.edfiApiSchema.apiMapping.fullName;
    expect(assessmentScoreApiName).toEqual('numbers');
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
    expect(discussionTopicAWithRoleNameApiName).toEqual('topicWithRoleNameTopics');
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
        "decollisionedTopLevelName": "meetingTime",
        "descriptorCollectionName": "",
        "fullName": "meetingTime",
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
        "topLevelName": "meetingTime",
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
        "decollisionedTopLevelName": "roleNameMeetingTime",
        "descriptorCollectionName": "",
        "fullName": "roleNameMeetingTime",
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
        "topLevelName": "roleNameMeetingTime",
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
        "decollisionedTopLevelName": "meetingTime",
        "descriptorCollectionName": "",
        "fullName": "meetingTime",
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
        "topLevelName": "meetingTime",
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
        "decollisionedTopLevelName": "roleNameMeetingTime",
        "descriptorCollectionName": "",
        "fullName": "roleNameMeetingTime",
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
        "topLevelName": "roleNameMeetingTime",
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
        "decollisionedTopLevelName": "balanceSheetDimensionReference",
        "descriptorCollectionName": "",
        "fullName": "balanceSheetDimension",
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
        "topLevelName": "balanceSheetDimensionReference",
      }
    `);
  });
});
