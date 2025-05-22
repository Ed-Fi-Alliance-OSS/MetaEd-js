// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
  associationReferenceEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from '../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { removeSourcePropertyFromDocumentPathsMapping } from '../../src/enhancer/ApiSchemaBuildingEnhancer';

const ajv = new Ajv({ allErrors: true });
addFormatsTo(ajv);

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
  mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
  jsonSchemaForInsertEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeJsonPathsMappingEnhancer(metaEd);
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalBooleanProperty",
          "type": "boolean",
        },
        "OptionalDecimalProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalDecimalProperty",
          "type": "number",
        },
        "OptionalPercentProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalPercentProperty",
          "type": "number",
        },
        "OptionalShortProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalShortProperty",
          "type": "number",
        },
        "OptionalYear": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalYear",
          "type": "number",
        },
        "RequiredCurrencyProperty": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.requiredCurrencyProperty",
          "type": "number",
        },
        "RequiredDateProperty": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.requiredDateProperty",
          "type": "date",
        },
        "RequiredDatetimeProperty": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.requiredDatetimeProperty",
          "type": "date-time",
        },
        "RequiredDurationProperty": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.requiredDurationProperty",
          "type": "number",
        },
        "RequiredIntegerProperty": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.requiredIntegerProperty",
          "type": "number",
        },
        "RequiredTimeProperty": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.requiredTimeProperty",
          "type": "time",
        },
        "SchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
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
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalBooleanProperties[*].optionalBooleanProperty",
          "type": "boolean",
        },
        "OptionalDecimalProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalDecimalProperties[*].optionalDecimalProperty",
          "type": "number",
        },
        "OptionalPercentProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalPercentProperties[*].optionalPercentProperty",
          "type": "number",
        },
        "OptionalShortProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalShortProperties[*].optionalShortProperty",
          "type": "number",
        },
        "OptionalYear": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.optionalYears[*].optionalYear",
          "type": "number",
        },
        "RequiredCurrencyProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.requiredCurrencyProperties[*].requiredCurrencyProperty",
          "type": "number",
        },
        "RequiredDateProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.requiredDateProperties[*].requiredDateProperty",
          "type": "date",
        },
        "RequiredDatetimeProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.requiredDatetimeProperties[*].requiredDatetimeProperty",
          "type": "date-time",
        },
        "RequiredDurationProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.requiredDurationProperties[*].requiredDurationProperty",
          "type": "number",
        },
        "RequiredIntegerProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.requiredIntegerProperties[*].requiredIntegerProperty",
          "type": "number",
        },
        "RequiredStringProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.requiredStringProperties[*].requiredStringProperty",
          "type": "string",
        },
        "RequiredTimeProperty": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.requiredTimeProperties[*].requiredTimeProperty",
          "type": "time",
        },
        "SchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
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
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
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
          "isRequired": true,
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
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
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
          "isRequired": true,
          "path": "$.sectionIdentifier",
          "type": "string",
        },
      }
    `);
  });

  it('should be correct documentPathsMapping for CourseOffering', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('CourseOffering');
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "LocalCourseCode": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.localCourseCode",
          "type": "string",
        },
        "School": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
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
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "School": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
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
          "isRequired": true,
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
          "isRequired": true,
          "path": "$.sessionName",
          "type": "string",
        },
      }
    `);
  });

  it('should be correct documentPathsMapping for School', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('School');
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "SchoolId": Object {
          "isReference": false,
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.contentIdentifier",
          "type": "string",
        },
        "LearningResourceChoice.LearningResource.ContentClassDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "isRequired": true,
          "path": "$.contentClassDescriptor",
          "projectName": "EdFi",
          "resourceName": "ContentClassDescriptor",
          "type": "string",
        },
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
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
          "isRequired": false,
          "path": "$.derivativeSourceURIs[*].derivativeSourceURI",
          "type": "string",
        },
        "LearningResourceChoice.LearningResource.Description": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.description",
          "type": "string",
        },
        "LearningResourceChoice.LearningResource.ShortDescription": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.shortDescription",
          "type": "string",
        },
        "LearningResourceChoice.LearningResourceMetadataURI": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.learningResourceMetadataURI",
          "type": "string",
        },
        "RequiredURI": Object {
          "isReference": false,
          "isRequired": false,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.contentIdentifier",
          "type": "string",
        },
        "EducationContentSuffixName": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.suffixNames[*].educationContentSuffixName",
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.contentIdentifier",
          "type": "string",
        },
        "EducationContentSuffixName": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.contentIdentifier",
          "type": "string",
        },
        "IEPBeginDate": Object {
          "isReference": false,
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystemDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "isRequired": true,
          "path": "$.identificationCodes[*].assessmentIdentificationSystemDescriptor",
          "projectName": "EdFi",
          "resourceName": "AssessmentIdentificationSystemDescriptor",
          "type": "string",
        },
        "AssessmentIdentificationCode.IdentificationCode": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.identificationCodes[*].identificationCode",
          "type": "string",
        },
        "AssessmentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.communityOrganizationId",
          "type": "number",
        },
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystemDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "isRequired": true,
          "path": "$.identificationCodes[*].educationOrganizationIdentificationSystemDescriptor",
          "projectName": "EdFi",
          "resourceName": "EducationOrganizationIdentificationSystemDescriptor",
          "type": "string",
        },
        "EducationOrganizationIdentificationCode.IdentificationCode": Object {
          "isReference": false,
          "isRequired": true,
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
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "Address.Period.BeginDate": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.addresses[*].periods[*].beginDate",
          "type": "number",
        },
        "Address.Period.EndDate": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.addresses[*].periods[*].endDate",
          "type": "number",
        },
        "Address.StreetNumberName": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.addresses[*].streetNumberName",
          "type": "string",
        },
        "StudentId": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.studentId",
          "type": "number",
        },
      }
    `);
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevelDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "isRequired": false,
          "path": "$.assessedGradeLevelDescriptor",
          "projectName": "EdFi",
          "resourceName": "GradeLevelDescriptor",
          "type": "string",
        },
        "AssessmentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevelDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "isRequired": false,
          "path": "$.assessedGradeLevels[*].gradeLevelDescriptor",
          "projectName": "EdFi",
          "resourceName": "GradeLevelDescriptor",
          "type": "string",
        },
        "AssessmentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
        "ContentStandard.PublicationDateChoice.PublicationDate": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.contentStandard.publicationDate",
          "type": "string",
        },
        "ContentStandard.PublicationDateChoice.PublicationYear": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.contentStandard.publicationYear",
          "type": "string",
        },
        "ContentStandard.Title": Object {
          "isReference": false,
          "isRequired": false,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
        "AssessmentPeriod.BeginDate": Object {
          "isReference": false,
          "isRequired": false,
          "path": "$.period.beginDate",
          "type": "string",
        },
        "AssessmentScore.MinimumScore": Object {
          "isReference": false,
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
        "URI": Object {
          "isReference": false,
          "isRequired": false,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.assessmentIdentifier",
          "type": "number",
        },
        "ContentStandard.MandatingEducationOrganization": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
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
          "isRequired": false,
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
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentSchoolAssociation');
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "ClassOfSchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
          "projectName": "Ed-Fi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolYear",
              "referenceJsonPath": "$.classOfSchoolYearTypeReference.schoolYear",
              "type": "string",
            },
          ],
          "resourceName": "SchoolYearType",
        },
        "SchoolId": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.schoolId",
          "type": "number",
        },
        "SchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
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
      }
    `);
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
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentSchoolAssociation');
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "Calendar": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.schoolId",
              "referenceJsonPath": "$.calendarReference.schoolId",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.schoolYearTypeReference.schoolYear",
              "referenceJsonPath": "$.calendarReference.schoolYear",
              "type": "string",
            },
          ],
          "resourceName": "Calendar",
        },
        "SchoolId": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.schoolId",
          "type": "number",
        },
      }
    `);
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
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
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditTypeDescriptor": Object {
          "isDescriptor": true,
          "isReference": true,
          "isRequired": false,
          "path": "$.availableCreditTypeDescriptor",
          "projectName": "EdFi",
          "resourceName": "CreditTypeDescriptor",
          "type": "string",
        },
        "SectionIdentifier": Object {
          "isReference": false,
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "SchoolId": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.schoolId",
          "type": "number",
        },
        "SubclassProperty": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.subclassProperty",
          "type": "number",
        },
        "SuperclassProperty": Object {
          "isReference": false,
          "isRequired": true,
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
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "Program": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
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
          "isRequired": true,
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
          "isRequired": true,
          "path": "$.subclassProperty",
          "type": "number",
        },
        "SuperclassProperty": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.superclassProperty",
          "type": "number",
        },
      }
    `);
  });
});

