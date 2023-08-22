import { CommonBuilder } from '../../src/builder/CommonBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getCommon } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building common in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getCommon(namespace.entity, entityName)).toBeDefined();
    expect(getCommon(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should not be inlined in ODS', (): void => {
    expect(getCommon(namespace.entity, entityName).inlineInOds).toBe(false);
  });

  it('should have entity documentation', (): void => {
    expect(getCommon(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should not be deprecated', (): void => {
    expect(getCommon(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have one property', (): void => {
    expect(getCommon(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const property = getCommon(namespace.entity, entityName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });
});

describe('when building deprecated common', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getCommon(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getCommon(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building duplicate commons', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndCommon()

      .withStartCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getCommon(namespace.entity, entityName)).toBeDefined();
    expect(getCommon(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Common named EntityName is a duplicate declaration of that name."`,
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
      `"Common named EntityName is a duplicate declaration of that name."`,
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

describe('when building inline common in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInlineCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getCommon(namespace.entity, entityName)).toBeDefined();
    expect(getCommon(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should be inlined in ODS', (): void => {
    expect(getCommon(namespace.entity, entityName).inlineInOds).toBe(true);
  });

  it('should have documentation', (): void => {
    expect(getCommon(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have one property', (): void => {
    expect(getCommon(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const property = getCommon(namespace.entity, entityName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });
});

describe('when building common with no common name', (): void => {
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
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build common', (): void => {
    expect(namespace.entity.common.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'Commondocumentation', column: 4, line: 3, token: documentation",
        "no viable alternative at input 'Commondocumentation', column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building common with lowercase common name', (): void => {
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
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build common', (): void => {
    expect(namespace.entity.common.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'Commone', column: 9, line: 2, token: e",
        "no viable alternative at input 'Commone', column: 9, line: 2, token: e",
      ]
    `);
  });
});

describe('when building common with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'CommonEntityNameinteger', column: 4, line: 3, token: integer",
        "no viable alternative at input 'CommonEntityNameinteger', column: 4, line: 3, token: integer",
      ]
    `);
  });
});

describe('when building common with no property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getCommon(namespace.entity, entityName)).toBeDefined();
    expect(getCommon(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should be inlined in ODS', (): void => {
    expect(getCommon(namespace.entity, entityName).inlineInOds).toBe(false);
  });

  it('should have documentation', (): void => {
    expect(getCommon(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have no property', (): void => {
    expect(getCommon(namespace.entity, entityName).properties).toHaveLength(0);
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

describe('when building common with invalid trailing text', (): void => {
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
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withTrailingText(trailingText)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getCommon(namespace.entity, entityName)).toBeDefined();
    expect(getCommon(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should be inlined in ODS', (): void => {
    expect(getCommon(namespace.entity, entityName).inlineInOds).toBe(false);
  });

  it('should have documentation', (): void => {
    expect(getCommon(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have one property', (): void => {
    expect(getCommon(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const property = getCommon(namespace.entity, entityName).properties[0];

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

describe('when building inline common with no inline common name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const entityDocumentation = 'EntityDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInlineCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build inline common', (): void => {
    expect(namespace.entity.common.size).toBe(0);
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

describe('when building inline common with lowercase inline common name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const entityDocumentation = 'EntityDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInlineCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no inline common', (): void => {
    expect(namespace.entity.common.size).toBe(0);
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

describe('when building inline common with no documentation', (): void => {
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
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInlineCommon(entityName)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one inline common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getCommon(namespace.entity, entityName)).toBeDefined();
    expect(getCommon(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should be inlined in ODS', (): void => {
    expect(getCommon(namespace.entity, entityName).inlineInOds).toBe(true);
  });

  it('should not have documentation', (): void => {
    expect(getCommon(namespace.entity, entityName).documentation).toBe('');
  });

  it('should have no properties', (): void => {
    expect(getCommon(namespace.entity, entityName).properties).toHaveLength(0);
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

describe('when building inline common with no property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInlineCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one inline common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getCommon(namespace.entity, entityName)).toBeDefined();
    expect(getCommon(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should be inlined in ODS', (): void => {
    expect(getCommon(namespace.entity, entityName).inlineInOds).toBe(true);
  });

  it('should not have documentation', (): void => {
    expect(getCommon(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have no property', (): void => {
    expect(getCommon(namespace.entity, entityName).properties).toHaveLength(0);
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

describe('when building inline common with invalid trailing text', (): void => {
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
    const builder = new CommonBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInlineCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withTrailingText(trailingText)
      .withEndInlineCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one inline common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getCommon(namespace.entity, entityName)).toBeDefined();
    expect(getCommon(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getCommon(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should be inlined in ODS', (): void => {
    expect(getCommon(namespace.entity, entityName).inlineInOds).toBe(true);
  });

  it('should have documentation', (): void => {
    expect(getCommon(namespace.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have one property', (): void => {
    expect(getCommon(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const property = getCommon(namespace.entity, entityName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name'}, column: 0, line: 9, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name'}, column: 0, line: 9, token: TrailingText",
      ]
    `);
  });
});

describe('when building common source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have a documentation property', (): void => {
    expect(getCommon(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have a metaEdName property', (): void => {
    expect(getCommon(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have a type property', (): void => {
    expect(getCommon(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map data', (): void => {
    expect(getCommon(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
        "inlineInOds": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
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
          "tokenText": "Common",
        },
      }
    `);
  });
});

describe('when building inline common source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityDocumentation = 'EntityDocumentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new CommonBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInlineCommon(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have a documentation property', (): void => {
    expect(getCommon(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have a metaEdName property', (): void => {
    expect(getCommon(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have a type property', (): void => {
    expect(getCommon(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map data', (): void => {
    expect(getCommon(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
        "inlineInOds": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
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
          "tokenText": "Inline Common",
        },
      }
    `);
  });
});
