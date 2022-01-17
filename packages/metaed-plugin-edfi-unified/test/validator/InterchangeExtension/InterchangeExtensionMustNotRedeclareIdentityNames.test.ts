import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareIdentityName';

describe('when validating interchange extension identity template has different names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName1')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName2')
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one interchange extension', (): void => {
    expect(coreNamespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange identity template has duplicate names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityIdentityTemplateName = 'DomainEntityIdentityTemplateName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one interchange extension', (): void => {
    expect(coreNamespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating interchange identity template has multiple duplicate names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityIdentityTemplateName1 = 'DomainEntityIdentityTemplateName1';
  const domainEntityIdentityTemplateName2 = 'DomainEntityIdentityTemplateName2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName2)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName2)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one interchange extension', (): void => {
    expect(coreNamespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('InterchangeExtensionMustNotRedeclareIdentityName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});
