// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/Interchange/InterchangeMustNotRedeclareIdentityTemplates';

describe('when validating interchange identity template has different names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName1')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName2')
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
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
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeMustNotRedeclareIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating interchange identity template has duplicate names should have no validation failures -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating interchange identity template has duplicate names should have no validation failures -> sourceMap',
    );
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
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName2)
      .withDomainEntityIdentityTemplate(domainEntityIdentityTemplateName2)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('InterchangeMustNotRedeclareIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating interchange identity template has multiple duplicate names should have validation failures -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating interchange identity template has multiple duplicate names should have validation failures -> sourceMap',
    );
    expect(failures[1].validatorName).toBe('InterchangeMustNotRedeclareIdentityName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when validating interchange identity template has multiple duplicate names should have validation failures -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when validating interchange identity template has multiple duplicate names should have validation failures -> sourceMap',
    );
  });
});
