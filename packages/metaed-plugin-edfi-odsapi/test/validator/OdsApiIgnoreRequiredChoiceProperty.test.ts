import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { DomainEntityBuilder, NamespaceBuilder, MetaEdTextBuilder, newMetaEdEnvironment } from '@edfi/metaed-core';
import { validate } from '../../src/validator/OdsApiIgnoreRequiredChoiceProperty';

// ChoiceProperty
describe('when building choice property required', (): void => {
  const validationFailures: ValidationFailure[] = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const entityDocumentation = 'Documentation';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let failures: ValidationFailure[];

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withChoiceProperty(propertyName, propertyDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "warning",
          "fileMap": null,
          "message": "PropertyName is required.",
          "sourceMap": Object {
            "column": 11,
            "line": 5,
            "tokenText": "PropertyName",
          },
          "validatorName": "OdsApiIgnoreRequiredChoiceProperty",
        },
      ]
    `);
  });
});

describe('when building not required choice property', (): void => {
  const validationFailures: ValidationFailure[] = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withChoiceProperty(propertyName, 'doc', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
