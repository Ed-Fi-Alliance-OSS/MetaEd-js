import Ajv from 'ajv/dist/2020';
import addFormatsTo from 'ajv-formats';
import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  ChoiceBuilder,
  CommonBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntitySubclassBuilder,
  DescriptorBuilder,
  TopLevelEntity,
  EnumerationBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { MetaEdPropertyPath } from '../../src/model/api-schema/MetaEdPropertyPath';
import { JsonPathsInfo } from '../../src/model/JsonPathsMapping';

const ajv = new Ajv({ allErrors: true });
addFormatsTo(ajv);

export type Snapshotable = {
  jsonPaths: { [key: MetaEdPropertyPath]: JsonPathsInfo };
  isTopLevel: { [key: MetaEdPropertyPath]: boolean };
  terminalPropertyFullName: { [key: MetaEdPropertyPath]: string };
};

export function snapshotify(entity: TopLevelEntity | undefined): Snapshotable {
  const { allJsonPathsMapping } = entity?.data.edfiApiSchema as EntityApiSchemaData;

  const jsonPaths = {} as { [key: MetaEdPropertyPath]: JsonPathsInfo };
  const isTopLevel = {} as { [key: MetaEdPropertyPath]: boolean };
  const terminalPropertyFullName = {} as { [key: MetaEdPropertyPath]: string };

  Object.entries(allJsonPathsMapping).forEach(([key, value]) => {
    jsonPaths[key] = value.jsonPaths;
    isTopLevel[key] = value.isTopLevel;
    if (value.isTopLevel) {
      terminalPropertyFullName[key] = value.terminalProperty.fullPropertyName;
    }
  });

  return {
    jsonPaths,
    isTopLevel,
    terminalPropertyFullName,
  };
}

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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Array [
          "$.optionalBooleanProperty",
        ],
        "OptionalDecimalProperty": Array [
          "$.optionalDecimalProperty",
        ],
        "OptionalPercentProperty": Array [
          "$.optionalPercentProperty",
        ],
        "OptionalShortProperty": Array [
          "$.optionalShortProperty",
        ],
        "OptionalYear": Array [
          "$.optionalYear",
        ],
        "RequiredCurrencyProperty": Array [
          "$.requiredCurrencyProperty",
        ],
        "RequiredDateProperty": Array [
          "$.requiredDateProperty",
        ],
        "RequiredDatetimeProperty": Array [
          "$.requiredDatetimeProperty",
        ],
        "RequiredDurationProperty": Array [
          "$.requiredDurationProperty",
        ],
        "RequiredIntegerProperty": Array [
          "$.requiredIntegerProperty",
        ],
        "RequiredTimeProperty": Array [
          "$.requiredTimeProperty",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "StringIdentity": Array [
          "$.stringIdentity",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": true,
        "OptionalDecimalProperty": true,
        "OptionalPercentProperty": true,
        "OptionalShortProperty": true,
        "OptionalYear": true,
        "RequiredCurrencyProperty": true,
        "RequiredDateProperty": true,
        "RequiredDatetimeProperty": true,
        "RequiredDurationProperty": true,
        "RequiredIntegerProperty": true,
        "RequiredTimeProperty": true,
        "SchoolYear": true,
        "StringIdentity": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": "OptionalBooleanProperty",
        "OptionalDecimalProperty": "OptionalDecimalProperty",
        "OptionalPercentProperty": "OptionalPercentProperty",
        "OptionalShortProperty": "OptionalShortProperty",
        "OptionalYear": "OptionalYear",
        "RequiredCurrencyProperty": "RequiredCurrencyProperty",
        "RequiredDateProperty": "RequiredDateProperty",
        "RequiredDatetimeProperty": "RequiredDatetimeProperty",
        "RequiredDurationProperty": "RequiredDurationProperty",
        "RequiredIntegerProperty": "RequiredIntegerProperty",
        "RequiredTimeProperty": "RequiredTimeProperty",
        "SchoolYear": "SchoolYear",
        "StringIdentity": "StringIdentity",
      }
    `);
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Array [
          "$.optionalBooleanProperties[*].optionalBooleanProperty",
        ],
        "OptionalDecimalProperty": Array [
          "$.optionalDecimalProperties[*].optionalDecimalProperty",
        ],
        "OptionalPercentProperty": Array [
          "$.optionalPercentProperties[*].optionalPercentProperty",
        ],
        "OptionalShortProperty": Array [
          "$.optionalShortProperties[*].optionalShortProperty",
        ],
        "OptionalYear": Array [
          "$.optionalYears[*].optionalYear",
        ],
        "RequiredCurrencyProperty": Array [
          "$.requiredCurrencyProperties[*].requiredCurrencyProperty",
        ],
        "RequiredDateProperty": Array [
          "$.requiredDateProperties[*].requiredDateProperty",
        ],
        "RequiredDatetimeProperty": Array [
          "$.requiredDatetimeProperties[*].requiredDatetimeProperty",
        ],
        "RequiredDurationProperty": Array [
          "$.requiredDurationProperties[*].requiredDurationProperty",
        ],
        "RequiredIntegerProperty": Array [
          "$.requiredIntegerProperties[*].requiredIntegerProperty",
        ],
        "RequiredStringProperty": Array [
          "$.requiredStringProperties[*].requiredStringProperty",
        ],
        "RequiredTimeProperty": Array [
          "$.requiredTimeProperties[*].requiredTimeProperty",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "StringIdentity": Array [
          "$.stringIdentity",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": true,
        "OptionalDecimalProperty": true,
        "OptionalPercentProperty": true,
        "OptionalShortProperty": true,
        "OptionalYear": true,
        "RequiredCurrencyProperty": true,
        "RequiredDateProperty": true,
        "RequiredDatetimeProperty": true,
        "RequiredDurationProperty": true,
        "RequiredIntegerProperty": true,
        "RequiredStringProperty": true,
        "RequiredTimeProperty": true,
        "SchoolYear": true,
        "StringIdentity": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": "OptionalBooleanProperty",
        "OptionalDecimalProperty": "OptionalDecimalProperty",
        "OptionalPercentProperty": "OptionalPercentProperty",
        "OptionalShortProperty": "OptionalShortProperty",
        "OptionalYear": "OptionalYear",
        "RequiredCurrencyProperty": "RequiredCurrencyProperty",
        "RequiredDateProperty": "RequiredDateProperty",
        "RequiredDatetimeProperty": "RequiredDatetimeProperty",
        "RequiredDurationProperty": "RequiredDurationProperty",
        "RequiredIntegerProperty": "RequiredIntegerProperty",
        "RequiredStringProperty": "RequiredStringProperty",
        "RequiredTimeProperty": "RequiredTimeProperty",
        "SchoolYear": "SchoolYear",
        "StringIdentity": "StringIdentity",
      }
    `);
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": Array [
          "$.classPeriods[*].classPeriodReference.classPeriodName",
          "$.classPeriods[*].classPeriodReference.schoolId",
        ],
        "ClassPeriod.ClassPeriodName": Array [
          "$.classPeriods[*].classPeriodReference.classPeriodName",
        ],
        "ClassPeriod.School": Array [
          "$.classPeriods[*].classPeriodReference.schoolId",
        ],
        "ClassPeriod.School.SchoolId": Array [
          "$.classPeriods[*].classPeriodReference.schoolId",
        ],
        "CourseOffering": Array [
          "$.courseOfferingReference.localCourseCode",
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.LocalCourseCode": Array [
          "$.courseOfferingReference.localCourseCode",
        ],
        "CourseOffering.School": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.School.SchoolId": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "SectionIdentifier": Array [
          "$.sectionIdentifier",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": true,
        "ClassPeriod.ClassPeriodName": false,
        "ClassPeriod.School": false,
        "ClassPeriod.School.SchoolId": false,
        "CourseOffering": true,
        "CourseOffering.LocalCourseCode": false,
        "CourseOffering.School": false,
        "CourseOffering.School.SchoolId": false,
        "SectionIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": "ClassPeriod",
        "CourseOffering": "CourseOffering",
        "SectionIdentifier": "SectionIdentifier",
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping for DomainEntityName', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": Array [
          "$.courseOfferingReference.localCourseCode",
          "$.courseOfferingReference.schoolId",
          "$.courseOfferingReference.schoolYear",
          "$.courseOfferingReference.sessionName",
        ],
        "CourseOffering.LocalCourseCode": Array [
          "$.courseOfferingReference.localCourseCode",
        ],
        "CourseOffering.School": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.School.SchoolId": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.Session": Array [
          "$.courseOfferingReference.schoolId",
          "$.courseOfferingReference.schoolYear",
          "$.courseOfferingReference.sessionName",
        ],
        "CourseOffering.Session.School": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.Session.School.SchoolId": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.Session.SchoolYear": Array [
          "$.courseOfferingReference.schoolYear",
        ],
        "CourseOffering.Session.SessionName": Array [
          "$.courseOfferingReference.sessionName",
        ],
        "SectionIdentifier": Array [
          "$.sectionIdentifier",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": true,
        "CourseOffering.LocalCourseCode": false,
        "CourseOffering.School": false,
        "CourseOffering.School.SchoolId": false,
        "CourseOffering.Session": false,
        "CourseOffering.Session.School": false,
        "CourseOffering.Session.School.SchoolId": false,
        "CourseOffering.Session.SchoolYear": false,
        "CourseOffering.Session.SessionName": false,
        "SectionIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": "CourseOffering",
        "SectionIdentifier": "SectionIdentifier",
      }
    `);
  });

  it('should be correct allJsonPathsMapping for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "LocalCourseCode": Array [
          "$.localCourseCode",
        ],
        "School": Array [
          "$.schoolReference.schoolId",
        ],
        "School.SchoolId": Array [
          "$.schoolReference.schoolId",
        ],
        "Session": Array [
          "$.sessionReference.schoolId",
          "$.sessionReference.schoolYear",
          "$.sessionReference.sessionName",
        ],
        "Session.School": Array [
          "$.sessionReference.schoolId",
        ],
        "Session.School.SchoolId": Array [
          "$.sessionReference.schoolId",
        ],
        "Session.SchoolYear": Array [
          "$.sessionReference.schoolYear",
        ],
        "Session.SessionName": Array [
          "$.sessionReference.sessionName",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "LocalCourseCode": true,
        "School": true,
        "School.SchoolId": false,
        "Session": true,
        "Session.School": false,
        "Session.School.SchoolId": false,
        "Session.SchoolYear": false,
        "Session.SessionName": false,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "LocalCourseCode": "LocalCourseCode",
        "School": "School",
        "Session": "Session",
      }
    `);
  });

  it('should be correct allJsonPathsMapping for Session', () => {
    const entity = namespace.entity.domainEntity.get('Session');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "School": Array [
          "$.schoolReference.schoolId",
        ],
        "School.SchoolId": Array [
          "$.schoolReference.schoolId",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "SessionName": Array [
          "$.sessionName",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "School": true,
        "School.SchoolId": false,
        "SchoolYear": true,
        "SessionName": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "School": "School",
        "SchoolYear": "SchoolYear",
        "SessionName": "SessionName",
      }
    `);
  });

  it('should be correct allJsonPathsMapping for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "SchoolId": Array [
          "$.schoolId",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "SchoolId": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "SchoolId": "SchoolId",
      }
    `);
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          "$.contentIdentifier",
        ],
        "LearningResourceChoice.LearningResource.ContentClass": Array [
          "$.contentClassDescriptor",
        ],
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": Array [
          "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference.contentIdentifier",
        ],
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent.ContentIdentifier": Array [
          "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference.contentIdentifier",
        ],
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": Array [
          "$.derivativeSourceURIs[*].derivativeSourceURI",
        ],
        "LearningResourceChoice.LearningResource.Description": Array [
          "$.description",
        ],
        "LearningResourceChoice.LearningResource.ShortDescription": Array [
          "$.shortDescription",
        ],
        "LearningResourceChoice.LearningResourceMetadataURI": Array [
          "$.learningResourceMetadataURI",
        ],
        "RequiredURI": Array [
          "$.requiredURIs[*].requiredURI",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": true,
        "LearningResourceChoice.LearningResource.ContentClass": true,
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": true,
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent.ContentIdentifier": false,
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": true,
        "LearningResourceChoice.LearningResource.Description": true,
        "LearningResourceChoice.LearningResource.ShortDescription": true,
        "LearningResourceChoice.LearningResourceMetadataURI": true,
        "RequiredURI": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": "ContentIdentifier",
        "LearningResourceChoice.LearningResource.ContentClass": "ContentClass",
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": "EducationContent",
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": "URI",
        "LearningResourceChoice.LearningResource.Description": "Description",
        "LearningResourceChoice.LearningResource.ShortDescription": "ShortDescription",
        "LearningResourceChoice.LearningResourceMetadataURI": "LearningResourceMetadataURI",
        "RequiredURI": "RequiredURI",
      }
    `);
  });
});

describe('when building domain entity with scalar collection named with prefix of parent entity', () => {
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
      .withStringProperty(`${domainEntityName}SuffixName`, 'doc', true, true, '30')
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          "$.contentIdentifier",
        ],
        "EducationContentSuffixName": Array [
          "$.suffixNames[*].suffixName",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": true,
        "EducationContentSuffixName": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": "ContentIdentifier",
        "EducationContentSuffixName": "EducationContentSuffixName",
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          "$.contentIdentifier",
        ],
        "EducationContentSuffixName": Array [
          "$.educationContentSuffixNames[*].educationContentSuffixNameReference.stringIdentity",
        ],
        "EducationContentSuffixName.StringIdentity": Array [
          "$.educationContentSuffixNames[*].educationContentSuffixNameReference.stringIdentity",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": true,
        "EducationContentSuffixName": true,
        "EducationContentSuffixName.StringIdentity": false,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": "ContentIdentifier",
        "EducationContentSuffixName": "EducationContentSuffixName",
      }
    `);
  });
});