describe('when a collection reference is to a role named resource that has a schoolid merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'ReportCard';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('ReportCardIdentity', 'doc')
      .withDomainEntityProperty('Grade', 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity('Grade')
      .withDocumentation('doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withMergeDirective('GradingPeriod.School', 'StudentSectionAssociation.Section.CourseOffering.Session.School')
      .withMergeDirective('GradingPeriod.SchoolYear', 'StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear')
      .withAssociationIdentity('StudentSectionAssociation', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withMergeDirective('School', 'Session.School')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartAssociation('StudentSectionAssociation')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withDomainEntityIdentity('Section', 'doc')
      .withEndAssociation()

      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withIntegerIdentity('GradingPeriodIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping for ReportCard', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "Grade": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": false,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.gradingPeriodReference.gradingPeriodIdentity",
              "referenceJsonPath": "$.grades[*].gradeReference.gradingPeriodIdentity",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.gradingPeriodReference.schoolId",
              "referenceJsonPath": "$.grades[*].gradeReference.schoolId",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.gradingPeriodReference.schoolYear",
              "referenceJsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolYear",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.studentSectionAssociationReference.schoolId",
              "referenceJsonPath": "$.grades[*].gradeReference.schoolId",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.studentSectionAssociationReference.schoolYear",
              "referenceJsonPath": "$.grades[*].gradeReference.schoolYear",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.studentSectionAssociationReference.studentId",
              "referenceJsonPath": "$.grades[*].gradeReference.studentId",
              "type": "number",
            },
          ],
          "resourceName": "Grade",
        },
        "ReportCardIdentity": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.reportCardIdentity",
          "type": "number",
        },
      }
    `);
  });
});

describe('when a reference is to a resource that has a reference with two identity properties merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'SurveySectionResponseEducationOrganizationTargetAssociation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('SSREOTAIdentity', 'doc')
      .withDomainEntityProperty('SurveySectionResponse', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('SurveySectionResponse')
      .withDocumentation('doc')
      .withIntegerIdentity('SSRIdentity', 'doc')
      .withDomainEntityIdentity('SurveySection', 'doc')
      .withDomainEntityIdentity('SurveyResponse', 'doc')
      .withMergeDirective('SurveyResponse.Survey', 'SurveySection.Survey')
      .withEndDomainEntity()

      .withStartDomainEntity('SurveySection')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveySectionIdentity', 'doc')
      .withDomainEntityIdentity('Survey', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('SurveyResponse')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveyResponseIdentity', 'doc')
      .withDomainEntityIdentity('Survey', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Survey')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveyIdentifier', 'doc')
      .withIntegerIdentity('Namespace', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "SSREOTAIdentity": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.ssreotaIdentity",
          "type": "number",
        },
        "SurveySectionResponse": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.ssrIdentity",
              "referenceJsonPath": "$.surveySectionResponseReference.ssrIdentity",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveyResponseReference.namespace",
              "referenceJsonPath": "$.surveySectionResponseReference.namespace",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveyResponseReference.surveyIdentifier",
              "referenceJsonPath": "$.surveySectionResponseReference.surveyIdentifier",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveyResponseReference.surveyResponseIdentity",
              "referenceJsonPath": "$.surveySectionResponseReference.surveyResponseIdentity",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveySectionReference.namespace",
              "referenceJsonPath": "$.surveySectionResponseReference.namespace",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveySectionReference.surveyIdentifier",
              "referenceJsonPath": "$.surveySectionResponseReference.surveyIdentifier",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveySectionReference.surveySectionIdentity",
              "referenceJsonPath": "$.surveySectionResponseReference.surveySectionIdentity",
              "type": "number",
            },
          ],
          "resourceName": "SurveySectionResponse",
        },
      }
    `);
  });
});

