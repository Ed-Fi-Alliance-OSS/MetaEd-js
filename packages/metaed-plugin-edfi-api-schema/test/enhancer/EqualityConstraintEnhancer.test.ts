import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, mergeDirectiveEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as jsonSchemaEnhancer } from '../../src/enhancer/JsonSchemaEnhancer';

import { enhance } from '../../src/enhancer/EqualityConstraintEnhancer';
import { EqualityConstraint } from '../../src/model/EqualityConstraint';

describe('when building domain entity with DomainEntity collection and single merge directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

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
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);

    enhance(metaEd);
  });

  it('should have created one equality constraint', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;
    expect(equalityConstraints.length).toBe(1);
  });

  it('should have equality constraint for schoolYear', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;
    expect(equalityConstraints[0].sourceJsonPath).toBe('$.gradingPeriods[*].gradingPeriodReference.schoolYear');
    expect(equalityConstraints[0].targetJsonPath).toBe('$.schoolYearTypeReference.schoolYear');
  });
});

describe('when building domain entity with single merge directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

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
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have created one equality constraint', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('CourseOffering');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;

    expect(equalityConstraints.length).toBe(1);
  });

  it('should have equality constraint for schoolId', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('CourseOffering');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;

    expect(equalityConstraints[0].sourceJsonPath).toBe('$.schoolReference.schoolId');
    expect(equalityConstraints[0].targetJsonPath).toBe('$.sessionReference.schoolId');
  });
});

describe('when building domain entity with DomainEntity collection and two merge directives', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

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
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have created one equality constraint', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;

    expect(equalityConstraints.length).toBe(2);
  });

  it('should have equality constraint for schoolYear', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;

    expect(equalityConstraints[0].sourceJsonPath).toBe('$.gradingPeriods[*].gradingPeriodReference.schoolYear');
    expect(equalityConstraints[0].targetJsonPath).toBe('$.schoolYearTypeReference.schoolYear');
  });

  it('should have equality constraint for schoolId', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;

    expect(equalityConstraints[1].sourceJsonPath).toBe('$.gradingPeriods[*].gradingPeriodReference.schoolId');
    expect(equalityConstraints[1].targetJsonPath).toBe('$.schoolReference.schoolId');
  });
});

describe('when building domain entity with DomainEntity collection and single merge directive with multiple levels on target reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

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
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have created one equality constraint', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('StudentSectionAttendanceEvent');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;

    expect(equalityConstraints.length).toBe(1);
  });

  it('should have equality constraint for schoolId', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('StudentSectionAttendanceEvent');
    const equalityConstraints = sessionEntity?.data.edfiApiSchema.equalityConstraints;

    expect(equalityConstraints[0].sourceJsonPath).toBe('$.classPeriods[*].classPeriodReference.schoolId');
    expect(equalityConstraints[0].targetJsonPath).toBe('$.sectionReference.schoolId');
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
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have created four equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraints = entity?.data.edfiApiSchema.equalityConstraints;
    expect(equalityConstraints).toHaveLength(4);
  });

  it('should have equality constraint for booleanProperty', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.equalityConstraints[0];
    expect(equalityConstraint.sourceJsonPath).toBe('$.domainEntityBeingMergedFromReference.booleanProperty');
    expect(equalityConstraint.targetJsonPath).toBe('$.domainEntityBeingMergedToReference.booleanProperty');
  });

  it('should have equality constraint for schoolYear', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.equalityConstraints[1];
    expect(equalityConstraint.sourceJsonPath).toBe('$.domainEntityBeingMergedFromReference.schoolYear');
    expect(equalityConstraint.targetJsonPath).toBe('$.domainEntityBeingMergedToReference.schoolYear');
  });

  it('should have equality constraint for integerProperty', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.equalityConstraints[2];
    expect(equalityConstraint.sourceJsonPath).toBe('$.domainEntityBeingMergedFromReference.integerProperty');
    expect(equalityConstraint.targetJsonPath).toBe('$.domainEntityBeingMergedToReference.integerProperty');
  });

  it('should have equality constraint for stringProperty', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.equalityConstraints[3];
    expect(equalityConstraint.sourceJsonPath).toBe('$.domainEntityBeingMergedFromReference.stringProperty');
    expect(equalityConstraint.targetJsonPath).toBe('$.domainEntityBeingMergedToReference.stringProperty');
  });
});

describe('when merging on both a reference and a simple identity down multiple levels on both references', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

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
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have created two equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('SectionAttendanceTakenEvent');
    const equalityConstraints = entity?.data.edfiApiSchema.equalityConstraints;
    expect(equalityConstraints).toHaveLength(2);
  });

  it('should have equality constraint for schoolYear', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('SectionAttendanceTakenEvent');
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.equalityConstraints[0];
    expect(equalityConstraint.sourceJsonPath).toBe('$.calendarDateReference.schoolId');
    expect(equalityConstraint.targetJsonPath).toBe('$.sectionReference.schoolId');
  });

  it('should have equality constraint for integerProperty', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('SectionAttendanceTakenEvent');
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.equalityConstraints[1];
    expect(equalityConstraint.sourceJsonPath).toBe('$.calendarDateReference.schoolYear');
    expect(equalityConstraint.targetJsonPath).toBe('$.sectionReference.schoolYear');
  });
});
