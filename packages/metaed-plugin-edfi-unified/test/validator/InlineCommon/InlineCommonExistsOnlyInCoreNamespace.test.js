// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, CommonBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/InlineCommon/InlineCommonExistsOnlyInCoreNamespace';

describe('when validating inline common type exists in core', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInlineCommon('EntityName')
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName', 'PropertyDocumentation', true, false)
      .withEndInlineCommon()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating inline common type exists in extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartInlineCommon('EntityName')
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName', 'PropertyDocumentation', true, false)
      .withEndInlineCommon()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InlineCommonExistsOnlyInCoreNamespace');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating inline common type exists in extension should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating inline common type exists in extension should have validation failure -> sourceMap',
    );
  });
});
