import { newMetaEdEnvironment, MetaEdTextBuilder, NamespaceBuilder, DomainEntityBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Deprecated/DeprecatedEntityWarning';

describe('when entity is not deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntity')
      .withDocumentation('doc')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when entities are deprecated in alliance mode', (): void => {
  const metaEd: MetaEdEnvironment = {
    ...newMetaEdEnvironment(),
    allianceMode: true,
  };
  const coreDeprecationReason = 'is deprecated in core';
  const extensionDeprecationReason = 'is deprecated in extension';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDeprecated(coreDeprecationReason)
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntity')
      .withDeprecated(extensionDeprecationReason)
      .withDocumentation('doc')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DeprecatedEntityWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"EntityName is deprecated."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 16,
        "line": 2,
        "tokenText": "EntityName",
      }
    `);

    expect(failures[1].validatorName).toBe('DeprecatedEntityWarning');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchInlineSnapshot(`"ExtensionEntity is deprecated."`);
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 16,
        "line": 12,
        "tokenText": "ExtensionEntity",
      }
    `);
  });
});

describe('when entities are deprecated not in alliance mode', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreDeprecationReason = 'is deprecated in core';
  const extensionDeprecationReason = 'is deprecated in extension';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDeprecated(coreDeprecationReason)
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntity')
      .withDeprecated(extensionDeprecationReason)
      .withDocumentation('doc')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);

    expect(failures[0].validatorName).toBe('DeprecatedEntityWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"ExtensionEntity is deprecated."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 16,
        "line": 12,
        "tokenText": "ExtensionEntity",
      }
    `);
  });
});