describe('when building domain entity with acronym property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'StudentSpecialEducationProgramAssociation';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withDatetimeIdentity(`IEPBeginDate`, 'doc')
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          "$.contentIdentifier",
        ],
        "IEPBeginDate": Array [
          "$.iepBeginDate",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": true,
        "IEPBeginDate": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": "ContentIdentifier",
        "IEPBeginDate": "IEPBeginDate",
      }
    `);
  });
});

describe('when building domain entity with a simple common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('AssessmentIdentificationCode', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('AssessmentIdentificationCode')
      .withDocumentation('doc')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDescriptorIdentity('AssessmentIdentificationSystem', 'doc')
      .withEndCommon()

      .withStartDescriptor('AssessmentIdentificationSystem')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystem": Array [
          "$.identificationCodes[*].assessmentIdentificationSystemDescriptor",
        ],
        "AssessmentIdentificationCode.IdentificationCode": Array [
          "$.identificationCodes[*].identificationCode",
        ],
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystem": true,
        "AssessmentIdentificationCode.IdentificationCode": true,
        "AssessmentIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystem": "AssessmentIdentificationSystem",
        "AssessmentIdentificationCode.IdentificationCode": "IdentificationCode",
        "AssessmentIdentifier": "AssessmentIdentifier",
      }
    `);
  });
});