describe('when a reference is to a resource that has two identity properties directly merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'SurveySectionResponseEducationOrganizationTargetAssociation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('SSREOTAIdentity', 'doc')
      .withDomainEntityProperty('SurveySectionResponse', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('SurveySectionResponse')
      .withDocumentation('doc')
      .withIntegerIdentity('SSRIdentity', 'doc')
      .withDomainEntityIdentity('SurveySection', 'doc')
      .withDomainEntityIdentity('SurveyResponse', 'doc')
      .withMergeDirective('SurveyResponse.Survey.SurveyIdentifier', 'SurveySection.Survey.SurveyIdentifier')
      .withMergeDirective('SurveyResponse.Survey.Namespace', 'SurveySection.Survey.Namespace')
      .withEndDomainEntity()

      .withStartDomainEntity('SurveySection')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveySectionIdentity', 'doc')
      .withDomainEntityIdentity('Survey', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('SurveyResponse')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveyResponseIdentity', 'doc')
      .withDomainEntityIdentity('Survey', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Survey')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveyIdentifier', 'doc')
      .withIntegerIdentity('Namespace', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "SSREOTAIdentity": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.ssreotaIdentity",
          "type": "number",
        },
        "SurveySectionResponse": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.ssrIdentity",
              "referenceJsonPath": "$.surveySectionResponseReference.ssrIdentity",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveyResponseReference.namespace",
              "referenceJsonPath": "$.surveySectionResponseReference.namespace",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveyResponseReference.surveyIdentifier",
              "referenceJsonPath": "$.surveySectionResponseReference.surveyIdentifier",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveyResponseReference.surveyResponseIdentity",
              "referenceJsonPath": "$.surveySectionResponseReference.surveyResponseIdentity",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveySectionReference.namespace",
              "referenceJsonPath": "$.surveySectionResponseReference.namespace",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveySectionReference.surveyIdentifier",
              "referenceJsonPath": "$.surveySectionResponseReference.surveyIdentifier",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.surveySectionReference.surveySectionIdentity",
              "referenceJsonPath": "$.surveySectionResponseReference.surveySectionIdentity",
              "type": "number",
            },
          ],
          "resourceName": "SurveySectionResponse",
        },
      }
    `);
  });
});

describe('when a reference is to a resource that merges on a descriptor (TPDM example)', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'EvaluationObjectiveRating';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EvaluationObjectiveRatingIdentity', 'doc')
      .withDomainEntityProperty('EvaluationRating', 'doc', true, false)
      .withMergeDirective('EvaluationRating.Evaluation.EvaluationTitle', 'EvaluationObjective.Evaluation.EvaluationTitle')
      .withDomainEntityProperty('EvaluationObjective', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('EvaluationRating')
      .withDocumentation('doc')
      .withIntegerIdentity('EvaluationRatingIdentity', 'doc')
      .withDomainEntityIdentity('Evaluation', 'doc')
      .withDomainEntityIdentity('PerformanceEvaluationRating', 'doc')
      .withMergeDirective(
        'PerformanceEvaluationRating.PerformanceEvaluation.PerformanceEvaluationType',
        'Evaluation.PerformanceEvaluation.PerformanceEvaluationType',
      )
      .withEndDomainEntity()

      .withStartDomainEntity('Evaluation')
      .withDocumentation('doc')
      .withIntegerIdentity('EvaluationTitle', 'doc')
      .withDomainEntityIdentity('PerformanceEvaluation', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('PerformanceEvaluationRating')
      .withDocumentation('doc')
      .withIntegerIdentity('PerformanceEvaluationRatingIdentity', 'doc')
      .withDomainEntityIdentity('PerformanceEvaluation', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('PerformanceEvaluation')
      .withDocumentation('doc')
      .withDescriptorIdentity('PerformanceEvaluationType', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('EvaluationObjective')
      .withDocumentation('doc')
      .withIntegerIdentity('EvaluationObjectiveIdentity', 'doc')
      .withDomainEntityIdentity('Evaluation', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('PerformanceEvaluationType')
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct documentPathsMapping', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
      entity?.data.edfiApiSchema.documentPathsMapping,
    );
    expect(documentPathsMapping).toMatchInlineSnapshot(`
      Object {
        "EvaluationObjective": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.evaluationObjectiveIdentity",
              "referenceJsonPath": "$.evaluationObjectiveReference.evaluationObjectiveIdentity",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.evaluationReference.evaluationTitle",
              "referenceJsonPath": "$.evaluationObjectiveReference.evaluationTitle",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.evaluationReference.performanceEvaluationTypeDescriptor",
              "referenceJsonPath": "$.evaluationObjectiveReference.performanceEvaluationTypeDescriptor",
              "type": "string",
            },
          ],
          "resourceName": "EvaluationObjective",
        },
        "EvaluationObjectiveRatingIdentity": Object {
          "isReference": false,
          "isRequired": true,
          "path": "$.evaluationObjectiveRatingIdentity",
          "type": "number",
        },
        "EvaluationRating": Object {
          "isDescriptor": false,
          "isReference": true,
          "isRequired": true,
          "projectName": "EdFi",
          "referenceJsonPaths": Array [
            Object {
              "identityJsonPath": "$.evaluationRatingIdentity",
              "referenceJsonPath": "$.evaluationRatingReference.evaluationRatingIdentity",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.evaluationReference.evaluationTitle",
              "referenceJsonPath": "$.evaluationRatingReference.evaluationTitle",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.evaluationReference.performanceEvaluationTypeDescriptor",
              "referenceJsonPath": "$.evaluationRatingReference.performanceEvaluationTypeDescriptor",
              "type": "string",
            },
            Object {
              "identityJsonPath": "$.performanceEvaluationRatingReference.performanceEvaluationRatingIdentity",
              "referenceJsonPath": "$.evaluationRatingReference.performanceEvaluationRatingIdentity",
              "type": "number",
            },
            Object {
              "identityJsonPath": "$.performanceEvaluationRatingReference.performanceEvaluationTypeDescriptor",
              "referenceJsonPath": "$.evaluationRatingReference.performanceEvaluationTypeDescriptor",
              "type": "string",
            },
          ],
          "resourceName": "EvaluationRating",
        },
      }
    `);
  });
});

describe(
  'when building association with domain entity with two entities, one with role named educationOrganization and' +
    ' one with non role named educationOrganization ',
  () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartAssociation('StudentAssessmentRegistrationBatteryPartAssociation')
        .withDocumentation('doc')
        .withAssociationDomainEntityProperty('StudentAssessmentRegistration', 'doc')
        .withAssociationDomainEntityProperty('UnusedEntity', 'doc')
        .withEndAssociation()

        .withStartDomainEntity('StudentAssessmentRegistration')
        .withDocumentation('doc')
        .withDomainEntityIdentity('AssessmentAdministration', 'doc')
        .withAssociationIdentity('StudentEducationOrganizationAssociation', 'doc')
        .withEndDomainEntity()

        .withStartDomainEntity('AssessmentAdministration')
        .withDocumentation('doc')
        .withDomainEntityIdentity('EducationOrganization', 'doc', 'Assigning')
        .withEndDomainEntity()

        .withStartAssociation('StudentEducationOrganizationAssociation')
        .withDocumentation('doc')
        .withAssociationDomainEntityProperty('EducationOrganization', 'doc')
        .withAssociationDomainEntityProperty('UnusedEntity', 'doc')
        .withEndAssociation()

        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('doc')
        .withIntegerIdentity('EducationOrganizationId', 'doc')
        .withEndDomainEntity()

        .withStartDomainEntity('UnusedEntity')
        .withDocumentation('doc')
        .withStringIdentity('UnusedProperty', 'doc', '30')
        .withEndDomainEntity()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new AssociationBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      associationReferenceEnhancer(metaEd);
      runApiSchemaEnhancers(metaEd);
    });

    it('should be correct documentPathsMapping for StudentAssessmentRegistrationBatteryPartAssociation', () => {
      const entity = metaEd.namespace
        .get(namespaceName)
        ?.entity.association.get('StudentAssessmentRegistrationBatteryPartAssociation');
      const documentPathsMapping = removeSourcePropertyFromDocumentPathsMapping(
        entity?.data.edfiApiSchema.documentPathsMapping,
      );
      expect(documentPathsMapping).toMatchInlineSnapshot(`
        Object {
          "StudentAssessmentRegistration": Object {
            "isDescriptor": false,
            "isReference": true,
            "isRequired": true,
            "projectName": "EdFi",
            "referenceJsonPaths": Array [
              Object {
                "identityJsonPath": "$.assessmentAdministrationReference.assigningEducationOrganizationId",
                "referenceJsonPath": "$.studentAssessmentRegistrationReference.assigningEducationOrganizationId",
                "type": "number",
              },
              Object {
                "identityJsonPath": "$.studentEducationOrganizationAssociationReference.educationOrganizationId",
                "referenceJsonPath": "$.studentAssessmentRegistrationReference.educationOrganizationId",
                "type": "number",
              },
              Object {
                "identityJsonPath": "$.studentEducationOrganizationAssociationReference.unusedProperty",
                "referenceJsonPath": "$.studentAssessmentRegistrationReference.unusedProperty",
                "type": "string",
              },
            ],
            "resourceName": "StudentAssessmentRegistration",
          },
          "UnusedEntity": Object {
            "isDescriptor": false,
            "isReference": true,
            "isRequired": true,
            "projectName": "EdFi",
            "referenceJsonPaths": Array [
              Object {
                "identityJsonPath": "$.unusedProperty",
                "referenceJsonPath": "$.unusedEntityReference.unusedProperty",
                "type": "string",
              },
            ],
            "resourceName": "UnusedEntity",
          },
        }
      `);
    });
  },
);
