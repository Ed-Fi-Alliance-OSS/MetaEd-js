import { SharedIntegerBuilder } from '../../src/builder/SharedIntegerBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getSharedInteger } from '../TestHelper';
import { SharedIntegerSourceMap } from '../../src/model/SharedInteger';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared integer in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared integer', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSharedInteger(namespace.entity, entityName)).toBeDefined();
    expect(getSharedInteger(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have minValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should not be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(false);
  });

  it('should not have big hint', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).hasBigHint).toBe(false);
  });
});

describe('when building deprecated shared integer', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared integer', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getSharedInteger(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building duplicate shared integers', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()

      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared integer', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSharedInteger(namespace.entity, entityName)).toBeDefined();
    expect(getSharedInteger(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('SharedSimpleBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Shared Integer named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 17,
              "line": 7,
              "tokenText": "EntityName",
            }
        `);

    expect(validationFailures[1].validatorName).toBe('SharedSimpleBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Shared Integer named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 17,
              "line": 2,
              "tokenText": "EntityName",
            }
        `);
  });
});

describe('when building shared short in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared short', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSharedInteger(namespace.entity, entityName)).toBeDefined();
    expect(getSharedInteger(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(true);
  });
});

describe('when building shared integer with no shared integer name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build shared integer', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(0);
  });

  it('should have missing id error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "missing ID at '[123]', column: 18, line: 2, token: [123]",
              "missing ID at '[123]', column: 18, line: 2, token: [123]",
            ]
        `);
  });
});

describe('when building shared integer with lowercase shared integer name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no shared short', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'e' expecting ID, column: 17, line: 2, token: e",
              "mismatched input 'e' expecting ID, column: 17, line: 2, token: e",
            ]
        `);
  });
});

describe('when building shared integer with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe('');
  });

  it('should not have minValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe('');
  });

  it('should not have maxValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should not be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(false);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'min value' expecting {'deprecated', 'documentation'}, column: 6, line: 3, token: min value",
              "mismatched input 'min value' expecting {'deprecated', 'documentation'}, column: 6, line: 3, token: min value",
            ]
        `);
  });
});

describe('when building shared integer with empty min value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(false);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'max value' expecting {'big', UNSIGNED_INT, '+', '-'}, column: 6, line: 6, token: max value",
        "extraneous input 'max value' expecting {'big', UNSIGNED_INT, '+', '-'}, column: 6, line: 6, token: max value",
      ]
    `);
  });
});

describe('when building shared integer with empty max value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should not have maxValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should not be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(false);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'End Namespace' expecting {'big', UNSIGNED_INT, '+', '-'}, column: 0, line: 7, token: End Namespace",
        "mismatched input 'End Namespace' expecting {'big', UNSIGNED_INT, '+', '-'}, column: 0, line: 7, token: End Namespace",
      ]
    `);
  });
});

describe('when building shared integer with big min value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(null, null, true, false)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not have a min value', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe('');
  });

  it('should have big hint', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).hasBigHint).toBe(true);
  });
});

describe('when building shared integer with big max value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(null, null, false, true)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not have a max value', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should have big hint', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).hasBigHint).toBe(true);
  });
});

describe('when building shared integer with big min and big max value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(null, null, true, true)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not have a min value', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe('');
  });

  it('should not have a max value', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should have big hint', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).hasBigHint).toBe(true);
  });
});

describe('when building shared integer with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withTrailingText(trailingText)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should not be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(false);
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

describe('when building shared short with no shared short name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build shared short', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(0);
  });

  it('should have missing id error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "missing ID at '[123]', column: 16, line: 2, token: [123]",
              "missing ID at '[123]', column: 16, line: 2, token: [123]",
            ]
        `);
  });
});

