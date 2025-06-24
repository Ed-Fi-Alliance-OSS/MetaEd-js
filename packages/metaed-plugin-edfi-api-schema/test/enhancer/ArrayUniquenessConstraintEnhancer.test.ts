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
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  inlineCommonReferenceEnhancer,
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
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance } from '../../src/enhancer/ArrayUniquenessConstraintEnhancer';

describe('when building simple domain entity with a simple collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withStringProperty('RequiredStringProperty', 'doc', true, true, '30')
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
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "paths": Array [
            "$.requiredStringProperties[*].requiredStringProperty",
          ],
        },
      ]
    `);
  });
});

describe('when building with scalar in common collection with same name as scalar outside collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'PreparationProgram';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('BeginDate', 'doc', '30')
      .withCommonProperty('DegreeSpecialization', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('DegreeSpecialization')
      .withDocumentation('doc')
      .withStringIdentity('BeginDate', 'doc', '30')
      .withStringProperty('OtherProperty', 'doc', false, false, '30')
      .withEndCommon()
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
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "paths": Array [
            "$.degreeSpecializations[*].beginDate",
          ],
        },
      ]
    `);
  });
});

describe('when building domain entity with nested choice and common collection', () => {
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
      .withEndDomainEntity()

      .withStartChoice('LearningResourceChoice')
      .withDocumentation('doc')
      .withStringProperty('LearningResourceMetadataURI', 'doc', true, false, '30')
      .withCommonProperty('LearningResource', 'doc', true, true)
      .withEndChoice()

      .withStartDescriptor('ContentClass')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartCommon('LearningResource')
      .withDocumentation('doc')
      .withStringProperty('Description', 'doc', false, false, '30')
      .withDescriptorIdentity('ContentClass', 'doc')
      .withEndCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);

    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "paths": Array [
            "$.learningResources[*].contentClassDescriptor",
          ],
        },
      ]
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
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');

    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "paths": Array [
            "$.identificationCodes[*].assessmentIdentificationSystemDescriptor",
          ],
        },
      ]
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
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);

    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "paths": Array [
            "$.identificationCodes[*].educationOrganizationIdentificationSystemDescriptor",
          ],
        },
      ]
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
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');

    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "nestedConstraints": Array [
            Object {
              "basePath": "$.addresses[*]",
              "paths": Array [
                "$.periods[*].beginDate",
              ],
            },
          ],
        },
      ]
    `);
  });
});

describe('when building entity with multiple nested collections in a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withCommonProperty('Address', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('Address')
      .withDocumentation('doc')
      .withStringProperty('StreetNumberName', 'doc', true, false, '30')
      .withCommonProperty('Period', 'doc', false, true)
      .withCommonProperty('Contact', 'doc', false, true)
      .withEndCommon()

      .withStartCommon('Period')
      .withDocumentation('doc')
      .withIntegerIdentity('BeginDate', 'doc')
      .withIntegerProperty('EndDate', 'doc', false, false)
      .withEndCommon()

      .withStartCommon('Contact')
      .withDocumentation('doc')
      .withDescriptorIdentity('ContactType', 'doc')
      .withStringProperty('ContactValue', 'doc', false, false, '30')
      .withEndCommon()

      .withStartDescriptor('ContactType')
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
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints with multiple nested constraints', () => {
    const entity = namespace.entity.domainEntity.get('School');

    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "nestedConstraints": Array [
            Object {
              "basePath": "$.addresses[*]",
              "paths": Array [
                "$.contacts[*].contactTypeDescriptor",
              ],
            },
            Object {
              "basePath": "$.addresses[*]",
              "paths": Array [
                "$.periods[*].beginDate",
              ],
            },
          ],
        },
      ]
    `);
  });
});

describe('when building entity with scalar collection in a common collection on an inline common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Staff')
      .withDocumentation('doc')
      .withIntegerIdentity('StaffId', 'doc')
      .withInlineCommonProperty('Citizenship', 'doc', false, true)
      .withEndDomainEntity()

      .withStartInlineCommon('Citizenship')
      .withDocumentation('doc')
      .withDescriptorProperty('CitizenshipStatus', 'doc', false, false)
      .withDescriptorProperty('Visa', 'doc', false, true)
      .withCommonProperty('IdentificationDocument', 'doc', false, true)
      .withEndInlineCommon()

      .withStartCommon('IdentificationDocument')
      .withDocumentation('doc')
      .withDescriptorIdentity('IdentificationDocumentUse', 'doc')
      .withDescriptorIdentity('PersonalInformationVerification', 'doc')
      .withStringProperty('DocumentTitle', 'doc', false, false, '30')
      .withEndCommon()

      .withStartDescriptor('CitizenshipStatus')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor('Visa')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor('IdentificationDocumentUse')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor('PersonalInformationVerification')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    commonReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints with scalar collection and common collection', () => {
    const entity = namespace.entity.domainEntity.get('Staff');

    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "paths": Array [
            "$.identificationDocuments[*].identificationDocumentUseDescriptor",
            "$.identificationDocuments[*].personalInformationVerificationDescriptor",
            "$.visas[*].visaDescriptor",
          ],
        },
      ]
    `);
  });
});

describe('when building entity with scalar collections on a scalar common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentTransportation')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withCommonProperty('StudentBusDetails', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('StudentBusDetails')
      .withDocumentation('doc')
      .withDescriptorProperty('TravelDayOfWeek', 'doc', false, true)
      .withDescriptorProperty('TravelDirection', 'doc', false, true)
      .withStringIdentity('BusNumber', 'doc', '30')
      .withEndCommon()

      .withStartDescriptor('TravelDayOfWeek')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor('TravelDirection')
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
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct arrayUniquenessConstraints with scalar collection on scalar common', () => {
    const entity = namespace.entity.domainEntity.get('StudentTransportation');

    expect((entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "paths": Array [
            "$.studentBusDetails.travelDayOfWeeks[*].travelDayOfWeekDescriptor",
            "$.studentBusDetails.travelDirections[*].travelDirectionDescriptor",
          ],
        },
      ]
    `);
  });
});

// Simple test to demonstrate the error with different base paths
describe('SIMPLE: entity with two different array collections (demonstrates the bug)', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('TestEntity')
      .withDocumentation('doc')
      .withIntegerIdentity('TestId', 'doc')
      .withDescriptorProperty('FirstType', 'doc', false, true)
      .withDescriptorProperty('SecondType', 'doc', false, true)
      .withEndDomainEntity()

      .withStartDescriptor('FirstType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor('SecondType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
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
    allJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('shows that different descriptor properties create separate constraints', () => {
    const entity = namespace.entity.domainEntity.get('TestEntity');
    const constraints = (entity.data.edfiApiSchema as EntityApiSchemaData).arrayUniquenessConstraints;

    expect(constraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "paths": Array [
            "$.firstTypes[*].firstTypeDescriptor",
          ],
        },
        Object {
          "paths": Array [
            "$.secondTypes[*].secondTypeDescriptor",
          ],
        },
      ]
    `);
  });
});
