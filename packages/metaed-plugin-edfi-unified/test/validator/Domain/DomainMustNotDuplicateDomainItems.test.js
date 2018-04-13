// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/Domain/DomainMustNotDuplicateDomainItems';

describe('when validating domain entity domain item does not duplicate domain items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainItem1')
      .withDomainEntityDomainItem('DomainItem2')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity domain item duplicates domain items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const domainEntityName: string = 'DomainEntityName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DomainMustNotDuplicateDomainItems');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when domain entity domain item has duplicate should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when domain entity domain item has duplicate should have validation failure -> sourceMap',
    );
  });
});

describe('when validating domain entity domain item has multiple duplicate domain items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const domainEntityName: string = 'DomainEntityName';
  const domainEntityName2: string = 'DomainEntityName2';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName2)
      .withDomainEntityDomainItem(domainEntityName2)
      .withDomainEntityDomainItem('NotDuplicate')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have multiple validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DomainMustNotDuplicateDomainItems');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when domain entity domain item has duplicate should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when domain entity domain item has duplicate should have validation failure -> sourceMap',
    );
    expect(failures[1].validatorName).toBe('DomainMustNotDuplicateDomainItems');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when domain entity domain item has duplicate should have validation failure -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when domain entity domain item has duplicate should have validation failure -> sourceMap',
    );
  });
});
