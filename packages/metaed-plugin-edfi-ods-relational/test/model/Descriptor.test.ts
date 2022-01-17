import {
  DescriptorBuilder,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as initializeOdsPlugin } from '../../index';

describe('when descriptor is required property of domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const extensionNamespace = 'Extension';
  const descriptorName = 'DescriptorName';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DummyCoreEntity')
      .withDocumentation('doc')
      .withIntegerIdentity('DummyCoreInteger', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespace)
      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity(integerPropertyName, 'doc')
      .withDescriptorProperty(descriptorName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    metaEd.dataStandardVersion = '3.0.0';
    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeOdsPlugin().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should not crash', (): void => {
    expect(true).toBe(true);
  });
});
