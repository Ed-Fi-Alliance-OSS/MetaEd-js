// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareElements';

describe('when validating interchange extension element has different names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityElement('DomainEntityElementName1')
      .withDomainEntityElement('DomainEntityElementName2')
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

describe('when validating interchange element has duplicate names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityElementName: string = 'DomainEntityElementName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityElement(domainEntityElementName)
      .withDomainEntityElement(domainEntityElementName)
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
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareElements');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating interchange element has duplicate names should have no validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange element has duplicate names should have no validation failures -> sourceMap');
  });
});

describe('when validating interchange element has multiple duplicate names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityElementName1: string = 'DomainEntityElementName1';
  const domainEntityElementName2: string = 'DomainEntityElementName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeName')
      .withDomainEntityElement(domainEntityElementName1)
      .withDomainEntityElement(domainEntityElementName1)
      .withDomainEntityElement(domainEntityElementName2)
      .withDomainEntityElement(domainEntityElementName2)
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
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareElements');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating interchange element has multiple duplicate names should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange element has multiple duplicate names should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('InterchangeExtensionMustNotRedeclareElements');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot('when validating interchange element has multiple duplicate names should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating interchange element has multiple duplicate names should have validation failures -> sourceMap');
  });
});
