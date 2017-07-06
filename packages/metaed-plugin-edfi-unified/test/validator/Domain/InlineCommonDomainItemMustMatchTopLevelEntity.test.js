// @flow
import DomainBuilder from '../../../../../packages/metaed-core/src/builder/DomainBuilder';
import CommonBuilder from '../../../../../packages/metaed-core/src/builder/CommonBuilder';
import MetaEdTextBuilder from '../../../../../packages/metaed-core/test/MetaEdTextBuilder';
import { metaEdEnvironmentFactory } from '../../../../../packages/metaed-core/src/MetaEdEnvironment';
import type { MetaEdEnvironment } from '../../../../../packages/metaed-core/src/MetaEdEnvironment';
import { validate } from '../../../src/validator/Domain/InlineCommonDomainItemMustMatchTopLevelEntity';
import type { ValidationFailure } from '../../../../../packages/metaed-core/src/validator/ValidationFailure';

describe('when validating inline common domain item matches top level entity', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const domainName: string = 'DomainName';
  const inlineCommonName: string = 'InlineCommonName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withInlineCommonDomainItem(inlineCommonName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartCommon(inlineCommonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withInlineCommonProperty('InlineInOds', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    // $FlowIgnore
    metaEd.entity.common.get(inlineCommonName).inlineInOds = true;

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating inline common domain item does not match top level entity', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const domainName: string = 'DomainName';
  const inlineCommonName: string = 'InlineCommonName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withInlineCommonDomainItem('InlineCommonDomainItemName')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartCommon(inlineCommonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withInlineCommonProperty('InlineInOds', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    // $FlowIgnore
    metaEd.entity.common.get(inlineCommonName).inlineInOds = true;

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have one validation failure()', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('CommonDomainItemMustMatchTopLevelEntity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when common domain item has no matching top level entity should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when common domain item has no matching top level entity should have validation failure -> sourceMap');
  });
});
