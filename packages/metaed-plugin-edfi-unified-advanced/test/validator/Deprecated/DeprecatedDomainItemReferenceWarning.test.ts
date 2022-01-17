import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  Namespace,
  DomainBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { domainBaseEntityEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/Deprecated/DeprecatedDomainItemReferenceWarning';

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
      .withStartDomain('DomainExtensionEntity')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(`EdFi.${coreEntityName}`)
      .withEndDomain()

      .withStartSubdomain('SubdomainExtensionEntity', 'DomainExtensionEntity')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(`EdFi.${coreEntityName}`)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    domainBaseEntityEnhancer(metaEd);
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
      .withStartDomain('DomainExtensionEntity')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(`EdFi.${coreEntityName}`)
      .withEndDomain()

      .withStartSubdomain('SubdomainExtensionEntity', 'DomainExtensionEntity')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(`EdFi.${coreEntityName}`)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    domainBaseEntityEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DeprecatedDomainItemReferenceWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Domain DomainExtensionEntity references deprecated entity CoreEntityName."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 23,
              "line": 15,
              "tokenText": "CoreEntityName",
            }
        `);

    expect(failures[0].validatorName).toBe('DeprecatedDomainItemReferenceWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Domain DomainExtensionEntity references deprecated entity CoreEntityName."`,
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
