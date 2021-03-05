import { newMetaEdEnvironment, MetaEdTextBuilder, NamespaceBuilder, DomainEntityBuilder } from 'metaed-core';
import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/Deprecated/IsWeakDeprecated';

describe('when isWeak property is true', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  metaEd.dataStandardVersion = '3.3.2';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('NamespaceName')
      .withStartDomainEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withDomainEntityElement('PropertyName')
      .withDocumentation('PropertyDocumentation')
      .withIsWeakReference(true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have one validation error', (): void => {
    expect(failures.length).toBe(1);
    expect(failures[0].validatorName).toBe('IsWeakDeprecated');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"The 'is weak' keyword has been deprecated, as it is not compatible with data standard versions > 3.2.x"`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 4,
        "line": 8,
        "tokenText": "is weak",
      }
    `);
  });
});

describe('when isWeak property is false', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  metaEd.dataStandardVersion = '3.3.2';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('NamespaceName')
      .withStartDomainEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withDomainEntityElement('PropertyName')
      .withDocumentation('PropertyDocumentation')
      .withIsWeakReference(false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should not have validation errors', (): void => {
    expect(failures.length).toBe(0);
  });
});

describe('when DS version does not satisfy >= 3.3.0-a', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  metaEd.dataStandardVersion = '3.0.1';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('NamespaceName')
      .withStartDomainEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withDomainEntityElement('PropertyName')
      .withIsWeakReference(true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should not have validation errors', (): void => {
    expect(failures).toHaveLength(0);
  });
});
