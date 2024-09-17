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
  EnumerationBuilder,
  newPluginEnvironment,
  AssociationBuilder,
  AssociationSubclassBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
  associationSubclassBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as pluginEnvironmentSetupEnhancer } from '../../src/model/PluginEnvironment';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as jsonSchemaEnhancerForInsert } from '../../src/enhancer/JsonSchemaEnhancerForInsert';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance } from '../../src/enhancer/DocumentPathsMappingEnhancer';

const ajv = new Ajv({ allErrors: true });
addFormatsTo(ajv);

function runApiSchemaEnhancers(metaEd: MetaEdEnvironment) {
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  pluginEnvironmentSetupEnhancer(metaEd);
  subclassPropertyNamingCollisionEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);
  jsonSchemaEnhancerForInsert(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  enhance(metaEd);
}

describe('when building simple domain entity with all the simple non-collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Object {
          "isReference": false,
          "path": "$.optionalBooleanProperty",
          "type": "boolean",
        },
        "OptionalDecimalProperty": Object {
          "isReference": false,
          "path": "$.optionalDecimalProperty",
          "type": "number",
        },
        "OptionalPercentProperty": Object {
          "isReference": false,
          "path": "$.optionalPercentProperty",
          "type": "number",
        },
        "OptionalShortProperty": Object {
          "isReference": false,
          "path": "$.optionalShortProperty",
          "type": "number",
        },
        "OptionalYear": Object {
          "isReference": false,
          "path": "$.optionalYear",
          "type": "number",
        },
        "RequiredCurrencyProperty": Object {
          "isReference": false,
          "path": "$.requiredCurrencyProperty",
          "type": "number",
        },
        "RequiredDateProperty": Object {
          "isReference": false,
          "path": "$.requiredDateProperty",
          "type": "date",
        },
        "RequiredDatetimeProperty": Object {
          "isReference": false,
          "path": "$.requiredDatetimeProperty",
          "type": "date-time",
        },
        "RequiredDurationProperty": Object {
          "isReference": false,
          "path": "$.requiredDurationProperty",
          "type": "number",
        },
        "RequiredIntegerProperty": Object {
          "isReference": false,
          "path": "$.requiredIntegerProperty",
          "type": "number",
        },
        "RequiredTimeProperty": Object {
          "isReference": false,
          "path": "$.requiredTimeProperty",
          "type": "time",
        },
        "SchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "Ed-Fi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolYear",
              "referenceJsonPath": "$.schoolYearTypeReference.schoolYear",
              "type": "string",
            },
          ],
          "resourceName": "SchoolYearType",
        },
        "StringIdentity": Object {
          "isReference": false,
          "path": "$.stringIdentity",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building simple domain entity with all the simple collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Object {
          "isReference": false,
          "path": "$.optionalBooleanProperties[*].optionalBooleanProperty",
          "type": "boolean",
        },
        "OptionalDecimalProperty": Object {
          "isReference": false,
          "path": "$.optionalDecimalProperties[*].optionalDecimalProperty",
          "type": "number",
        },
        "OptionalPercentProperty": Object {
          "isReference": false,
          "path": "$.optionalPercentProperties[*].optionalPercentProperty",
          "type": "number",
        },
        "OptionalShortProperty": Object {
          "isReference": false,
          "path": "$.optionalShortProperties[*].optionalShortProperty",
          "type": "number",
        },
        "OptionalYear": Object {
          "isReference": false,
          "path": "$.optionalYears[*].optionalYear",
          "type": "number",
        },
        "RequiredCurrencyProperty": Object {
          "isReference": false,
          "path": "$.requiredCurrencyProperties[*].requiredCurrencyProperty",
          "type": "number",
        },
        "RequiredDateProperty": Object {
          "isReference": false,
          "path": "$.requiredDateProperties[*].requiredDateProperty",
          "type": "date",
        },
        "RequiredDatetimeProperty": Object {
          "isReference": false,
          "path": "$.requiredDatetimeProperties[*].requiredDatetimeProperty",
          "type": "date-time",
        },
        "RequiredDurationProperty": Object {
          "isReference": false,
          "path": "$.requiredDurationProperties[*].requiredDurationProperty",
          "type": "number",
        },
        "RequiredIntegerProperty": Object {
          "isReference": false,
          "path": "$.requiredIntegerProperties[*].requiredIntegerProperty",
          "type": "number",
        },
        "RequiredStringProperty": Object {
          "isReference": false,
          "path": "$.requiredStringProperties[*].requiredStringProperty",
          "type": "string",
        },
        "RequiredTimeProperty": Object {
          "isReference": false,
          "path": "$.requiredTimeProperties[*].requiredTimeProperty",
          "type": "time",
        },
        "SchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "Ed-Fi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolYear",
              "referenceJsonPath": "$.schoolYearTypeReference.schoolYear",
              "type": "string",
            },
          ],
          "resourceName": "SchoolYearType",
        },
        "StringIdentity": Object {
          "isReference": false,
          "path": "$.stringIdentity",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building a domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.classPeriodName",
              "referenceJsonPath": "$.classPeriods[*].classPeriodReference.classPeriodName",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.schoolReference.schoolId",
              "referenceJsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
              "type": "string",
            },
          ],
          "resourceName": "ClassPeriod",
        },
        "CourseOffering": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.localCourseCode",
              "referenceJsonPath": "$.courseOfferingReference.localCourseCode",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.schoolReference.schoolId",
              "referenceJsonPath": "$.courseOfferingReference.schoolId",
              "type": "string",
            },
          ],
          "resourceName": "CourseOffering",
        },
        "SectionIdentifier": Object {
          "isReference": false,
          "path": "$.sectionIdentifier",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building a domain entity referencing CourseOffering with an implicit merge between School and Session.School', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.localCourseCode",
              "referenceJsonPath": "$.courseOfferingReference.localCourseCode",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.schoolReference.schoolId",
              "referenceJsonPath": "$.courseOfferingReference.schoolId",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.sessionReference.schoolId",
              "referenceJsonPath": "$.courseOfferingReference.schoolId",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.sessionReference.schoolYear",
              "referenceJsonPath": "$.courseOfferingReference.schoolYear",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.sessionReference.sessionName",
              "referenceJsonPath": "$.courseOfferingReference.sessionName",
              "type": "string",
            },
          ],
          "resourceName": "CourseOffering",
        },
        "SectionIdentifier": Object {
          "isReference": false,
          "path": "$.sectionIdentifier",
          "type": "string",
        },
      }
    `);
  });

  it('should be correct documentPathsMapping for CourseOffering', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('CourseOffering');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "LocalCourseCode": Object {
          "isReference": false,
          "path": "$.localCourseCode",
          "type": "string",
        },
        "School": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolId",
              "referenceJsonPath": "$.schoolReference.schoolId",
              "type": "string",
            },
          ],
          "resourceName": "School",
        },
        "Session": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolReference.schoolId",
              "referenceJsonPath": "$.sessionReference.schoolId",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.schoolYearTypeReference.schoolYear",
              "referenceJsonPath": "$.sessionReference.schoolYear",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.sessionName",
              "referenceJsonPath": "$.sessionReference.sessionName",
              "type": "string",
            },
          ],
          "resourceName": "Session",
        },
      }
    `);
  });

  it('should be correct documentPathsMapping for Session', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Session');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "School": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolId",
              "referenceJsonPath": "$.schoolReference.schoolId",
              "type": "string",
            },
          ],
          "resourceName": "School",
        },
        "SchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "Ed-Fi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolYear",
              "referenceJsonPath": "$.schoolYearTypeReference.schoolYear",
              "type": "string",
            },
          ],
          "resourceName": "SchoolYearType",
        },
        "SessionName": Object {
          "isReference": false,
          "path": "$.sessionName",
          "type": "string",
        },
      }
    `);
  });

  it('should be correct documentPathsMapping for School', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('School');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "SchoolId": Object {
          "isReference": false,
          "path": "$.schoolId",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building domain entity with nested choice and inline commons', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';

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

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Object {
          "isReference": false,
          "path": "$.contentIdentifier",
          "type": "string",
        },
        "LearningResourceChoice.LearningResource.ContentClassDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "path": "$.contentClassDescriptor",
          "projectName": "EdFi",
          "resourceName": "ContentClassDescriptor",
          "type": "string",
        },
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.contentIdentifier",
              "referenceJsonPath": "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference.contentIdentifier",
              "type": "string",
            },
          ],
          "resourceName": "EducationContent",
        },
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": Object {
          "isReference": false,
          "path": "$.derivativeSourceURIs[*].derivativeSourceURI",
          "type": "string",
        },
        "LearningResourceChoice.LearningResource.Description": Object {
          "isReference": false,
          "path": "$.description",
          "type": "string",
        },
        "LearningResourceChoice.LearningResource.ShortDescription": Object {
          "isReference": false,
          "path": "$.shortDescription",
          "type": "string",
        },
        "LearningResourceChoice.LearningResourceMetadataURI": Object {
          "isReference": false,
          "path": "$.learningResourceMetadataURI",
          "type": "string",
        },
        "RequiredURI": Object {
          "isReference": false,
          "path": "$.requiredURIs[*].requiredURI",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building domain entity with scalar collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
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
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Object {
          "isReference": false,
          "path": "$.contentIdentifier",
          "type": "string",
        },
        "EducationContentSuffixName": Object {
          "isReference": false,
          "path": "$.suffixNames[*].suffixName",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building domain entity with Association/DomainEntity collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';

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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Object {
          "isReference": false,
          "path": "$.contentIdentifier",
          "type": "string",
        },
        "EducationContentSuffixName": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.stringIdentity",
              "referenceJsonPath": "$.educationContentSuffixNames[*].educationContentSuffixNameReference.stringIdentity",
              "type": "string",
            },
          ],
          "resourceName": "EducationContentSuffixName",
        },
      }
    `);
  });
});

