import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  Namespace,
  InterchangeBuilder,
  MetaEdEnvironment,
  ValidationFailure,
} from '@edfi/metaed-core';
import { interchangeBaseItemEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/Deprecated/DeprecatedInterchangeItemReferenceWarning';

describe('when domain item references no deprecated entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreEntityName = 'CoreEntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(coreEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartInterchange('InterchangeEntity')
      .withDocumentation('doc')
      .withDomainEntityIdentityTemplate(`EdFi.${coreEntityName}`)
      .withDomainEntityElement(`EdFi.${coreEntityName}`)
      .withEndInterchange()

      .withStartInterchangeExtension('InterchangeExtensionEntity')
      .withDocumentation('doc')
      .withDomainEntityIdentityTemplate(`EdFi.${coreEntityName}`)
      .withDomainEntityElement(`EdFi.${coreEntityName}`)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    interchangeBaseItemEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failure', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain item references deprecated entity', (): void => {
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
      .withStartInterchange('InterchangeEntity')
      .withDocumentation('doc')
      .withDomainEntityIdentityTemplate(`EdFi.${coreEntityName}`)
      .withDomainEntityElement(`EdFi.${coreEntityName}`)
      .withEndInterchange()

      .withStartInterchangeExtension('InterchangeExtensionEntity')
      .withDomainEntityIdentityTemplate(`EdFi.${coreEntityName}`)
      .withDomainEntityElement(`EdFi.${coreEntityName}`)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    interchangeBaseItemEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(4);
    expect(failures[0].validatorName).toBe('DeprecatedInterchangeItemReferenceWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Interchange InterchangeEntity references deprecated entity CoreEntityName."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
                  Object {
                    "column": 23,
                    "line": 16,
                    "tokenText": "CoreEntityName",
                  }
            `);

    expect(failures[1].validatorName).toBe('DeprecatedInterchangeItemReferenceWarning');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchInlineSnapshot(
      `"Interchange InterchangeEntity references deprecated entity CoreEntityName."`,
    );
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 32,
              "line": 15,
              "tokenText": "CoreEntityName",
            }
        `);

    expect(failures[2].validatorName).toBe('DeprecatedInterchangeItemReferenceWarning');
    expect(failures[2].category).toBe('warning');
    expect(failures[2].message).toMatchInlineSnapshot(
      `"Interchange Extension InterchangeExtensionEntity references deprecated entity CoreEntityName."`,
    );
    expect(failures[2].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 23,
        "line": 19,
        "tokenText": "CoreEntityName",
      }
    `);

    expect(failures[3].validatorName).toBe('DeprecatedInterchangeItemReferenceWarning');
    expect(failures[3].category).toBe('warning');
    expect(failures[3].message).toMatchInlineSnapshot(
      `"Interchange Extension InterchangeExtensionEntity references deprecated entity CoreEntityName."`,
    );
    expect(failures[3].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 32,
        "line": 18,
        "tokenText": "CoreEntityName",
      }
    `);
  });
});
