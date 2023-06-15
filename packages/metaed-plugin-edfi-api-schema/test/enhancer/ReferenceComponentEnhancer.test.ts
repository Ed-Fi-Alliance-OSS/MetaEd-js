import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  DescriptorBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, descriptorReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import {
  enhance as entityPropertyApiSchemaDataSetupEnhancer,
  EntityPropertyApiSchemaData,
} from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance } from '../../src/enhancer/ReferenceComponentEnhancer';
import { isReferenceGroup, ReferenceGroup, isReferenceElement } from '../../src/model/ReferenceComponent';

describe('when building simple domain entity referencing another', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const resourceName = 'EntityName';
  const referencedEntityName = 'ReferencedEntityName';
  const identityPropertyName = 'IdentityPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace')
      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withDomainEntityIdentity(referencedEntityName, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(referencedEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity(identityPropertyName, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(builder);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have the referenced domain entitys identity property', () => {
    const property = metaEd.propertyIndex.domainEntity.find((p) => p.metaEdName === referencedEntityName) as any;
    const { referenceComponent } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
    expect(isReferenceGroup(referenceComponent)).toBe(true);
    expect((referenceComponent as ReferenceGroup).referenceComponents).toHaveLength(1);
    expect(isReferenceElement((referenceComponent as ReferenceGroup).referenceComponents[0])).toBe(true);
    expect((referenceComponent as ReferenceGroup).referenceComponents[0].sourceProperty.metaEdName).toBe(
      identityPropertyName,
    );
  });
});

describe('when building simple domain entity referencing a descriptor as part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const resourceName = 'EntityName';
  const descriptorName = 'DescriptorName';
  const identityPropertyName = 'IdentityPropertyName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace')
      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withIntegerIdentity(identityPropertyName, 'doc')
      .withDescriptorIdentity(descriptorName, 'doc')
      .withEndDomainEntity()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have the descriptor property without a group since descriptors have no identity properties', () => {
    const property = metaEd.propertyIndex.descriptor.find((p) => p.metaEdName === descriptorName) as any;
    const { referenceComponent } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
    expect(isReferenceElement(referenceComponent)).toBe(true);
  });
});

describe('when building simple domain entity referencing another referencing another without identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const resourceName = 'EntityName';
  const referencedEntityName = 'ReferencedEntityName';
  const subreferencedEntityName = 'SubreferencedEntityName';
  const integerIdentityPropertyName = 'IntegerIdentityPropertyName';
  const booleanIdentityPropertyName = 'BooleanIdentityPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace')
      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withBooleanProperty('Distraction1', 'doc', true, false)
      .withBooleanIdentity('Pk', 'doc')
      .withDomainEntityProperty(referencedEntityName, 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity(referencedEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('Distraction2', 'doc', true, false)
      .withIntegerIdentity(integerIdentityPropertyName, 'doc')
      .withDomainEntityProperty(subreferencedEntityName, 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity(subreferencedEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('Distraction3', 'doc', true, false)
      .withBooleanIdentity(booleanIdentityPropertyName, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(builder);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have the referenced domain entitys identity property', () => {
    const property = metaEd.propertyIndex.domainEntity.find((p) => p.metaEdName === referencedEntityName) as any;
    const { referenceComponent } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
    expect(isReferenceGroup(referenceComponent)).toBe(true);
    expect((referenceComponent as ReferenceGroup).referenceComponents).toHaveLength(1);
    expect(isReferenceElement((referenceComponent as ReferenceGroup).referenceComponents[0])).toBe(true);
    expect((referenceComponent as ReferenceGroup).referenceComponents[0].sourceProperty.metaEdName).toBe(
      integerIdentityPropertyName,
    );
  });
});

describe('when building simple domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const resourceName = 'EntityName';
  const referencedEntityName = 'ReferencedEntityName';
  const subreferencedEntityName = 'SubreferencedEntityName';
  const integerIdentityPropertyName = 'IntegerIdentityPropertyName';
  const booleanIdentityPropertyName = 'BooleanIdentityPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace')
      .withStartDomainEntity(resourceName)
      .withDocumentation('doc')
      .withBooleanProperty('Distraction1', 'doc', true, false)
      .withBooleanIdentity('Pk', 'doc')
      .withDomainEntityProperty(referencedEntityName, 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity(referencedEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('Distraction2', 'doc', true, false)
      .withIntegerIdentity(integerIdentityPropertyName, 'doc')
      .withDomainEntityIdentity(subreferencedEntityName, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(subreferencedEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('Distraction3', 'doc', true, false)
      .withBooleanIdentity(booleanIdentityPropertyName, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(builder);

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have the referenced domain entitys identity property', () => {
    const property = metaEd.propertyIndex.domainEntity.find((p) => p.metaEdName === referencedEntityName) as any;
    const { referenceComponent } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
    expect(isReferenceGroup(referenceComponent)).toBe(true);
    expect((referenceComponent as ReferenceGroup).referenceComponents).toHaveLength(2);
    expect(isReferenceElement((referenceComponent as ReferenceGroup).referenceComponents[0])).toBe(true);
    expect((referenceComponent as ReferenceGroup).referenceComponents[0].sourceProperty.metaEdName).toBe(
      integerIdentityPropertyName,
    );

    const referenceComponent2 = (referenceComponent as ReferenceGroup).referenceComponents[1];
    expect(isReferenceGroup(referenceComponent2)).toBe(true);
    expect((referenceComponent2 as ReferenceGroup).referenceComponents).toHaveLength(1);
    expect(isReferenceElement((referenceComponent2 as ReferenceGroup).referenceComponents[0])).toBe(true);
    expect((referenceComponent2 as ReferenceGroup).referenceComponents[0].sourceProperty.metaEdName).toBe(
      booleanIdentityPropertyName,
    );
  });
});