describe('when building domain entity subclass with common collection and descriptor identity in superclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntitySubclassName = 'CommunityOrganization';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withCommonProperty('EducationOrganizationIdentificationCode', 'doc', false, true)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('CommunityOrganizationId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withStartCommon('EducationOrganizationIdentificationCode')
      .withDocumentation('doc')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDescriptorIdentity('EducationOrganizationIdentificationSystem', 'doc')
      .withEndCommon()

      .withStartDescriptor('EducationOrganizationIdentificationSystem')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    subclassPropertyNamingCollisionEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    subclassPropertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    subclassApiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": Array [
          "$.communityOrganizationId",
        ],
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystem": Array [
          "$.identificationCodes[*].educationOrganizationIdentificationSystemDescriptor",
        ],
        "EducationOrganizationIdentificationCode.IdentificationCode": Array [
          "$.identificationCodes[*].identificationCode",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": true,
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystem": true,
        "EducationOrganizationIdentificationCode.IdentificationCode": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": "CommunityOrganizationId",
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystem": "EducationOrganizationIdentificationSystem",
        "EducationOrganizationIdentificationCode.IdentificationCode": "IdentificationCode",
      }
    `);
  });
});

describe('when building association with a common collection in a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentEducationOrganizationAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withCommonProperty('Address', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('Address')
      .withDocumentation('doc')
      .withStringProperty('StreetNumberName', 'doc', true, false, '30')
      .withCommonProperty('Period', 'doc', false, true)
      .withEndCommon()

      .withStartCommon('Period')
      .withDocumentation('doc')
      .withIntegerIdentity('BeginDate', 'doc')
      .withIntegerProperty('EndDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "Address.Period.BeginDate": Array [
          "$.addresses[*].periods[*].beginDate",
        ],
        "Address.Period.EndDate": Array [
          "$.addresses[*].periods[*].endDate",
        ],
        "Address.StreetNumberName": Array [
          "$.addresses[*].streetNumberName",
        ],
        "StudentId": Array [
          "$.studentId",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "Address.Period.BeginDate": true,
        "Address.Period.EndDate": true,
        "Address.StreetNumberName": true,
        "StudentId": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "Address.Period.BeginDate": "BeginDate",
        "Address.Period.EndDate": "EndDate",
        "Address.StreetNumberName": "StreetNumberName",
        "StudentId": "StudentId",
      }
    `);
  });
});

