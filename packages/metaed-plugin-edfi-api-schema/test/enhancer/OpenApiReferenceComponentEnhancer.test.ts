// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
  AssociationBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  associationReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance } from '../../src/enhancer/OpenApiReferenceComponentEnhancer';

describe('when building simple domain entity with all the identities', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanIdentity('BooleanIdentity', 'doc1')
      .withDecimalIdentity('DecimalIdentity', 'doc2', '5', '5')
      .withIntegerIdentity('IntegerIdentity', 'doc3')
      .withStringIdentity('StringIdentity', 'doc4', '30', '20')
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

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_DomainEntityName_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "booleanIdentity": Object {
            "description": "doc1",
            "type": "boolean",
          },
          "decimalIdentity": Object {
            "description": "doc2",
            "type": "number",
          },
          "integerIdentity": Object {
            "description": "doc3",
            "type": "integer",
          },
          "stringIdentity": Object {
            "description": "doc4",
            "maxLength": 30,
            "minLength": 20,
            "type": "string",
          },
        },
        "required": Array [
          "booleanIdentity",
          "decimalIdentity",
          "integerIdentity",
          "stringIdentity",
        ],
        "type": "object",
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
      .withStringIdentity('SectionIdentifier', 'doc1', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc2')
      .withDomainEntityProperty('ClassPeriod', 'doc3', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc4', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc5', '30')
      .withDomainEntityIdentity('School', 'doc6')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc7', '30')
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

  it('should be a correct schema for top entity', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_DomainEntityName_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "localCourseCode": Object {
            "description": "doc4",
            "maxLength": 30,
            "type": "string",
          },
          "schoolId": Object {
            "description": "doc7",
            "maxLength": 30,
            "type": "string",
          },
          "sectionIdentifier": Object {
            "description": "doc1",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "localCourseCode",
          "schoolId",
          "sectionIdentifier",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_CourseOffering_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "localCourseCode": Object {
            "description": "doc4",
            "maxLength": 30,
            "type": "string",
          },
          "schoolId": Object {
            "description": "doc7",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "localCourseCode",
          "schoolId",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for ClassPeriod', () => {
    const entity = namespace.entity.domainEntity.get('ClassPeriod');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_ClassPeriod_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "classPeriodName": Object {
            "description": "doc5",
            "maxLength": 30,
            "type": "string",
          },
          "schoolId": Object {
            "description": "doc7",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "classPeriodName",
          "schoolId",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(`"EdFi_School_Reference"`);
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "schoolId": Object {
            "description": "doc7",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "schoolId",
        ],
        "type": "object",
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
      .withStringIdentity('SectionIdentifier', 'doc1', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc2')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc3', '30')
      .withDomainEntityIdentity('School', 'doc4')
      .withDomainEntityIdentity('Session', 'doc5')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc6', '30')
      .withEnumerationIdentity('SchoolYear', 'doc7')
      .withDomainEntityIdentity('School', 'doc8')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc9', '30')
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

  it('should be a correct schema for top entity', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_DomainEntityName_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "localCourseCode": Object {
            "description": "doc3",
            "maxLength": 30,
            "type": "string",
          },
          "schoolId": Object {
            "description": "doc9",
            "maxLength": 30,
            "type": "string",
          },
          "schoolYear": Object {
            "description": "A school year between 1900 and 2100",
            "maximum": 2100,
            "minimum": 1900,
            "type": "integer",
          },
          "sectionIdentifier": Object {
            "description": "doc1",
            "maxLength": 30,
            "type": "string",
          },
          "sessionName": Object {
            "description": "doc6",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "localCourseCode",
          "schoolId",
          "schoolYear",
          "sessionName",
          "sectionIdentifier",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_CourseOffering_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "localCourseCode": Object {
            "description": "doc3",
            "maxLength": 30,
            "type": "string",
          },
          "schoolId": Object {
            "description": "doc9",
            "maxLength": 30,
            "type": "string",
          },
          "schoolYear": Object {
            "description": "A school year between 1900 and 2100",
            "maximum": 2100,
            "minimum": 1900,
            "type": "integer",
          },
          "sessionName": Object {
            "description": "doc6",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "localCourseCode",
          "schoolId",
          "schoolYear",
          "sessionName",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for Session', () => {
    const entity = namespace.entity.domainEntity.get('Session');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_Session_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "schoolId": Object {
            "description": "doc9",
            "maxLength": 30,
            "type": "string",
          },
          "schoolYear": Object {
            "description": "A school year between 1900 and 2100",
            "maximum": 2100,
            "minimum": 1900,
            "type": "integer",
          },
          "sessionName": Object {
            "description": "doc6",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "schoolId",
          "schoolYear",
          "sessionName",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(`"EdFi_School_Reference"`);
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "schoolId": Object {
            "description": "doc9",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "schoolId",
        ],
        "type": "object",
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

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_EducationContent_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "contentIdentifier",
        ],
        "type": "object",
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

  it('should be a correct schema - acronym with correct casing', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_StudentSpecialEducationProgramAssociation_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "iepBeginDate": Object {
            "description": "doc",
            "format": "date-time",
            "type": "string",
          },
        },
        "required": Array [
          "contentIdentifier",
          "iepBeginDate",
        ],
        "type": "object",
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

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_CommunityOrganization_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "communityOrganizationId": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "communityOrganizationId",
        ],
        "type": "object",
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

  it('should have no reference component', () => {
    const entity = namespace.entity.descriptor.get('GradeLevel');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(`""`);
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "description": "NoOpenApiObject",
        "properties": Object {},
        "type": "object",
      }
    `);
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

  it('should have no reference component', () => {
    const entity = namespace.entity.schoolYearEnumeration.get('SchoolYear');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(`""`);
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "description": "NoOpenApiObject",
        "properties": Object {},
        "type": "object",
      }
    `);
  });
});

describe('when building a domain entity referencing another referencing another with rolenamed identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('AssessmentAdministrationParticipation')
      .withDocumentation('doc')
      .withStringIdentity('AssessmentAdministrationParticipationId', 'doc', '30')
      .withDomainEntityIdentity('AssessmentAdministration', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('AssessmentAdministration')
      .withDocumentation('doc')
      .withStringIdentity('AssessmentAdministrationId', 'doc', '30')
      .withDomainEntityIdentity('EducationOrganization', 'doc', 'Assigning')
      .withEndDomainEntity()

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withStringIdentity('EducationOrganizationId', 'doc', '30')
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

  it('should be a correct AssessmentAdministration schema - "assigning" prefix on "EducationOrganizationId"', () => {
    const entity = namespace.entity.domainEntity.get('AssessmentAdministration');
    expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_AssessmentAdministration_Reference"`,
    );
    expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "assessmentAdministrationId": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "assigningEducationOrganizationId": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "assessmentAdministrationId",
          "assigningEducationOrganizationId",
        ],
        "type": "object",
      }
    `);
  });
});

describe(
  'when building association with domain entity with two entities, one with role named educationOrganization and' +
    ' one with non role named educationOrganization ',
  () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
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
      entityPropertyApiSchemaDataSetupEnhancer(metaEd);
      entityApiSchemaDataSetupEnhancer(metaEd);
      referenceComponentEnhancer(metaEd);
      apiPropertyMappingEnhancer(metaEd);
      propertyCollectingEnhancer(metaEd);
      apiEntityMappingEnhancer(metaEd);
      enhance(metaEd);
    });

    it('should be correct schema for StudentAssessmentRegistrationBatteryPartAssociation', () => {
      const entity: any = metaEd.namespace
        .get(namespaceName)
        ?.entity.association.get('StudentAssessmentRegistrationBatteryPartAssociation');
      expect(entity.data.edfiApiSchema.openApiReferenceComponentPropertyName).toMatchInlineSnapshot(
        `"EdFi_StudentAssessmentRegistrationBatteryPartAssociation_Reference"`,
      );
      expect(entity.data.edfiApiSchema.openApiReferenceComponent).toMatchInlineSnapshot(`
        Object {
          "properties": Object {
            "assigningEducationOrganizationId": Object {
              "description": "doc",
              "type": "integer",
            },
            "educationOrganizationId": Object {
              "description": "doc",
              "type": "integer",
            },
            "unusedProperty": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
          },
          "required": Array [
            "assigningEducationOrganizationId",
            "educationOrganizationId",
            "unusedProperty",
          ],
          "type": "object",
        }
      `);
    });
  },
);
