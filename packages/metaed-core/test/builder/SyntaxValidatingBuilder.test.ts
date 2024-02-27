import { SyntaxValidatingBuilder } from '../../src/builder/SyntaxValidatingBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment, MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('given data standard 3.2 when building EdFi domain entity with is weak property without Alliance mode', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.dataStandardVersion = '3.2.0-c';
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi', '')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withDomainEntityProperty('Property', 'doc', true, false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new SyntaxValidatingBuilder(metaEd, validationFailures));
  });

  it('should not have validation failures', (): void => {
    expect(validationFailures.length).toBe(0);
  });
});

describe('given data standard 3.2 when building EdFi domain entity with is weak property with Alliance mode', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.dataStandardVersion = '3.2.0-c';
  metaEd.allianceMode = true;
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withDomainEntityProperty('Property', 'doc', true, false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new SyntaxValidatingBuilder(metaEd, validationFailures));
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toMatchInlineSnapshot(`
    Array [
      Object {
        "category": "warning",
        "fileMap": null,
        "message": "The 'is weak' keyword will be deprecated in a future version of MetaEd.",
        "sourceMap": Object {
          "column": 6,
          "line": 9,
          "tokenText": "is weak",
        },
        "validatorName": "SyntaxValidatingBuilder",
      },
    ]
    `);
  });
});

describe('given data standard 3.2 when building extension domain entity with is weak property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.dataStandardVersion = '3.2.0-c';
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withDomainEntityProperty('Property', 'doc', true, false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new SyntaxValidatingBuilder(metaEd, validationFailures));
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toMatchInlineSnapshot(`
    Array [
      Object {
        "category": "warning",
        "fileMap": null,
        "message": "The 'is weak' keyword will be deprecated in a future version of MetaEd.",
        "sourceMap": Object {
          "column": 6,
          "line": 9,
          "tokenText": "is weak",
        },
        "validatorName": "SyntaxValidatingBuilder",
      },
    ]
    `);
  });
});

describe('given data standard 3.3b when building extension domain entity with is weak property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.dataStandardVersion = '3.3.1-b';
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withDomainEntityProperty('Property', 'doc', true, false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new SyntaxValidatingBuilder(metaEd, validationFailures));
  });

  it('should have one validation error', (): void => {
    expect(validationFailures.length).toBe(1);
    expect(validationFailures[0].validatorName).toBe('SyntaxValidatingBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"The 'is weak' keyword has been deprecated, as it is not compatible with data standard versions > 3.2.x"`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 6,
        "line": 9,
        "tokenText": "is weak",
      }
    `);
  });
});

describe('when building domain entity with renamed identity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withDomainEntityElement('PropertyName')
      .withDocumentation('doc')
      .withIdentityRenameIndicator('BaseName')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new SyntaxValidatingBuilder(metaEd, validationFailures));
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "warning",
          "fileMap": null,
          "message": "The 'renames identity property' keyword will be deprecated in a future version of MetaEd.",
          "sourceMap": Object {
            "column": 4,
            "line": 8,
            "tokenText": "renames identity property",
          },
          "validatorName": "SyntaxValidatingBuilder",
        },
      ]
    `);
  });
});

describe('when building domain entity with short property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withShortProperty('Property', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new SyntaxValidatingBuilder(metaEd, validationFailures));
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "warning",
          "fileMap": null,
          "message": "The 'short' property will be deprecated in a future version of MetaEd. Use 'integer' with a max value instead.",
          "sourceMap": Object {
            "column": 4,
            "line": 5,
            "tokenText": "short",
          },
          "validatorName": "SyntaxValidatingBuilder",
        },
      ]
    `);
  });
});

describe('when building domain entity with shared short property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withSharedShortProperty('Property', null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new SyntaxValidatingBuilder(metaEd, validationFailures));
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "warning",
          "fileMap": null,
          "message": "The 'shared short' property will be deprecated in a future version of MetaEd. Use 'shared integer' and reference a Shared Integer with a max value instead.",
          "sourceMap": Object {
            "column": 4,
            "line": 5,
            "tokenText": "shared short",
          },
          "validatorName": "SyntaxValidatingBuilder",
        },
      ]
    `);
  });
});

describe('when building shared short', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartSharedShort('EntityName')
      .withDocumentation('doc')
      .withNumericRestrictions('0', '1')
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new SyntaxValidatingBuilder(metaEd, validationFailures));
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "warning",
          "fileMap": null,
          "message": "The 'Shared Short' entity will be deprecated in a future version of MetaEd. Use 'Shared Integer' with a max value instead.",
          "sourceMap": Object {
            "column": 2,
            "line": 2,
            "tokenText": "Shared Short",
          },
          "validatorName": "SyntaxValidatingBuilder",
        },
      ]
    `);
  });
});
