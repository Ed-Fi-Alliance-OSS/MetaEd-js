import { SyntaxValidatingBuilder } from '../../src/builder/SyntaxValidatingBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment, MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building domain entity with is weak property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
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
    expect(validationFailures).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with is queryable field property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withDomainEntityProperty('Property', 'doc', true, false)
      .withQueryableFieldPropertyIndicator()
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
          "message": "The 'is queryable field' keyword will be deprecated in a future version of MetaEd.",
          "sourceMap": Object {
            "column": 4,
            "line": 9,
            "tokenText": "is queryable field",
          },
          "validatorName": "SyntaxValidatingBuilder",
        },
      ]
    `);
  });
});

describe('when building domain entity with is queryable only property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withDomainEntityElement('Property')
      .withDocumentation('doc')
      .withQueryableOnlyPropertyIndicator()
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
          "message": "The 'is queryable only' keyword will be deprecated in a future version of MetaEd.",
          "sourceMap": Object {
            "column": 4,
            "line": 8,
            "tokenText": "is queryable only",
          },
          "validatorName": "SyntaxValidatingBuilder",
        },
      ]
    `);
  });
});

describe('when building domain entity with shorten to property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Namespace', 'ProjectExtension')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withCommonProperty('Property', 'doc', true, false, 'Context', null, 'ShortenTo')
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
          "message": "The 'shorten to' keyword will be deprecated in a future version of MetaEd.",
          "sourceMap": Object {
            "column": 35,
            "line": 9,
            "tokenText": "ShortenTo",
          },
          "validatorName": "SyntaxValidatingBuilder",
        },
      ]
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
