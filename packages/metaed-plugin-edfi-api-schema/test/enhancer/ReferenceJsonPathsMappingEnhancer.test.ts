import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  ChoiceBuilder,
  CommonBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DescriptorBuilder,
  EnumerationBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  enumerationReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance } from '../../src/enhancer/ReferenceJsonPathsMappingEnhancer';

describe('when building simple domain entity with all the simple non-collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('OptionalBooleanProperty', 'doc1', false, false)
      .withCurrencyProperty('RequiredCurrencyProperty', 'doc2', true, false)
      .withDecimalProperty('OptionalDecimalProperty', 'doc3', false, false, '2', '1')
      .withDurationProperty('RequiredDurationProperty', 'doc4', true, false)
      .withPercentProperty('OptionalPercentProperty', 'doc5', false, false)
      .withDateProperty('RequiredDateProperty', 'doc6', true, false)
      .withDatetimeProperty('RequiredDatetimeProperty', 'doc7', true, false)
      .withIntegerProperty('RequiredIntegerProperty', 'doc8', true, false, '10', '5')
      .withShortProperty('OptionalShortProperty', 'doc9', false, false)
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withTimeProperty('RequiredTimeProperty', 'doc11', true, false)
      .withEnumerationProperty('SchoolYear', 'doc12', false, false)
      .withYearProperty('OptionalYear', 'doc13', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when building simple domain entity with all the simple collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('OptionalBooleanProperty', 'doc1', false, true)
      .withCurrencyProperty('RequiredCurrencyProperty', 'doc2', true, true)
      .withDecimalProperty('OptionalDecimalProperty', 'doc3', false, true, '2', '1')
      .withDurationProperty('RequiredDurationProperty', 'doc4', true, true)
      .withPercentProperty('OptionalPercentProperty', 'doc5', false, true)
      .withDateProperty('RequiredDateProperty', 'doc6', true, true)
      .withDatetimeProperty('RequiredDatetimeProperty', 'doc7', true, true)
      .withIntegerProperty('RequiredIntegerProperty', 'doc8', true, true, '10', '5')
      .withShortProperty('OptionalShortProperty', 'doc9', false, true)
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withStringProperty('RequiredStringProperty', 'doc11', true, true, '31', '21')
      .withTimeProperty('RequiredTimeProperty', 'doc12', true, true)
      .withEnumerationProperty('SchoolYear', 'doc13', false, true)
      .withYearProperty('OptionalYear', 'doc14', false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when building a domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
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

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": Array [
          Object {
            "identityJsonPath": "$.classPeriodName",
            "referenceJsonPath": "$.classPeriods[*].classPeriodReference.classPeriodName",
          },
          Object {
            "identityJsonPath": "$.schoolReference.schoolId",
            "referenceJsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
          },
        ],
        "CourseOffering": Array [
          Object {
            "identityJsonPath": "$.localCourseCode",
            "referenceJsonPath": "$.courseOfferingReference.localCourseCode",
          },
          Object {
            "identityJsonPath": "$.schoolReference.schoolId",
            "referenceJsonPath": "$.courseOfferingReference.schoolId",
          },
        ],
      }
    `);
  });
});

describe('when building a domain entity referencing CourseOffering with an implicit merge between School and Session.School', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc', '30')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": Array [
          Object {
            "identityJsonPath": "$.localCourseCode",
            "referenceJsonPath": "$.courseOfferingReference.localCourseCode",
          },
          Object {
            "identityJsonPath": "$.schoolReference.schoolId",
            "referenceJsonPath": "$.courseOfferingReference.schoolId",
          },
          Object {
            "identityJsonPath": "$.sessionReference.schoolYear",
            "referenceJsonPath": "$.courseOfferingReference.schoolYear",
          },
          Object {
            "identityJsonPath": "$.sessionReference.sessionName",
            "referenceJsonPath": "$.courseOfferingReference.sessionName",
          },
        ],
      }
    `);
  });

  it('should be correct referenceJsonPathsMapping for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "School": Array [
          Object {
            "identityJsonPath": "$.schoolId",
            "referenceJsonPath": "$.schoolReference.schoolId",
          },
        ],
        "Session": Array [
          Object {
            "identityJsonPath": "$.schoolReference.schoolId",
            "referenceJsonPath": "$.sessionReference.schoolId",
          },
          Object {
            "identityJsonPath": "$.schoolYearTypeReference.schoolYear",
            "referenceJsonPath": "$.sessionReference.schoolYear",
          },
          Object {
            "identityJsonPath": "$.sessionName",
            "referenceJsonPath": "$.sessionReference.sessionName",
          },
        ],
      }
    `);
  });

  it('should be correct referenceJsonPathsMapping for Session', () => {
    const entity = namespace.entity.domainEntity.get('Session');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "School": Array [
          Object {
            "identityJsonPath": "$.schoolId",
            "referenceJsonPath": "$.schoolReference.schoolId",
          },
        ],
      }
    `);
  });

  it('should be correct referenceJsonPathsMapping for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when building domain entity with nested choice and inline commons', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withChoiceProperty('LearningResourceChoice', 'doc', true, false)
      .withStringProperty('RequiredURI', 'doc', true, true, '30')
      .withEndDomainEntity()

      .withStartChoice('LearningResourceChoice')
      .withDocumentation('doc')
      .withStringProperty('LearningResourceMetadataURI', 'doc', true, false, '30')
      .withInlineCommonProperty('LearningResource', 'doc', true, false)
      .withEndChoice()

      .withStartDescriptor('ContentClass')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartInlineCommon('LearningResource')
      .withDocumentation('doc')
      .withStringProperty('Description', 'doc', false, false, '30')
      .withStringProperty('ShortDescription', 'doc', true, false, '30')
      .withDescriptorProperty('ContentClass', 'doc', true, false)
      .withInlineCommonProperty('EducationContentSource', 'doc', false, false, 'DerivativeSource')
      .withEndInlineCommon()

      .withStartInlineCommon('EducationContentSource')
      .withDocumentation('doc')
      .withDomainEntityProperty('EducationContent', 'doc', false, true)
      .withStringProperty('URI', 'doc', false, true, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": Array [
          Object {
            "identityJsonPath": "$.contentIdentifier",
            "referenceJsonPath": "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference.contentIdentifier",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with Association/DomainEntity collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withDomainEntityProperty(`${domainEntityName}SuffixName`, 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity(`${domainEntityName}SuffixName`)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "EducationContentSuffixName": Array [
          Object {
            "identityJsonPath": "$.stringIdentity",
            "referenceJsonPath": "$.educationContentSuffixNames[*].educationContentSuffixNameReference.stringIdentity",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with a descriptor collection with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withDescriptorProperty('GradeLevel', 'doc', false, true, 'Assessed')
      .withEndDomainEntity()

      .withStartDescriptor('GradeLevel')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when building domain entity with a common with a domain entity reference with a role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('ContentStandard', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('ContentStandard')
      .withDocumentation('doc')
      .withStringProperty('Title', 'doc', false, false, '30')
      .withDomainEntityProperty('EducationOrganization', 'doc', false, false, false, 'Mandating')
      .withEndCommon()

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentStandard.MandatingEducationOrganization": Array [
          Object {
            "identityJsonPath": "$.educationOrganizationId",
            "referenceJsonPath": "$.contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with reference to domain entity with school year enumeration as part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentSchoolAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withDomainEntityProperty('Calendar', 'doc', false, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Calendar')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withIdentityProperty('enumeration', 'SchoolYear', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "Calendar": Array [
          Object {
            "identityJsonPath": "$.schoolId",
            "referenceJsonPath": "$.calendarReference.schoolId",
          },
          Object {
            "identityJsonPath": "$.schoolYearTypeReference.schoolYear",
            "referenceJsonPath": "$.calendarReference.schoolYear",
          },
        ],
      }
    `);
  });
});

describe('when building a domain entity referencing another using a shortenTo directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentCompetencyObjective')
      .withDocumentation('doc')
      .withStringIdentity('Identity1', 'doc', '30')
      .withDomainEntityPropertyWithShortenTo(
        'CompetencyObjective',
        'doc',
        true,
        false,
        false,
        'CompetencyObjective',
        'Objective',
      )
      .withEndDomainEntity()

      .withStartDomainEntity('CompetencyObjective')
      .withDocumentation('doc')
      .withStringIdentity('Identity2', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "CompetencyObjective": Array [
          Object {
            "identityJsonPath": "$.identity2",
            "referenceJsonPath": "$.objectiveCompetencyObjectiveReference.identity2",
          },
        ],
      }
    `);
  });
});

describe('when building a domain entity referencing ReportCard referencing GradingPeriod where ReportCard has GradingPeriod role named GradingPeriod', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentAcademicRecord')
      .withDocumentation('doc')
      .withStringIdentity('Term', 'doc', '30')
      .withDomainEntityProperty('ReportCard', 'doc', false, true)
      .withEndDomainEntity()

      .withStartDomainEntity('ReportCard')
      .withDocumentation('doc')
      .withStringIdentity('StudentId', 'doc', '30')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withEndDomainEntity()

      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withStringIdentity('GradingPeriodName', 'doc', '30')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withDescriptorIdentity('GradingPeriod', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()

      .withStartDescriptor('GradingPeriod')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2030')
      .withEndEnumeration()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct referenceJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentAcademicRecord');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ReportCard": Array [
          Object {
            "identityJsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "referenceJsonPath": "$.reportCards[*].reportCardReference.gradingPeriodDescriptor",
          },
          Object {
            "identityJsonPath": "$.gradingPeriodReference.gradingPeriodName",
            "referenceJsonPath": "$.reportCards[*].reportCardReference.gradingPeriodName",
          },
          Object {
            "identityJsonPath": "$.gradingPeriodReference.schoolId",
            "referenceJsonPath": "$.reportCards[*].reportCardReference.gradingPeriodSchoolId",
          },
          Object {
            "identityJsonPath": "$.gradingPeriodReference.schoolYear",
            "referenceJsonPath": "$.reportCards[*].reportCardReference.gradingPeriodSchoolYear",
          },
          Object {
            "identityJsonPath": "$.studentId",
            "referenceJsonPath": "$.reportCards[*].reportCardReference.studentId",
          },
        ],
      }
    `);
  });

  it('should be correct referenceJsonPathsMapping for ReportCard', () => {
    const entity = namespace.entity.domainEntity.get('ReportCard');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "GradingPeriod": Array [
          Object {
            "identityJsonPath": "$.gradingPeriodDescriptor",
            "referenceJsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
          },
          Object {
            "identityJsonPath": "$.gradingPeriodName",
            "referenceJsonPath": "$.gradingPeriodReference.gradingPeriodName",
          },
          Object {
            "identityJsonPath": "$.schoolReference.schoolId",
            "referenceJsonPath": "$.gradingPeriodReference.schoolId",
          },
          Object {
            "identityJsonPath": "$.schoolYearTypeReference.schoolYear",
            "referenceJsonPath": "$.gradingPeriodReference.schoolYear",
          },
        ],
      }
    `);
  });

  it('should be correct referenceJsonPathsMapping for GradingPeriod', () => {
    const entity = namespace.entity.domainEntity.get('GradingPeriod');
    expect(entity.data.edfiApiSchema.referenceJsonPathsMapping).toMatchInlineSnapshot(`
      Object {
        "School": Array [
          Object {
            "identityJsonPath": "$.schoolId",
            "referenceJsonPath": "$.schoolReference.schoolId",
          },
        ],
      }
    `);
  });
});
