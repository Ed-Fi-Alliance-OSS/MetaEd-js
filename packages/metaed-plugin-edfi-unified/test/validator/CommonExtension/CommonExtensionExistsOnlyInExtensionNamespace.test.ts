import { newMetaEdEnvironment, MetaEdTextBuilder, CommonExtensionBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CommonExtension/CommonExtensionExistsOnlyInExtensionNamespace';

describe('when common extension is in correct namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName = 'CommonName';
  let failures: ValidationFailure[];
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonExtension(commonName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));
    extensionNamespace = metaEd.namespace.get('Extension');
    failures = validate(metaEd);
  });

  it('should build one common extension', (): void => {
    expect(extensionNamespace.entity.commonExtension.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when common extension is in core namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName = 'CommonName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndCommon()

      .withStartCommonExtension(commonName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));
    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one common extension', (): void => {
    expect(coreNamespace.entity.commonExtension.size).toBe(1);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('CommonExtensionExistsOnlyInExtensionNamespace');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when common extension is in core namespace should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when common extension is in core namespace should have validation failure -> sourceMap',
    );
  });
});
