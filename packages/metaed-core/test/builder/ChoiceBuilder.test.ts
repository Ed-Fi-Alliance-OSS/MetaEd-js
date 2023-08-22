import { ChoiceBuilder } from '../../src/builder/ChoiceBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getChoice } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building choice in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const entityDocumentation = 'EntityDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one choice', (): void => {
    expect(namespace.entity.choice.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getChoice(namespace.entity, entityName)).toBeDefined();
    expect(getChoice(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getChoice(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getChoice(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getChoice(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should not be deprecated', (): void => {
    expect(getChoice(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have one property', (): void => {
    expect(getChoice(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const property = getChoice(namespace.entity, entityName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });
});

describe('when building deprecated choice', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one choice', (): void => {
    expect(namespace.entity.choice.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getChoice(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getChoice(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building duplicate choices', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const entityDocumentation = 'EntityDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndChoice()

      .withStartChoice(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one choice', (): void => {
    expect(namespace.entity.choice.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getChoice(namespace.entity, entityName)).toBeDefined();
    expect(getChoice(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Choice named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 9,
        "tokenText": "EntityName",
      }
    `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Choice named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 2,
        "tokenText": "EntityName",
      }
    `);
  });
});

describe('when building choice with no choice name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const entityDocumentation = 'EntityDocumentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build choice', (): void => {
    expect(namespace.entity.choice.size).toBe(0);
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

describe('when building choice with lowercase choice name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const entityDocumentation = 'EntityDocumentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no choice', (): void => {
    expect(namespace.entity.choice.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'e' expecting ID, column: 9, line: 2, token: e",
        "mismatched input 'e' expecting ID, column: 9, line: 2, token: e",
      ]
    `);
  });
});

describe('when building choice with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be found in entity repository', (): void => {
    expect(getChoice(namespace.entity, entityName)).toBeDefined();
    expect(getChoice(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getChoice(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getChoice(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getChoice(namespace.entity, entityName).documentation).toBe('');
  });

  it('should have no properties', (): void => {
    expect(getChoice(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'integer' expecting {'deprecated', 'documentation', METAED_ID}, column: 4, line: 3, token: integer",
        "mismatched input 'integer' expecting {'deprecated', 'documentation', METAED_ID}, column: 4, line: 3, token: integer",
      ]
    `);
  });
});

describe('when building choice with no property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withDocumentation(entityDocumentation)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be found in entity repository', (): void => {
    expect(getChoice(namespace.entity, entityName)).toBeDefined();
    expect(getChoice(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getChoice(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getChoice(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getChoice(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have no property', (): void => {
    expect(getChoice(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'End Namespace' expecting {'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year'}, column: 0, line: 5, token: End Namespace",
        "mismatched input 'End Namespace' expecting {'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year'}, column: 0, line: 5, token: End Namespace",
      ]
    `);
  });
});

describe('when building choice with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withTrailingText(trailingText)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be found in entity repository', (): void => {
    expect(getChoice(namespace.entity, entityName)).toBeDefined();
    expect(getChoice(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getChoice(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getChoice(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getChoice(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have one property', (): void => {
    expect(getChoice(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const property = getChoice(namespace.entity, entityName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name'}, column: 0, line: 9, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name'}, column: 0, line: 9, token: TrailingText",
      ]
    `);
  });
});

describe('when building choice source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const entityDocumentation = 'EntityDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartChoice(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have a documentation property', (): void => {
    expect(getChoice(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have a metaEdName property', (): void => {
    expect(getChoice(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have a type property', (): void => {
    expect(getChoice(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map data', (): void => {
    expect(getChoice(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "allowPrimaryKeyUpdates": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityNamespaceName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
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
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 9,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Choice",
        },
      }
    `);
  });
});
