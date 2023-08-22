import { SharedStringBuilder } from '../../src/builder/SharedStringBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getSharedString } from '../TestHelper';
import { SharedStringSourceMap } from '../../src/model/SharedString';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared string in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared string', (): void => {
    expect(namespace.entity.sharedString.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSharedString(namespace.entity, entityName)).toBeDefined();
    expect(getSharedString(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedString(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getSharedString(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have min length', (): void => {
    expect(getSharedString(namespace.entity, entityName).minLength).toBe(minLength);
  });

  it('should have max length', (): void => {
    expect(getSharedString(namespace.entity, entityName).maxLength).toBe(maxLength);
  });
});

describe('when building deprecated shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared string', (): void => {
    expect(namespace.entity.sharedString.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getSharedString(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getSharedString(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building duplicate shared strings', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()

      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared string', (): void => {
    expect(namespace.entity.sharedString.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSharedString(namespace.entity, entityName)).toBeDefined();
    expect(getSharedString(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('SharedSimpleBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Shared String named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 16,
              "line": 7,
              "tokenText": "EntityName",
            }
        `);

    expect(validationFailures[1].validatorName).toBe('SharedSimpleBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Shared String named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 16,
              "line": 2,
              "tokenText": "EntityName",
            }
        `);
  });
});

describe('when building shared string with no shared string name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build shared string', (): void => {
    expect(namespace.entity.sharedString.size).toBe(0);
  });

  it('should have missing id error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "missing ID at 'documentation', column: 4, line: 3, token: documentation",
        "missing ID at 'documentation', column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building shared string with lowercase shared string name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no shared string', (): void => {
    expect(namespace.entity.sharedString.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'e' expecting ID, column: 16, line: 2, token: e",
              "mismatched input 'e' expecting ID, column: 16, line: 2, token: e",
            ]
        `);
  });
});

describe('when building shared string with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const minLength = '2';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should not have documentation', (): void => {
    expect(getSharedString(namespace.entity, entityName).documentation).toBe('');
  });

  it('should have no min length', (): void => {
    expect(getSharedString(namespace.entity, entityName).minLength).toBe('');
  });

  it('should have no max length', (): void => {
    expect(getSharedString(namespace.entity, entityName).maxLength).toBe('');
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'min length' expecting {'deprecated', 'documentation', METAED_ID}, column: 6, line: 3, token: min length",
        "mismatched input 'min length' expecting {'deprecated', 'documentation', METAED_ID}, column: 6, line: 3, token: min length",
      ]
    `);
  });
});

describe('when building shared string with no min length', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedString(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have a min length because max length token was ignored', (): void => {
    expect(getSharedString(namespace.entity, entityName).minLength).toBe(maxLength);
  });

  it('should not have max length', (): void => {
    expect(getSharedString(namespace.entity, entityName).maxLength).toBe('');
  });

  it('should have extraneous input and mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "extraneous input 'max length' expecting UNSIGNED_INT, column: 6, line: 6, token: max length",
              "mismatched input 'End Namespace' expecting 'max length', column: 0, line: 7, token: End Namespace",
              "extraneous input 'max length' expecting UNSIGNED_INT, column: 6, line: 6, token: max length",
              "mismatched input 'End Namespace' expecting 'max length', column: 0, line: 7, token: End Namespace",
            ]
        `);
  });
});

describe('when building shared string with no max length', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedString(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have min length', (): void => {
    expect(getSharedString(namespace.entity, entityName).minLength).toBe(minLength);
  });

  it('should no max length', (): void => {
    expect(getSharedString(namespace.entity, entityName).maxLength).toBe('');
  });

  it('should have missing unsigned int error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "missing UNSIGNED_INT at 'End Namespace', column: 0, line: 7, token: End Namespace",
              "missing UNSIGNED_INT at 'End Namespace', column: 0, line: 7, token: End Namespace",
            ]
        `);
  });
});

describe('when building shared string with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withTrailingText(trailingText)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedString(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedString(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have min length', (): void => {
    expect(getSharedString(namespace.entity, entityName).minLength).toBe(minLength);
  });

  it('should have max length', (): void => {
    expect(getSharedString(namespace.entity, entityName).maxLength).toBe(maxLength);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 7, token: TrailingText",
              "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 7, token: TrailingText",
            ]
        `);
  });
});

describe('when building shared string source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedStringBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  // SharedSimpleSourceMap
  it('should have type', (): void => {
    expect(getSharedString(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getSharedString(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getSharedString(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getSharedString(namespace.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  // SharedStringSourceMap
  it('should have minLength', (): void => {
    expect((getSharedString(namespace.entity, entityName).sourceMap as SharedStringSourceMap).minLength).toBeDefined();
  });

  it('should have maxLength', (): void => {
    expect((getSharedString(namespace.entity, entityName).sourceMap as SharedStringSourceMap).maxLength).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getSharedString(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 4,
          "line": 3,
          "tokenText": "documentation",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "maxLength": Object {
          "column": 6,
          "line": 6,
          "tokenText": "max length",
        },
        "metaEdName": Object {
          "column": 16,
          "line": 2,
          "tokenText": "EntityName",
        },
        "minLength": Object {
          "column": 6,
          "line": 5,
          "tokenText": "min length",
        },
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Shared String",
        },
      }
    `);
  });
});
