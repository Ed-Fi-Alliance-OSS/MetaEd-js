// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareBaseInterchangeElements';

describe('when validating interchange extension elements has different names than base interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName: string = 'InterchangeName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName1')
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement('DomainEntityElementName2')
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange extension elements duplicates names in base interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName: string = 'InterchangeName';
  const domainEntityElementName: string = 'DomainEntityElementName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement(domainEntityElementName)
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(domainEntityElementName)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeElements');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating interchange extension elements duplicates names in base interchange should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange extension elements duplicates names in base interchange should have validation failure -> sourceMap');
  });
});

describe('when interchange extension elements duplicates multiple names in base interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName: string = 'InterchangeName';
  const domainEntityElementName1: string = 'DomainEntityElementName1';
  const domainEntityElementName2: string = 'DomainEntityElementName2';
  const notDuplicateDomainEntityTemplateName: string = 'NotDuplicateDomainEntityElementName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement(domainEntityElementName1)
      .withDomainEntityElement(domainEntityElementName2)
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(domainEntityElementName1)
      .withDomainEntityElement(domainEntityElementName2)
      .withDomainEntityIdentityTemplate(notDuplicateDomainEntityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeElements');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).not.toMatch(new RegExp(notDuplicateDomainEntityTemplateName));
    expect(failures[0].message).toMatchSnapshot('when interchange extension elements duplicates multiple names in base interchange should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when interchange extension elements duplicates multiple names in base interchange should have validation failure -> sourceMap');

    expect(failures[1].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeElements');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).not.toMatch(new RegExp(notDuplicateDomainEntityTemplateName));
    expect(failures[1].message).toMatchSnapshot('when interchange extension elements duplicates multiple names in base interchange should have validation failure -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when interchange extension elements duplicates multiple names in base interchange should have validation failure -> sourceMap');
  });
});
