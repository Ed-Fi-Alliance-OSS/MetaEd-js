import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DescriptorBuilder,
  CommonBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  enumerationReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance } from '../../src/enhancer/ApiEntityMappingEnhancer';

describe('when demonstrating key unification via entity referencing two entities each referencing a 3rd as their identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';
  const section = 'Section';
  const courseOffering = 'CourseOffering';
  const classPeriod = 'ClassPeriod';
  const school = 'School';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(section)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity(courseOffering, 'doc')
      .withDomainEntityProperty(classPeriod, 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity(courseOffering)
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc', '30')
      .withDomainEntityIdentity(school, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(classPeriod)
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withDomainEntityIdentity(school, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(school)
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have ClassPeriod and CourseOffering in Section reference groups', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(section);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.referenceGroups).toHaveLength(2);
    expect(apiMapping?.referenceGroups[0].isGroup).toBe(true);
    expect(apiMapping?.referenceGroups[0].sourceProperty.fullPropertyName).toBe(classPeriod);
    expect(apiMapping?.referenceGroups[1].isGroup).toBe(true);
    expect(apiMapping?.referenceGroups[1].sourceProperty.fullPropertyName).toBe(courseOffering);
  });

  it('should have LocalCourseCode, SchoolId, and SectionIdentifier in Section flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(section);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties).toHaveLength(3);
    expect(apiMapping?.flattenedIdentityProperties[0].identityProperty.fullPropertyName).toBe('LocalCourseCode');
    expect(apiMapping?.flattenedIdentityProperties[1].identityProperty.fullPropertyName).toBe('SchoolId');
    expect(apiMapping?.flattenedIdentityProperties[2].identityProperty.fullPropertyName).toBe('SectionIdentifier');
  });

  it('should have correct property paths in Section flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(section);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "CourseOffering",
        "CourseOffering.LocalCourseCode",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "CourseOffering",
        "CourseOffering.School",
        "CourseOffering.School.SchoolId",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[2].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });

  it('should have correct property chain in Section flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(section);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "CourseOffering",
        "LocalCourseCode",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "CourseOffering",
        "School",
        "SchoolId",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[2].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });

  it('should not have any descriptor property mappings in Section', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(section);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.descriptorCollectedApiProperties).toHaveLength(0);
  });

  it('should have School in CourseOffering reference groups', () => {
    const courseOfferingEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(courseOffering);
    const apiMapping = courseOfferingEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.referenceGroups).toHaveLength(1);
    expect(apiMapping?.referenceGroups[0].isGroup).toBe(true);
    expect(apiMapping?.referenceGroups[0].sourceProperty.fullPropertyName).toBe(school);
  });

  it('should have LocalCourseCode and SchoolId in CourseOffering flattened identity properties', () => {
    const courseOfferingEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(courseOffering);
    const apiMapping = courseOfferingEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties).toHaveLength(2);
    expect(apiMapping?.flattenedIdentityProperties[0].identityProperty.fullPropertyName).toBe('LocalCourseCode');
    expect(apiMapping?.flattenedIdentityProperties[1].identityProperty.fullPropertyName).toBe('SchoolId');
  });

  it('should not have any descriptor property mappings in CourseOffering', () => {
    const courseOfferingEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(courseOffering);
    const apiMapping = courseOfferingEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.descriptorCollectedApiProperties).toHaveLength(0);
  });

  it('should have correct property paths in CourseOffering flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(courseOffering);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "LocalCourseCode",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "School",
        "School.SchoolId",
      ]
    `);
  });

  it('should have correct property chain in CourseOffering flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(courseOffering);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "LocalCourseCode",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "School",
        "SchoolId",
      ]
    `);
  });

  it('should have School in ClassPeriod reference groups', () => {
    const classPeriodEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(classPeriod);
    const apiMapping = classPeriodEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.referenceGroups).toHaveLength(1);
    expect(apiMapping?.referenceGroups[0].isGroup).toBe(true);
    expect(apiMapping?.referenceGroups[0].sourceProperty.fullPropertyName).toBe(school);
  });

  it('should have ClassPeriodName and SchoolId in ClassPeriod flattened identity properties', () => {
    const classPeriodEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(classPeriod);
    const apiMapping = classPeriodEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties).toHaveLength(2);
    expect(apiMapping?.flattenedIdentityProperties[0].identityProperty.fullPropertyName).toBe('ClassPeriodName');
    expect(apiMapping?.flattenedIdentityProperties[1].identityProperty.fullPropertyName).toBe('SchoolId');
  });

  it('should not have any descriptor property mappings in ClassPeriod', () => {
    const classPeriodEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(classPeriod);
    const apiMapping = classPeriodEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.descriptorCollectedApiProperties).toHaveLength(0);
  });

  it('should have correct property paths in ClassPeriod flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(classPeriod);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "ClassPeriodName",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "School",
        "School.SchoolId",
      ]
    `);
  });

  it('should have correct property chain in ClassPeriod flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(classPeriod);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "ClassPeriodName",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "School",
        "SchoolId",
      ]
    `);
  });

  it('should have no reference groups in School', () => {
    const schoolEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(school);
    const apiMapping = schoolEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.referenceGroups).toHaveLength(0);
  });

  it('should have SchoolId in School flattened identity properties', () => {
    const schoolEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(school);
    const apiMapping = schoolEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties).toHaveLength(1);
    expect(apiMapping?.flattenedIdentityProperties[0].identityProperty.fullPropertyName).toBe('SchoolId');
  });

  it('should have correct property paths in School flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(school);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
  });

  it('should have correct property chain in School flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(school);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
  });

  it('should not have any descriptor property mappings in School', () => {
    const schoolEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(school);
    const apiMapping = schoolEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.descriptorCollectedApiProperties).toHaveLength(0);
  });
});

