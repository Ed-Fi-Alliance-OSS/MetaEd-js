import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  AssociationBuilder,
  ChoiceBuilder,
  CommonBuilder,
  ValidationFailure,
} from '@edfi/metaed-core';
import {
  associationReferenceEnhancer,
  choiceReferenceEnhancer,
  commonReferenceEnhancer,
  domainEntityReferenceEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import {
  entityPropertyApiSchemaDataSetupEnhancer,
  entityApiSchemaDataSetupEnhancer,
  referenceComponentEnhancer,
  propertyCollectingEnhancer,
  apiEntityMappingEnhancer,
  apiPropertyMappingEnhancer,
  jsonPathsMappingEnhancer,
} from '@edfi/metaed-plugin-edfi-api-schema';

import { validate } from '../../src/validator/MergeDirectiveMustBeAValidPath';
import { enhance as entityApiSchemaAdvancedDataSetupEnhancer } from '../../src/model/EntityApiSchemaAdvancedData';

describe('when building domain entity with DomainEntity collection and single merge directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc', '30')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityProperty('GradingPeriod', 'doc', false, true)
      .withMergeDirective('GradingPeriod.SchoolYear', 'SchoolYear')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when building domain entity with single merge directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withMergeDirective('School', 'Session.School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when building domain entity with an invalid merge directive source', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withMergeDirective('NotValid', 'Session.School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have one failure', () => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Merge directive path NotValid is not a valid path on CourseOffering",
          "sourceMap": Object {
            "column": 10,
            "line": 27,
            "tokenText": "NotValid",
          },
          "validatorName": "MergeDirectiveMustBeAValidPath",
        },
      ]
    `);
  });
});

describe('when building domain entity with an invalid merge directive target', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withMergeDirective('School', 'Not.Valid')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have one failure', () => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Merge directive path Not.Valid is not a valid path on CourseOffering",
          "sourceMap": Object {
            "column": 22,
            "line": 27,
            "tokenText": "Not",
          },
          "validatorName": "MergeDirectiveMustBeAValidPath",
        },
      ]
    `);
  });
});

