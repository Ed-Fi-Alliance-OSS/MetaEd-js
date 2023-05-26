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
import { enhance } from '../../src/enhancer/EqualityConstraintEnhancer';
import { EqualityConstraint } from '../../src/model/EqualityConstraint';

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
    enhance(metaEd);
  });

  it('should have created four equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraints = entity?.data.edfiApiSchema.apiMapping.equalityConstraints;
    expect(equalityConstraints).toHaveLength(4);
  });

  it('should have equality constraint for booleanProperty', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.apiMapping.equalityConstraints[0];
    expect(equalityConstraint.sourceJsonPath).toBe('$.domainEntityBeingMergedFromReference.booleanProperty');
    expect(equalityConstraint.targetJsonPath).toBe('$.domainEntityBeingMergedToReference.booleanProperty');
  });

  it('should have equality constraint for schoolYear', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.apiMapping.equalityConstraints[1];
    expect(equalityConstraint.sourceJsonPath).toBe('$.domainEntityBeingMergedFromReference.schoolYear');
    expect(equalityConstraint.targetJsonPath).toBe('$.domainEntityBeingMergedToReference.schoolYear');
  });

  it('should have equality constraint for integerProperty', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.apiMapping.equalityConstraints[2];
    expect(equalityConstraint.sourceJsonPath).toBe('$.domainEntityBeingMergedFromReference.integerProperty');
    expect(equalityConstraint.targetJsonPath).toBe('$.domainEntityBeingMergedToReference.integerProperty');
  });

  it('should have equality constraint for stringProperty', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    const equalityConstraint: EqualityConstraint = entity?.data.edfiApiSchema.apiMapping.equalityConstraints[3];
    expect(equalityConstraint.sourceJsonPath).toBe('$.domainEntityBeingMergedFromReference.stringProperty');
    expect(equalityConstraint.targetJsonPath).toBe('$.domainEntityBeingMergedToReference.stringProperty');
  });
});
