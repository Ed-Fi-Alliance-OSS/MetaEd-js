import { newMetaEdEnvironment, MetaEdTextBuilder, NamespaceBuilder, DomainEntityBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CrossProperty/ExtensionNamespacePropertiesShouldNotHaveSameRoleNameAsPropertyName';

describe('when property in Ed-Fi namespace has no role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('Property', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when property in Ed-Fi namespace has role name different from property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('Property', 'doc', true, false, 'PropertyRoleName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when property in Ed-Fi namespace has role name same as property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('Property', 'doc', true, false, 'Property')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when property in non Ed-Fi namespace has no role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('AnotherEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Property', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when property in non Ed-Fi namespace has role name different from property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('AnotherEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Property', 'doc', true, false, 'PropertyRoleName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when property in non Ed-Fi namespace has role name same as property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('AnotherEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Property', 'doc', true, false, 'Property')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "warning",
          "fileMap": null,
          "message": "Property should not have the same name as its role name. This triggers a pattern that is not supported in extensions.",
          "sourceMap": Object {
            "column": 9,
            "line": 5,
            "tokenText": "Property",
          },
          "validatorName": "ExtensionNamespacePropertiesShouldNotHaveSameRoleNameAsPropertyName",
        },
      ]
    `);
  });
});
