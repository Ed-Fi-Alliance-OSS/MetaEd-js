import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
} from 'metaed-core';
import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/Deprecated/IsWeakDeprecated';

describe('when isWeak property is true', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  metaEd.dataStandardVersion = '3.3.2';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

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
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(builder);

    failures = validate(metaEd);
  });

  it('should have validation errors', (): void => {
    expect(failures.length).toBeGreaterThan(0);
  });
});

describe('when isWeak property is false', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  metaEd.dataStandardVersion = '3.3.2';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

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
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(builder);

    failures = validate(metaEd);
  });

  it('should not have validation errors', (): void => {
    expect(failures.length).toBe(0);
  });
});

describe('when DS version does not satisfy >= 3.3.0-a', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  metaEd.dataStandardVersion= '3.0.1';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

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
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(builder);

    failures = validate(metaEd);
  });

  it('should not have validation errors', (): void => {
    expect(failures).toHaveLength(0);
  });
});
