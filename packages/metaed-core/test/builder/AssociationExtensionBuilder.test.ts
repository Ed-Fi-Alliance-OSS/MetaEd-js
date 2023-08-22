import { AssociationExtensionBuilder } from '../../src/builder/AssociationExtensionBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getAssociationExtension } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building association extension in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association extension', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationExtension(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have base entity namespace', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).baseEntityNamespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should not be deprecated', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have one property', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const integerProperty = getAssociationExtension(namespace.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });
});

describe('when building deprecated association extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(entityName)
      .withDeprecated(deprecationReason)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association extension', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getAssociationExtension(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building association extension in extension namespace extending core entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const coreNamespaceName = 'EdFi';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(`${coreNamespaceName}.${entityName}`)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have extendee name', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have base entity namespace', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).baseEntityNamespaceName).toBe(coreNamespaceName);
  });
});

describe('when building duplicate association extensions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()

      .withStartAssociationExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association extension', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationExtension(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Association Extension named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 14,
              "line": 7,
              "tokenText": "EntityName",
            }
        `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Association Extension named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 14,
              "line": 2,
              "tokenText": "EntityName",
            }
        `);
  });
});

describe('when building association extension with no association extension name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build association extension', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "no viable alternative at input 'Associationadditions', column: 15, line: 2, token: additions",
              "no viable alternative at input 'Associationadditions', column: 15, line: 2, token: additions",
            ]
        `);
  });
});

describe('when building association extension with lowercase association extension name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build association extension', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "no viable alternative at input 'Associatione', column: 14, line: 2, token: e",
              "no viable alternative at input 'Associatione', column: 14, line: 2, token: e",
            ]
        `);
  });
});

describe('when building association extension with no property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(entityName)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association extension', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationExtension(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no property', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'End Namespace' expecting {'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'deprecated', METAED_ID}, column: 0, line: 3, token: End Namespace",
        "mismatched input 'End Namespace' expecting {'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'deprecated', METAED_ID}, column: 0, line: 3, token: End Namespace",
      ]
    `);
  });
});

describe('when building association extension with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withTrailingText(trailingText)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association extension', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationExtension(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have one property', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const integerProperty = getAssociationExtension(namespace.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name'}, column: 0, line: 7, token: TrailingText",
              "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name'}, column: 0, line: 7, token: TrailingText",
            ]
        `);
  });
});

describe('when building association extension source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;
  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have a metaEdName property', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have a type property', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map data', (): void => {
    expect(getAssociationExtension(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
          "column": 14,
          "line": 2,
          "tokenText": "EntityName",
        },
        "baseEntityNamespaceName": Object {
          "column": 14,
          "line": 2,
          "tokenText": "EntityName",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 14,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Association",
        },
      }
    `);
  });
});
