import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  Namespace,
  AssociationExtensionBuilder,
  AssociationBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { associationExtensionBaseClassEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { domainEntityExtensionBaseClassEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/Deprecated/DeprecatedEntityExtensionWarning';

describe('when domain entity is not deprecated', (): void => {
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
      .withStartDomainEntityExtension('EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity is deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreDeprecationReason = 'is deprecated in core';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDeprecated(coreDeprecationReason)
      .withDocumentation('doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntityExtension('EdFi.EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DeprecatedEntityExtensionWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"EntityName is an extension of deprecated entity EntityName."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 16,
        "line": 12,
        "tokenText": "EdFi",
      }
    `);
  });
});

describe('when association is not deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation('EntityName')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc')
      .withAssociationDomainEntityProperty('Second', 'doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociationExtension('EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    associationExtensionBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association is deprecated', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreDeprecationReason = 'is deprecated in core';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation('EntityName')
      .withDeprecated(coreDeprecationReason)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc')
      .withAssociationDomainEntityProperty('Second', 'doc')
      .withBooleanProperty('CoreProperty', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociationExtension('EdFi.EntityName')
      .withBooleanProperty('ExtensionProperty', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    (metaEd.namespace.get('Extension') as Namespace).dependencies.push(metaEd.namespace.get('EdFi') as Namespace);
    associationExtensionBaseClassEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DeprecatedEntityExtensionWarning');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(`"EntityName is an extension of deprecated entity EntityName."`);
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 14,
        "line": 18,
        "tokenText": "EdFi",
      }
    `);
  });
});
