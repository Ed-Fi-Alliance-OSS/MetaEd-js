import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainBuilder,
  DescriptorBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Domain/DescriptorDomainItemMustMatchTopLevelEntity';

describe('when validating descriptor domain item matches top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const descriptorName = 'DescriptorName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withDescriptorDomainItem(descriptorName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating descriptor domain item matches top level entity across namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const descriptorName = 'DescriptorName';

  let failures: ValidationFailure[];
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withDescriptorDomainItem(`EdFi.${descriptorName}`)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies = [coreNamespace];
    failures = validate(metaEd);
  });

  it('should build one domain', (): void => {
    expect(extensionNamespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating descriptor domain item does not match top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const descriptorName = 'DescriptorName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withDescriptorDomainItem('DescriptorDomainItemName')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartDescriptor(descriptorName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should have one validation failure()', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DescriptorDomainItemMustMatchTopLevelEntity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