describe('when building domain entity with reference to domain entity with school year enumeration as part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const calendar = 'Calendar';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withDomainEntityProperty(calendar, 'doc', false, false)
      .withEndDomainEntity()

      .withStartDomainEntity(calendar)
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withIdentityProperty('enumeration', 'SchoolYear', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have correct reference groups for DomainEntityName', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(domainEntityName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.referenceGroups).toHaveLength(1);
    expect(apiMapping?.referenceGroups[0].isGroup).toBe(true);
    expect(apiMapping?.referenceGroups[0].sourceProperty.fullPropertyName).toBe('Calendar');
  });

  it('should have correct flattened identity properties for DomainEntityName', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(domainEntityName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.flattenedIdentityProperties).toHaveLength(1);
    expect(apiMapping?.flattenedIdentityProperties[0].identityProperty.fullPropertyName).toBe('SchoolId');
  });

  it('should have correct property paths in flattened identity properties for DomainEntityName', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(domainEntityName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
  });

  it('should have correct property chain in flattened identity properties for DomainEntityName', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(domainEntityName);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
  });

  it('should have no reference groups for Calendar', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(calendar);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.referenceGroups).toHaveLength(0);
  });

  it('should have correct flattened identity properties for Calendar', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(calendar);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping?.flattenedIdentityProperties).toHaveLength(2);
    expect(apiMapping?.flattenedIdentityProperties[0].identityProperty.fullPropertyName).toBe('SchoolId');
    expect(apiMapping?.flattenedIdentityProperties[1].identityProperty.fullPropertyName).toBe('SchoolYear');
  });

  it('should have correct property paths in flattened identity properties for Calendar', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(calendar);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SchoolYear",
      ]
    `);
  });

  it('should have correct property chain in flattened identity properties for Calendar', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(calendar);
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "SchoolYear",
      ]
    `);
  });
});

describe('when demonstrating descriptor collections and scalar descriptors on one entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';
  const resourceName = 'EntityName';
  const descriptorName = 'DescriptorName';
  const singlePrefix = 'Single';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDescriptorProperty(descriptorName, 'doc', true, true)
      .withDescriptorProperty(descriptorName, 'doc', true, false, singlePrefix)
      .withEndDomainEntity()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have two descriptor collected properties', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const collectedApiProperties = entity?.data.edfiApiSchema.apiMapping.descriptorCollectedApiProperties;

    expect(collectedApiProperties).toHaveLength(2);
  });

  it('should have one collection collected property', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const collectedApiProperties = entity?.data.edfiApiSchema.apiMapping.descriptorCollectedApiProperties;

    expect(collectedApiProperties[0].property.type).toBe('descriptor');
    expect(collectedApiProperties[0].property.metaEdName).toBe(descriptorName);
    expect(collectedApiProperties[0].property.isRequiredCollection).toBe(true);
    expect(collectedApiProperties[0].propertyModifier.optionalDueToParent).toBe(false);
    expect(collectedApiProperties[0].propertyModifier.parentPrefixes).toHaveLength(0);
  });

  it('should have one scalar collected property', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const collectedApiProperties = entity?.data.edfiApiSchema.apiMapping.descriptorCollectedApiProperties;

    expect(collectedApiProperties[1].property.type).toBe('descriptor');
    expect(collectedApiProperties[1].property.metaEdName).toBe(descriptorName);
    expect(collectedApiProperties[1].property.isRequiredCollection).toBe(false);
    expect(collectedApiProperties[1].propertyModifier.optionalDueToParent).toBe(false);
    expect(collectedApiProperties[1].propertyModifier.parentPrefixes).toHaveLength(0);
  });

  it('should have correct property paths in flattened identity properties', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });

  it('should have correct property chain in flattened identity properties', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });
});