describe('when building domain entity with a descriptor with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withDescriptorProperty('GradeLevel', 'doc', false, false, 'Assessed')
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": Array [
          "$.assessedGradeLevelDescriptor",
        ],
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": true,
        "AssessmentIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": "AssessedGradeLevel",
        "AssessmentIdentifier": "AssessmentIdentifier",
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": Array [
          "$.assessedGradeLevels[*].gradeLevelDescriptor",
        ],
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": true,
        "AssessmentIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": "AssessedGradeLevel",
        "AssessmentIdentifier": "AssessmentIdentifier",
      }
    `);
  });
});

describe('when building domain entity with a common with a choice', () => {
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
      .withChoiceProperty('PublicationDateChoice', 'doc', false, false)
      .withEndCommon()

      .withStartChoice('PublicationDateChoice')
      .withDocumentation('doc')
      .withStringProperty('PublicationDate', 'doc', true, false, '30')
      .withStringProperty('PublicationYear', 'doc', true, false, '30')
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    choiceReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
        "ContentStandard.PublicationDateChoice.PublicationDate": Array [
          "$.contentStandard.publicationDate",
        ],
        "ContentStandard.PublicationDateChoice.PublicationYear": Array [
          "$.contentStandard.publicationYear",
        ],
        "ContentStandard.Title": Array [
          "$.contentStandard.title",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": true,
        "ContentStandard.PublicationDateChoice.PublicationDate": true,
        "ContentStandard.PublicationDateChoice.PublicationYear": true,
        "ContentStandard.Title": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": "AssessmentIdentifier",
        "ContentStandard.PublicationDateChoice.PublicationDate": "PublicationDate",
        "ContentStandard.PublicationDateChoice.PublicationYear": "PublicationYear",
        "ContentStandard.Title": "Title",
      }
    `);
  });
});