describe('when building shared short with lowercase shared short name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no shared short', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'e' expecting ID, column: 15, line: 2, token: e",
              "mismatched input 'e' expecting ID, column: 15, line: 2, token: e",
            ]
        `);
  });
});

describe('when building shared short with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should not have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe('');
  });

  it('should not have minValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe('');
  });

  it('should not have maxValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(true);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'min value' expecting {'deprecated', 'documentation'}, column: 6, line: 3, token: min value",
              "mismatched input 'min value' expecting {'deprecated', 'documentation'}, column: 6, line: 3, token: min value",
            ]
        `);
  });
});

describe('when building shared short with empty min value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(true);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'max value' expecting {'big', UNSIGNED_INT, '+', '-'}, column: 6, line: 6, token: max value",
        "extraneous input 'max value' expecting {'big', UNSIGNED_INT, '+', '-'}, column: 6, line: 6, token: max value",
      ]
    `);
  });
});

describe('when building shared short with empty max value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should not have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should not have maxValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(true);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'End Namespace' expecting {'big', UNSIGNED_INT, '+', '-'}, column: 0, line: 7, token: End Namespace",
        "mismatched input 'End Namespace' expecting {'big', UNSIGNED_INT, '+', '-'}, column: 0, line: 7, token: End Namespace",
      ]
    `);
  });
});

describe('when building shared short with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withTrailingText(trailingText)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should not have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should be a short', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).isShort).toBe(true);
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

describe('when building shared integer source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'documentation';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  // SharedSimpleSourceMap
  it('should have type', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  it('should have metaEdId', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.metaEdId).toBeDefined();

    expect(getSharedInteger(namespace.entity, entityName).sourceMap.metaEdId.tokenText).toBe(`[${metaEdId}]`);
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  // SharedIntegerSourceMap
  it('should have isShort', (): void => {
    expect((getSharedInteger(namespace.entity, entityName).sourceMap as SharedIntegerSourceMap).isShort).toBeDefined();
  });

  it('should have minValue', (): void => {
    expect((getSharedInteger(namespace.entity, entityName).sourceMap as SharedIntegerSourceMap).minValue).toBeDefined();
  });

  it('should have maxValue', (): void => {
    expect((getSharedInteger(namespace.entity, entityName).sourceMap as SharedIntegerSourceMap).maxValue).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
        "isShort": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "maxValue": Object {
          "column": 6,
          "line": 6,
          "tokenText": "max value",
        },
        "metaEdId": Object {
          "column": 28,
          "line": 2,
          "tokenText": "[123]",
        },
        "metaEdName": Object {
          "column": 17,
          "line": 2,
          "tokenText": "EntityName",
        },
        "minValue": Object {
          "column": 6,
          "line": 5,
          "tokenText": "min value",
        },
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Shared Integer",
        },
      }
    `);
  });
});

describe('when building shared short source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '123';
  const documentation = 'documentation';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  // SharedSimpleSourceMap
  it('should have type', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  it('should have metaEdId', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.metaEdId).toBeDefined();
    expect(getSharedInteger(namespace.entity, entityName).sourceMap.metaEdId.tokenText).toBe(`[${metaEdId}]`);
  });

  // SharedIntegerSourceMap
  it('should have isShort', (): void => {
    expect((getSharedInteger(namespace.entity, entityName).sourceMap as SharedIntegerSourceMap).isShort).toBeDefined();
  });

  it('should have minValue', (): void => {
    expect((getSharedInteger(namespace.entity, entityName).sourceMap as SharedIntegerSourceMap).minValue).toBeDefined();
  });

  it('should have maxValue', (): void => {
    expect((getSharedInteger(namespace.entity, entityName).sourceMap as SharedIntegerSourceMap).maxValue).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getSharedInteger(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
        "isShort": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Shared Short",
        },
        "maxValue": Object {
          "column": 6,
          "line": 6,
          "tokenText": "max value",
        },
        "metaEdId": Object {
          "column": 26,
          "line": 2,
          "tokenText": "[123]",
        },
        "metaEdName": Object {
          "column": 15,
          "line": 2,
          "tokenText": "EntityName",
        },
        "minValue": Object {
          "column": 6,
          "line": 5,
          "tokenText": "min value",
        },
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Shared Short",
        },
      }
    `);
  });
});
