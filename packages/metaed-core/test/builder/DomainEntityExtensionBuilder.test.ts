import { DomainEntityExtensionBuilder } from '../../src/builder/DomainEntityExtensionBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getDomainEntityExtension } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building domain entity extension in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain entity extension', (): void => {
    expect(namespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName)).toBeDefined();
    expect(getDomainEntityExtension(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have base entity namespace', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).baseEntityNamespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should not be deprecated', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have one property', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const integerProperty = getDomainEntityExtension(namespace.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });
});

describe('when building deprecated domain entity extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(entityName)
      .withDeprecated(deprecationReason)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain entity extension', (): void => {
    expect(namespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getDomainEntityExtension(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building domain entity extension in extension namespace extending core entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const coreNamespaceName = 'EdFi';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(`${coreNamespaceName}.${entityName}`)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });
  it('should have extendee name', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have base entity namespace', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).baseEntityNamespaceName).toBe(coreNamespaceName);
  });
});

describe('when building duplicate domain entity extensions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartDomainEntityExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain entity extension', (): void => {
    expect(namespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName)).toBeDefined();
    expect(getDomainEntityExtension(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Domain Entity Extension named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 16,
              "line": 7,
              "tokenText": "EntityName",
            }
        `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Domain Entity Extension named EntityName is a duplicate declaration of that name."`,
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

describe('when building domain entity extension with no domain entity extension name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(entityName)
      .withIntegerProperty(propertyName, documentation, true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build domain entity extension', (): void => {
    expect(namespace.entity.domainEntityExtension.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "no viable alternative at input 'Domain Entityadditions', column: 17, line: 2, token: additions",
              "no viable alternative at input 'Domain Entityadditions', column: 17, line: 2, token: additions",
            ]
        `);
  });
});

describe('when building domain entity extension with lowercase domain entity extension name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(entityName)
      .withIntegerProperty(propertyName, documentation, true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build domain entity extension', (): void => {
    expect(namespace.entity.domainEntityExtension.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "no viable alternative at input 'Domain Entitye', column: 16, line: 2, token: e",
              "no viable alternative at input 'Domain Entitye', column: 16, line: 2, token: e",
            ]
        `);
  });
});

describe('when building domain entity extension with no property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(entityName)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain entity extension', (): void => {
    expect(namespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName)).toBeDefined();
    expect(getDomainEntityExtension(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no property', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).properties).toHaveLength(0);
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

describe('when building domain entity extension with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(entityName)
      .withIntegerProperty(propertyName, documentation, true, false)
      .withTrailingText(trailingText)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });
  it('should build one domain entity extension', (): void => {
    expect(namespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName)).toBeDefined();
    expect(getDomainEntityExtension(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have one property', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const integerProperty = getDomainEntityExtension(namespace.entity, entityName).properties[0];

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

describe('when building domain entity extension source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntityExtension(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have type property', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getDomainEntityExtension(namespace.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  it('should have baseEntityName', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).sourceMap.baseEntityName).toBeDefined();
    expect(getDomainEntityExtension(namespace.entity, entityName).sourceMap.baseEntityName.tokenText).toBe(entityName);
  });

  it('should have correct line, column, text', (): void => {
    expect(getDomainEntityExtension(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
          "column": 16,
          "line": 2,
          "tokenText": "EntityName",
        },
        "baseEntityNamespaceName": Object {
          "column": 16,
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
          "column": 16,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Domain Entity",
        },
      }
    `);
  });
});
