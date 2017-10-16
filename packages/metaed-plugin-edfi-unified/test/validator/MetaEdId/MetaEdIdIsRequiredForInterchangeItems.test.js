// @flow
import {
  InterchangeBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../../metaed-plugin-edfi-unified/src/validator/MetaEdId/MetaEdIdIsRequiredForInterchangeItems';


describe('when validating interchange element is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForInterchangeItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating interchange element is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange element is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating interchange extension element is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeExtensionName')
      .withDomainEntityElement('DomainEntityElementName')
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
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForInterchangeItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating interchange extension element is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange extension element is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating interchange identity template is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName')
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForInterchangeItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating interchange identity template is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange identity template is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating interchange extension identity template is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeExtensionName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName')
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
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForInterchangeItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating interchange extension identity template is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange extension identity template is missing metaEdId should have validation failures -> sourceMap');
  });
});