describe('when building domain entity with an invalid merge directive source and target', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withMergeDirective('NotValid', 'Also.Not.Valid')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have two failures', () => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Merge directive path NotValid is not a valid path on CourseOffering",
          "sourceMap": Object {
            "column": 10,
            "line": 27,
            "tokenText": "NotValid",
          },
          "validatorName": "MergeDirectiveMustBeAValidPath",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Merge directive path Also.Not.Valid is not a valid path on CourseOffering",
          "sourceMap": Object {
            "column": 24,
            "line": 27,
            "tokenText": "Also",
          },
          "validatorName": "MergeDirectiveMustBeAValidPath",
        },
      ]
    `);
  });
});

describe('when building domain entity with DomainEntity collection and two merge directives', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc', '30')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withDomainEntityProperty('GradingPeriod', 'doc', false, true)
      .withMergeDirective('GradingPeriod.SchoolYear', 'SchoolYear')
      .withMergeDirective('GradingPeriod.School', 'School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when building domain entity with DomainEntity collection and single merge directive with multiple levels on target reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentSectionAttendanceEvent')
      .withDocumentation('doc')
      .withDomainEntityProperty('ClassPeriod', 'doc', false, true)
      .withDomainEntityIdentity('Section', 'doc')
      .withMergeDirective('ClassPeriod.School', 'Section.CourseOffering.Session.School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when building domain entity with DomainEntity collection and single merge directive with multiple levels ending with simple type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentSectionAttendanceEvent')
      .withDocumentation('doc')
      .withDomainEntityProperty('ClassPeriod', 'doc', false, true)
      .withDomainEntityIdentity('Section', 'doc')
      .withMergeDirective('ClassPeriod.School.SchoolId', 'Section.CourseOffering.Session.School.SchoolId')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when two domain entities with all four possible simple identities are merged on a reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityWithMerges = 'DomainEntityWithMerges';
  const domainEntityBeingMergedFrom = 'DomainEntityBeingMergedFrom';
  const domainEntityBeingMergedTo = 'DomainEntityBeingMergedTo';
  const booleanProperty = 'BooleanProperty';
  const schoolYear = 'SchoolYear';
  const integerProperty = 'IntegerProperty';
  const stringProperty = 'StringProperty';
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityBeingMergedTo)
      .withDocumentation('doc')
      .withBooleanIdentity(booleanProperty, 'doc')
      .withEnumerationIdentity(schoolYear, 'doc')
      .withIntegerIdentity(integerProperty, 'doc')
      .withStringIdentity(stringProperty, 'doc', '10')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityBeingMergedFrom)
      .withDocumentation('doc')
      .withBooleanIdentity(booleanProperty, 'doc')
      .withEnumerationIdentity(schoolYear, 'doc')
      .withIntegerIdentity(integerProperty, 'doc')
      .withStringIdentity(stringProperty, 'doc', '10')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityWithMerges)
      .withDocumentation('doc')

      .withDomainEntityIdentity(domainEntityBeingMergedFrom, 'doc')
      .withMergeDirective(
        `${domainEntityBeingMergedFrom}.${booleanProperty}`,
        `${domainEntityBeingMergedTo}.${booleanProperty}`,
      )
      .withMergeDirective(`${domainEntityBeingMergedFrom}.${schoolYear}`, `${domainEntityBeingMergedTo}.${schoolYear}`)
      .withMergeDirective(
        `${domainEntityBeingMergedFrom}.${integerProperty}`,
        `${domainEntityBeingMergedTo}.${integerProperty}`,
      )
      .withMergeDirective(
        `${domainEntityBeingMergedFrom}.${stringProperty}`,
        `${domainEntityBeingMergedTo}.${stringProperty}`,
      )
      .withDomainEntityIdentity(domainEntityBeingMergedTo, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when merging on both a reference and a simple identity down multiple levels on both references', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('SectionAttendanceTakenEvent')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Section', 'doc')
      .withDomainEntityIdentity('CalendarDate', 'doc')
      .withMergeDirective('CalendarDate.Calendar.School', 'Section.CourseOffering.Session.School')
      .withMergeDirective('CalendarDate.Calendar.SchoolYear', 'Section.CourseOffering.Session.SchoolYear')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CalendarDate')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Calendar', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Calendar')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when merging on a reference with multiple levels of domain entities below it', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Section', 'doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withMergeDirective('CourseOffering', 'Section.CourseOffering')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withDomainEntityIdentity('CalendarDate', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CalendarDate')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Calendar', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Calendar')
      .withDocumentation('doc')
      .withIntegerIdentity('Days', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when merging on a reference through a choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentCompetencyObjective')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withChoiceProperty('StudentCompetencyObjectiveChoice', 'doc', false, false)
      .withMergeDirective('StudentCompetencyObjectiveChoice.StudentSectionAssociation.Student', 'Student')
      .withEndDomainEntity()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withEndDomainEntity()

      .withStartChoice('StudentCompetencyObjectiveChoice')
      .withDocumentation('doc')
      .withAssociationProperty('StudentSectionAssociation', 'doc', false, true)
      .withEndChoice()

      .withStartAssociation('StudentSectionAssociation')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Student', 'doc')
      .withAssociationDomainEntityProperty('Section', 'doc')
      .withEndAssociation()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withIntegerIdentity('SectionId', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});

describe('when merging on a reference through a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let result: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('StudentAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Assessment', 'doc')
      .withCommonProperty('StudentAssessmentItem', 'doc', false, true)
      .withMergeDirective('StudentAssessmentItem.AssessmentItem.Assessment', 'Assessment')
      .withEndDomainEntity()

      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('AssessmentItem')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Assessment', 'doc')
      .withEndDomainEntity()

      .withStartCommon('StudentAssessmentItem')
      .withDocumentation('doc')
      .withDomainEntityIdentity('AssessmentItem', 'doc')
      .withEndCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaAdvancedDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    result = validate(metaEd);
  });

  it('should have no failures', () => {
    expect(result).toHaveLength(0);
  });
});