describe('when building domain entity with a common and a common collection with parent entity prefix', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('AssessmentScore', 'doc', true, true)
      .withCommonProperty('AssessmentPeriod', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('AssessmentScore')
      .withDocumentation('doc')
      .withStringProperty('MinimumScore', 'doc', true, false, '30')
      .withEndCommon()

      .withStartCommon('AssessmentPeriod')
      .withDocumentation('doc')
      .withStringProperty('BeginDate', 'doc', false, false, '30')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
        "AssessmentPeriod.BeginDate": Array [
          "$.period.beginDate",
        ],
        "AssessmentScore.MinimumScore": Array [
          "$.scores[*].minimumScore",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": true,
        "AssessmentPeriod.BeginDate": true,
        "AssessmentScore.MinimumScore": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": "AssessmentIdentifier",
        "AssessmentPeriod.BeginDate": "BeginDate",
        "AssessmentScore.MinimumScore": "MinimumScore",
      }
    `);
  });
});

describe('when building domain entity with an all-caps property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withStringProperty('URI', 'doc', false, false, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
        "URI": Array [
          "$.uri",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": true,
        "URI": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": "AssessmentIdentifier",
        "URI": "URI",
      }
    `);
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
        "ContentStandard.MandatingEducationOrganization": Array [
          "$.contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
        ],
        "ContentStandard.MandatingEducationOrganization.EducationOrganizationId": Array [
          "$.contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
        ],
        "ContentStandard.Title": Array [
          "$.contentStandard.title",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": true,
        "ContentStandard.MandatingEducationOrganization": true,
        "ContentStandard.MandatingEducationOrganization.EducationOrganizationId": false,
        "ContentStandard.Title": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": "AssessmentIdentifier",
        "ContentStandard.MandatingEducationOrganization": "MandatingEducationOrganization",
        "ContentStandard.Title": "Title",
      }
    `);
  });
});

describe('when building domain entity with two school year enumerations, one role named', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentSchoolAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEnumerationProperty('SchoolYear', 'doc', false, false)
      .withEnumerationProperty('SchoolYear', 'doc', false, false, 'ClassOf')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    enumerationReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ClassOfSchoolYear": Array [
          "$.classOfSchoolYearTypeReference.schoolYear",
        ],
        "SchoolId": Array [
          "$.schoolId",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ClassOfSchoolYear": true,
        "SchoolId": true,
        "SchoolYear": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ClassOfSchoolYear": "ClassOfSchoolYear",
        "SchoolId": "SchoolId",
        "SchoolYear": "SchoolYear",
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
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "Calendar": Array [
          "$.calendarReference.schoolId",
          "$.calendarReference.schoolYear",
        ],
        "Calendar.SchoolId": Array [
          "$.calendarReference.schoolId",
        ],
        "Calendar.SchoolYear": Array [
          "$.calendarReference.schoolYear",
        ],
        "SchoolId": Array [
          "$.schoolId",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "Calendar": true,
        "Calendar.SchoolId": false,
        "Calendar.SchoolYear": false,
        "SchoolId": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "Calendar": "Calendar",
        "SchoolId": "SchoolId",
      }
    `);
  });
});

