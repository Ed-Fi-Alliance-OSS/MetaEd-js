// @flow
import { DomainBuilder, newMetaEdEnvironment, MetaEdTextBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../../metaed-plugin-edfi-unified/src/validator/MetaEdId/MetaEdIdIsRequiredForDomainItems';

describe('when validating domain item is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain('DomainName')
      .withDocumentation('DomainDocumentation')
      .withDomainEntityDomainItem('DomainItemName')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForDomainItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when validating domain item is missing metaEdId should have validation failures -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating domain item is missing metaEdId should have validation failures -> sourceMap',
    );
  });
});

describe('when validating subdomain item is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('SubdomainDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForDomainItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when validating subdomain is missing metaEdId for entity should have validation failures -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating subdomain is missing metaEdId for entity should have validation failures -> sourceMap',
    );
  });
});