describe('when one entity has a descriptor on an inline common reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';
  const resourceName = 'EntityName';
  const inlineCommonName = 'InlineCommonName';
  const descriptorName = 'DescriptorName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withInlineCommonProperty(inlineCommonName, 'doc', true, false)
      .withEndDomainEntity()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('doc')
      .withDescriptorProperty(descriptorName, 'doc', true, false)
      .withEndInlineCommon()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have one descriptor collected property', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const collectedApiProperties = entity?.data.edfiApiSchema.apiMapping.descriptorCollectedApiProperties;

    expect(collectedApiProperties).toHaveLength(1);
  });

  it('should have correct collected property values', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const collectedApiProperties = entity?.data.edfiApiSchema.apiMapping.descriptorCollectedApiProperties;

    expect(collectedApiProperties[0].property.type).toBe('descriptor');
    expect(collectedApiProperties[0].property.metaEdName).toBe(descriptorName);
    expect(collectedApiProperties[0].property.isRequiredCollection).toBe(false);
    expect(collectedApiProperties[0].propertyModifier.optionalDueToParent).toBe(false);
    expect(collectedApiProperties[0].propertyModifier.parentPrefixes).toHaveLength(1);
    expect(collectedApiProperties[0].propertyModifier.parentPrefixes[0]).toBe('');
  });

  it('should have correct property paths in flattened identity properties', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });

  it('should have correct property chain in flattened identity properties', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });
});

describe('when one entity has a descriptor on an inline common reference which is role named', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';
  const resourceName = 'EntityName';
  const inlineCommonName = 'InlineCommonName';
  const inlineCommonRoleName = 'Role';
  const descriptorName = 'DescriptorName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withInlineCommonProperty(inlineCommonName, 'doc', true, false, inlineCommonRoleName)
      .withEndDomainEntity()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('doc')
      .withDescriptorProperty(descriptorName, 'doc', true, false)
      .withEndInlineCommon()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have one descriptor collected property', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const collectedApiProperties = entity?.data.edfiApiSchema.apiMapping.descriptorCollectedApiProperties;

    expect(collectedApiProperties).toHaveLength(1);
  });

  it('should have correct descriptor name', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const collectedApiProperties = entity?.data.edfiApiSchema.apiMapping.descriptorCollectedApiProperties;

    expect(collectedApiProperties[0].property.type).toBe('descriptor');
    expect(collectedApiProperties[0].property.metaEdName).toBe(descriptorName);
    expect(collectedApiProperties[0].property.isRequiredCollection).toBe(false);
    expect(collectedApiProperties[0].propertyModifier.optionalDueToParent).toBe(false);
    expect(collectedApiProperties[0].propertyModifier.parentPrefixes).toHaveLength(1);
    expect(collectedApiProperties[0].propertyModifier.parentPrefixes[0]).toBe(inlineCommonRoleName);
  });

  it('should have correct property paths in flattened identity properties', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });

  it('should have correct property chain in flattened identity properties', () => {
    const domainEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get(resourceName);
    const apiMapping = domainEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });
});

describe('when a role named merge follows a role named merge with school year enumeration as one leaf target', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity('ReportCard')
      .withDocumentation('doc')
      .withIntegerIdentity('ReportCardIdentity', 'doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withDomainEntityProperty('Grade', 'doc', false, true)
      .withMergeDirective('Grade.GradingPeriod', 'GradingPeriod')
      .withEndDomainEntity()

      .withStartDomainEntity('Grade')
      .withDocumentation('doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withMergeDirective('GradingPeriod.School', 'Session.School')
      .withMergeDirective('GradingPeriod.SchoolYear', 'Session.SchoolYear')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withIntegerIdentity('SessionIdentity', 'doc')
      .withEndDomainEntity()

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
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have correct ReportCard reference groups', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('ReportCard');
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.referenceGroups).toHaveLength(2);
    expect(apiMapping?.referenceGroups[0].isGroup).toBe(true);
    expect(apiMapping?.referenceGroups[0].sourceProperty.fullPropertyName).toBe('Grade');
    expect(apiMapping?.referenceGroups[1].isGroup).toBe(true);
    expect(apiMapping?.referenceGroups[1].sourceProperty.fullPropertyName).toBe('GradingPeriod');
  });

  it('should have correct ReportCard flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('ReportCard');
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties).toHaveLength(4);
    expect(apiMapping?.flattenedIdentityProperties[0].identityProperty.fullPropertyName).toBe('GradingPeriodIdentity');
    expect(apiMapping?.flattenedIdentityProperties[1].identityProperty.fullPropertyName).toBe('SchoolId');
    expect(apiMapping?.flattenedIdentityProperties[2].identityProperty.fullPropertyName).toBe('SchoolYear');
    expect(apiMapping?.flattenedIdentityProperties[3].identityProperty.fullPropertyName).toBe('ReportCardIdentity');
  });

  it('should have correct property paths in ReportCard flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('ReportCard');
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "GradingPeriod.GradingPeriodIdentity",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "GradingPeriod.School",
        "GradingPeriod.School.SchoolId",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[2].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "GradingPeriod.SchoolYear",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[3].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "ReportCardIdentity",
      ]
    `);
  });

  it('should have correct property chain in ReportCard flattened identity properties', () => {
    const sectionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('ReportCard');
    const apiMapping = sectionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[0].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "GradingPeriodIdentity",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[1].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "School",
        "SchoolId",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[2].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "SchoolYear",
      ]
    `);
    expect(apiMapping?.flattenedIdentityProperties[3].propertyChain.map((x) => x.fullPropertyName)).toMatchInlineSnapshot(`
      Array [
        "ReportCardIdentity",
      ]
    `);
  });
});
