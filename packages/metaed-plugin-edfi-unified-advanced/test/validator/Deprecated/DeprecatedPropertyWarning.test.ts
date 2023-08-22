import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  Namespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/Deprecated/DeprecatedPropertyWarning';

describe('when property is not deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntity')
      .withDocumentation('doc')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
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

describe('when properties are deprecated in alliance mode', (): void => {
  const metaEd: MetaEdEnvironment = {
    ...newMetaEdEnvironment(),
    allianceMode: true,
  };
  const coreDeprecationReason = 'is deprecated in core';
  const extensionDeprecationReason = 'is deprecated in extension';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false, null, coreDeprecationReason)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntity')
      .withDocumentation('doc')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false, null, extensionDeprecationReason)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DeprecatedPropertyWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"CoreProperty is deprecated."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
                        Object {
                          "column": 9,
                          "line": 5,
                          "tokenText": "CoreProperty",
                        }
                `);

    expect(failures[1].validatorName).toBe('DeprecatedPropertyWarning');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchInlineSnapshot(`"ExtensionProperty is deprecated."`);
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
                        Object {
                          "column": 9,
                          "line": 15,
                          "tokenText": "ExtensionProperty",
                        }
                `);
  });
});

describe('when properties are deprecated not in alliance mode', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreDeprecationReason = 'is deprecated in core';
  const extensionDeprecationReason = 'is deprecated in extension';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false, null, coreDeprecationReason)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntity')
      .withDocumentation('doc')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false, null, extensionDeprecationReason)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);

    expect(failures[0].validatorName).toBe('DeprecatedPropertyWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"ExtensionProperty is deprecated."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
                        Object {
                          "column": 9,
                          "line": 15,
                          "tokenText": "ExtensionProperty",
                        }
                `);
  });
});

describe('when property references deprecated entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const deprecationReason = 'is deprecated in core';
  const coreEntityName = 'CoreEntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(coreEntityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('ExtensionEntity')
      .withDocumentation('doc')
      .withDomainEntityProperty(`EdFi.${coreEntityName}`, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    domainEntityReferenceEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DeprecatedPropertyWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Domain Entity ExtensionEntity references deprecated entity CoreEntityName."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
                  Object {
                    "column": 23,
                    "line": 15,
                    "tokenText": "CoreEntityName",
                  }
            `);
  });
});