describe('when building domain entity with acronym property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'StudentSpecialEducationProgramAssociation';

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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Object {
          "isReference": false,
          "path": "$.contentIdentifier",
          "type": "string",
        },
        "IEPBeginDate": Object {
          "isReference": false,
          "path": "$.iepBeginDate",
          "type": "date-time",
        },
      }
    `);
  });
});

describe('when building domain entity with a simple common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystemDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "path": "$.identificationCodes[*].assessmentIdentificationSystemDescriptor",
          "projectName": "EdFi",
          "resourceName": "AssessmentIdentificationSystemDescriptor",
          "type": "string",
        },
        "AssessmentIdentificationCode.IdentificationCode": Object {
          "isReference": false,
          "path": "$.identificationCodes[*].identificationCode",
          "type": "string",
        },
        "AssessmentIdentifier": Object {
          "isReference": false,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
      }
    `);
  });
});

describe('when building domain entity subclass with common collection and descriptor identity in superclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntitySubclassName = 'CommunityOrganization';

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

    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for domainEntitySubclassName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntitySubclass.get(domainEntitySubclassName);
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": Object {
          "isReference": false,
          "path": "$.communityOrganizationId",
          "type": "number",
        },
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystemDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "path": "$.identificationCodes[*].educationOrganizationIdentificationSystemDescriptor",
          "projectName": "EdFi",
          "resourceName": "EducationOrganizationIdentificationSystemDescriptor",
          "type": "string",
        },
        "EducationOrganizationIdentificationCode.IdentificationCode": Object {
          "isReference": false,
          "path": "$.identificationCodes[*].identificationCode",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building association with a common collection in a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for StudentEducationOrganizationAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.association.get('StudentEducationOrganizationAssociation');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`undefined`);
  });
});

