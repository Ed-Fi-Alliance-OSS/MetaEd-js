// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareIdentityName';

describe('when validating interchange extension identity template has different names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName1')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName2')
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange identity template has duplicate names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityIdentityTemplateName: string = 'DomainEntityIdentityTemplateName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating interchange identity template has duplicate names should have no validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange identity template has duplicate names should have no validation failures -> sourceMap');
  });
});

describe('when validating interchange identity template has multiple duplicate names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityIdentityTemplateName1: string = 'DomainEntityIdentityTemplateName1';
  const domainEntityIdentityTemplateName2: string = 'DomainEntityIdentityTemplateName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName2)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName2)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating interchange identity template has multiple duplicate names should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange identity template has multiple duplicate names should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('InterchangeExtensionMustNotRedeclareIdentityName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot('when validating interchange identity template has multiple duplicate names should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating interchange identity template has multiple duplicate names should have validation failures -> sourceMap');
  });
});
