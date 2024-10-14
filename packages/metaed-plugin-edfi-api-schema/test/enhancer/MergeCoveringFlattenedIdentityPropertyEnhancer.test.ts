import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  AssociationBuilder,
} from '@edfi/metaed-core';
import {
  associationReferenceEnhancer,
  domainEntityReferenceEnhancer,
  enumerationReferenceEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance } from '../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';

describe('when a role named resource has a schoolid merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
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
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have GradingPeriod.School FIP pointing to merge covering FIP', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Grade');
    const apiMapping = entity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "GradingPeriod.School",
        "GradingPeriod.School.SchoolId",
      ]
    `);

    expect(apiMapping?.flattenedIdentityProperties[1].mergeCoveredBy.propertyPaths).toMatchInlineSnapshot(`
      Array [
        "StudentSectionAssociation",
        "StudentSectionAssociation.Section",
        "StudentSectionAssociation.Section.CourseOffering",
        "StudentSectionAssociation.Section.CourseOffering.Session",
        "StudentSectionAssociation.Section.CourseOffering.Session.School",
        "StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId",
      ]
    `);
  });
});