describe('when building domain entity with a descriptor with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevelDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "path": "$.assessedGradeLevelDescriptor",
          "projectName": "EdFi",
          "resourceName": "GradeLevelDescriptor",
          "type": "string",
        },
        "AssessmentIdentifier": Object {
          "isReference": false,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
      }
    `);
  });
});

describe('when building domain entity with a descriptor collection with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevelDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "path": "$.assessedGradeLevels[*].gradeLevelDescriptor",
          "projectName": "EdFi",
          "resourceName": "GradeLevelDescriptor",
          "type": "string",
        },
        "AssessmentIdentifier": Object {
          "isReference": false,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
      }
    `);
  });
});

describe('when building domain entity with a common with a choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    choiceReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Object {
          "isReference": false,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
        "ContentStandard.PublicationDateChoice.PublicationDate": Object {
          "isReference": false,
          "path": "$.contentStandard.publicationDate",
          "type": "string",
        },
        "ContentStandard.PublicationDateChoice.PublicationYear": Object {
          "isReference": false,
          "path": "$.contentStandard.publicationYear",
          "type": "string",
        },
        "ContentStandard.Title": Object {
          "isReference": false,
          "path": "$.contentStandard.title",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building domain entity with a common and a common collection with parent entity prefix', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Object {
          "isReference": false,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
        "AssessmentPeriod.BeginDate": Object {
          "isReference": false,
          "path": "$.period.beginDate",
          "type": "string",
        },
        "AssessmentScore.MinimumScore": Object {
          "isReference": false,
          "path": "$.scores[*].minimumScore",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building domain entity with an all-caps property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Object {
          "isReference": false,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
        "URI": Object {
          "isReference": false,
          "path": "$.uri",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building domain entity with a common with a domain entity reference with a role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Object {
          "isReference": false,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
        "ContentStandard.MandatingEducationOrganization": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.educationOrganizationId",
              "referenceJsonPath": "$.contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
              "type": "number",
            },
          ],
          "resourceName": "EducationOrganization",
        },
        "ContentStandard.Title": Object {
          "isReference": false,
          "path": "$.contentStandard.title",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building domain entity with two school year enumerations, one role named', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    enumerationReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for StudentSchoolAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.association.get('StudentSchoolAssociation');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`undefined`);
  });
});

