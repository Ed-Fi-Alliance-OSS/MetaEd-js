import { SharedDecimalBuilder } from '../../src/builder/SharedDecimalBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getSharedDecimal } from '../TestHelper';
import { SharedDecimalSourceMap } from '../../src/model/SharedDecimal';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared decimal in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared decimal', (): void => {
    expect(namespace.entity.sharedDecimal.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName)).toBeDefined();
    expect(getSharedDecimal(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have total digits', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).maxValue).toBe(maxValue);
  });
});

describe('when building deprecated shared decimal', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared decimal', (): void => {
    expect(namespace.entity.sharedDecimal.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getSharedDecimal(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building duplicate shared decimals', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()

      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one shared decimal', (): void => {
    expect(namespace.entity.sharedDecimal.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName)).toBeDefined();
    expect(getSharedDecimal(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('SharedSimpleBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Shared Decimal named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 17,
              "line": 9,
              "tokenText": "EntityName",
            }
        `);

    expect(validationFailures[1].validatorName).toBe('SharedSimpleBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Shared Decimal named EntityName is a duplicate declaration of that name."`,
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

describe('when building shared decimal with no shared decimal name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build shared decimal', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(0);
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

describe('when building shared decimal with lowercase shared decimal name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no shared decimal', (): void => {
    expect(namespace.entity.sharedDecimal.size).toBe(0);
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

describe('when building shared decimal with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should not have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).documentation).toBe('');
  });

  it('should not have total digits', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).totalDigits).toBe('');
  });

  it('should not have decimal places', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).decimalPlaces).toBe('');
  });

  it('should not have minValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).minValue).toBe('');
  });

  it('should not have maxValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'total digits' expecting {'deprecated', 'documentation', METAED_ID}, column: 6, line: 3, token: total digits",
        "mismatched input 'total digits' expecting {'deprecated', 'documentation', METAED_ID}, column: 6, line: 3, token: total digits",
      ]
    `);
  });
});

describe('when building shared decimal with no total digits property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalPlaces(decimalPlaces)
      .withMinValue(minValue)
      .withMaxValue(maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not have total digits', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).totalDigits).toBe('');
  });

  it('should have decimal places', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'decimal places' expecting 'total digits', column: 4, line: 5, token: decimal places",
              "mismatched input 'decimal places' expecting 'total digits', column: 4, line: 5, token: decimal places",
            ]
        `);
  });
});

describe('when building shared decimal with no total digits value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withTotalDigits(totalDigits)
      .withDecimalPlaces(decimalPlaces)
      .withMinValue(minValue)
      .withMaxValue(maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have total digits because decimal places token was ignored', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).totalDigits).toBe(decimalPlaces);
  });

  it('should not have decimal places because it was consumed by total digits', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).decimalPlaces).toBe('');
  });

  it('should have minValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should have extraneous input and mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "extraneous input 'decimal places' expecting UNSIGNED_INT, column: 4, line: 6, token: decimal places",
              "mismatched input 'min value' expecting 'decimal places', column: 4, line: 7, token: min value",
              "extraneous input 'decimal places' expecting UNSIGNED_INT, column: 4, line: 6, token: decimal places",
              "mismatched input 'min value' expecting 'decimal places', column: 4, line: 7, token: min value",
            ]
        `);
  });
});

describe('when building shared decimal with no decimal places property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withTotalDigits(totalDigits)
      .withMinValue(minValue)
      .withMaxValue(maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have total digits', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).totalDigits).toBe(totalDigits);
  });

  it('should not have decimal places', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).decimalPlaces).toBe('');
  });

  it('should have minValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should have mismatched input and extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'min value' expecting 'decimal places', column: 4, line: 6, token: min value",
              "mismatched input 'min value' expecting 'decimal places', column: 4, line: 6, token: min value",
            ]
        `);
  });
});

describe('when building shared decimal with no min value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withTotalDigits(totalDigits)
      .withDecimalPlaces(decimalPlaces)
      .withMinValue(minValue)
      .withMaxValue(maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have total digits', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue because max value token was ignored', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).minValue).toBe(`max value${maxValue}`);
  });

  it('should not have maxValue because it was consumed by min value', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "extraneous input 'max value' expecting {UNSIGNED_INT, DECIMAL_VALUE, '+', '-'}, column: 4, line: 8, token: max value",
              "extraneous input 'max value' expecting {UNSIGNED_INT, DECIMAL_VALUE, '+', '-'}, column: 4, line: 8, token: max value",
            ]
        `);
  });
});

describe('when building shared decimal with no max value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withTotalDigits(totalDigits)
      .withDecimalPlaces(decimalPlaces)
      .withMinValue(minValue)
      .withMaxValue(maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have total digits', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should not have maxValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).maxValue).toBe('');
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'End Namespace' expecting {UNSIGNED_INT, DECIMAL_VALUE, '+', '-'}, column: 0, line: 9, token: End Namespace",
              "mismatched input 'End Namespace' expecting {UNSIGNED_INT, DECIMAL_VALUE, '+', '-'}, column: 0, line: 9, token: End Namespace",
            ]
        `);
  });
});

describe('when building shared decimal with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withTrailingText(trailingText)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have total digits', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 9, token: TrailingText",
              "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 9, token: TrailingText",
            ]
        `);
  });
});

describe('when building shared decimal source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new SharedDecimalBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  // SharedSimpleSourceMap
  it('should have type', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getSharedDecimal(namespace.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  // SharedDecimalSourceMap
  it('should have totalDigits', (): void => {
    expect((getSharedDecimal(namespace.entity, entityName).sourceMap as SharedDecimalSourceMap).totalDigits).toBeDefined();
  });

  it('should have decimalPlaces', (): void => {
    expect((getSharedDecimal(namespace.entity, entityName).sourceMap as SharedDecimalSourceMap).decimalPlaces).toBeDefined();
  });

  it('should have minValue', (): void => {
    expect((getSharedDecimal(namespace.entity, entityName).sourceMap as SharedDecimalSourceMap).minValue).toBeDefined();
  });

  it('should have maxValue', (): void => {
    expect((getSharedDecimal(namespace.entity, entityName).sourceMap as SharedDecimalSourceMap).maxValue).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getSharedDecimal(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "decimalPlaces": Object {
          "column": 6,
          "line": 6,
          "tokenText": "decimal places",
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
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "maxValue": Object {
          "column": 6,
          "line": 8,
          "tokenText": "max value",
        },
        "metaEdName": Object {
          "column": 17,
          "line": 2,
          "tokenText": "EntityName",
        },
        "minValue": Object {
          "column": 6,
          "line": 7,
          "tokenText": "min value",
        },
        "totalDigits": Object {
          "column": 6,
          "line": 5,
          "tokenText": "total digits",
        },
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Shared Decimal",
        },
      }
    `);
  });
});