describe('when building a descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor('GradeLevel')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));
    namespace = metaEd.namespace.get(namespaceName);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.descriptor.get('GradeLevel');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`Object {}`);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`Object {}`);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when building a school year enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.schoolYearEnumeration.get('SchoolYear');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`Object {}`);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`Object {}`);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when building a schema for studentEducationOrganizationAssociation', () => {
  // The core problem addressed by this test is in RND-456: The CohortYears schoolYearTypeReference was being interpreted as
  // an integer, rather than as a SchoolYearTypeEnumeration. This test builds the minimum components of
  // studentEducationOrganizationAssociation required to duplicate the issue.

  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('StudentCohort')
      .withDocumentation('doc')
      .withCommonProperty('CohortYear', '', false, true)
      .withStringIdentity('StudentUniqueId', '', '100')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()

      .withStartCommon('CohortYear')
      .withDocumentation('doc')
      .withEnumerationIdentity('SchoolYear', '')
      .withEndCommon()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentCohort');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": Array [
          "$.years[*].schoolYearTypeReference.schoolYear",
        ],
        "StudentUniqueId": Array [
          "$.studentUniqueId",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": true,
        "StudentUniqueId": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": "SchoolYear",
        "StudentUniqueId": "StudentUniqueId",
      }
    `);
  });
});

describe('when building a domain entity with an inline common property with a descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Section')
      .withDocumentation('Documentation')
      .withIntegerIdentity('SectionIdentifier', 'Documentation')
      .withInlineCommonProperty('Credits', 'Documentation', false, false, 'Available')
      .withEndDomainEntity()

      .withStartInlineCommon('Credits')
      .withDocumentation('Documentation')
      .withDescriptorProperty('CreditType', 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartDescriptor('CreditType')
      .withDocumentation('Documentation')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct allJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Section');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditType": Array [
          "$.availableCreditTypeDescriptor",
        ],
        "SectionIdentifier": Array [
          "$.sectionIdentifier",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditType": true,
        "SectionIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditType": "CreditType",
        "SectionIdentifier": "SectionIdentifier",
      }
    `);
  });
});