describe('when building domain entity with reference to domain entity with school year enumeration as part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for StudentSchoolAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.association.get('StudentSchoolAssociation');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`undefined`);
  });
});

describe('when building a schema for StudentCohort', () => {
  // The core problem addressed by this test is in RND-456: The CohortYears schoolYearTypeReference was being interpreted as
  // an integer, rather than as a SchoolYearTypeEnumeration. This test builds the minimum components of
  // studentEducationOrganizationAssociation required to duplicate the issue.

  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for StudentCohort', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentCohort');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "Ed-Fi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolYear",
              "referenceJsonPath": "$.years[*].schoolYearTypeReference.schoolYear",
              "type": "string",
            },
          ],
          "resourceName": "SchoolYearType",
        },
        "StudentUniqueId": Object {
          "isReference": false,
          "path": "$.studentUniqueId",
          "type": "string",
        },
      }
    `);
  });
});

describe('when building a domain entity with an inline common property with a descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

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
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for Section', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Section');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditTypeDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "path": "$.availableCreditTypeDescriptor",
          "projectName": "EdFi",
          "resourceName": "CreditTypeDescriptor",
          "type": "string",
        },
        "SectionIdentifier": Object {
          "isReference": false,
          "path": "$.sectionIdentifier",
          "type": "number",
        },
      }
    `);
  });
});

describe('when building a Domain Entity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withIntegerProperty('SuperclassProperty', 'doc', true, false)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withIntegerProperty('SubclassProperty', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    domainEntitySubclassBaseClassEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for School', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntitySubclass.get('School');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "SchoolId": Object {
          "isReference": false,
          "path": "$.schoolId",
          "type": "number",
        },
        "SubclassProperty": Object {
          "isReference": false,
          "path": "$.subclassProperty",
          "type": "number",
        },
        "SuperclassProperty": Object {
          "isReference": false,
          "path": "$.superclassProperty",
          "type": "number",
        },
      }
    `);
  });
});

describe('when building an Association subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAssociation('GeneralStudentProgramAssociation')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('School', 'doc')
      .withAssociationDomainEntityProperty('Program', 'doc')
      .withIntegerProperty('SuperclassProperty', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass('StudentProgramAssociation', 'GeneralStudentProgramAssociation')
      .withDocumentation('doc')
      .withIntegerProperty('SubclassProperty', 'doc', true, false)
      .withEndAssociationSubclass()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withStringIdentity('SchoolName', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity('Program')
      .withDocumentation('doc')
      .withIntegerIdentity('ProgramId', 'doc')
      .withStringIdentity('ProgramName', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    associationSubclassBaseClassEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for StudentProgramAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.associationSubclass.get('StudentProgramAssociation');
    const documentPathsMapping = entity?.data.edfiApiSchema.documentPathsMapping;
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "Program": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.programId",
              "referenceJsonPath": "$.programReference.programId",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.programName",
              "referenceJsonPath": "$.programReference.programName",
              "type": "string",
            },
          ],
          "resourceName": "Program",
        },
        "School": Object {
          "isDescriptor": false,
          "isReference": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolId",
              "referenceJsonPath": "$.schoolReference.schoolId",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.schoolName",
              "referenceJsonPath": "$.schoolReference.schoolName",
              "type": "string",
            },
          ],
          "resourceName": "School",
        },
        "SubclassProperty": Object {
          "isReference": false,
          "path": "$.subclassProperty",
          "type": "number",
        },
        "SuperclassProperty": Object {
          "isReference": false,
          "path": "$.superclassProperty",
          "type": "number",
        },
      }
    `);
  });
});
