// @flow
import AssociationBuilder from '../../../../../packages/metaed-core/src/builder/AssociationBuilder';
import AssociationExtensionBuilder from '../../../../../packages/metaed-core/src/builder/AssociationExtensionBuilder';
import AssociationSubclassBuilder from '../../../../../packages/metaed-core/src/builder/AssociationSubclassBuilder';
import MetaEdTextBuilder from '../../../../../packages/metaed-core/test/MetaEdTextBuilder';
import { metaEdEnvironmentFactory } from '../../../../../packages/metaed-core/src/MetaEdEnvironment';
import type { MetaEdEnvironment } from '../../../../../packages/metaed-core/src/MetaEdEnvironment';
import { validate } from '../../../src/validator/AssociationExtension/AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass';
import type { ValidationFailure } from '../../../../../packages/metaed-core/src/validator/ValidationFailure';

describe('when association extension extends association', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association extension extends association subclass', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const entityName: string = 'EntityName';
  const subclassName: string = 'SubclassName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(subclassName, entityName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartAssociationExtension(subclassName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association extension extends an invalid identifier', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when association extension extends an invalid identifier should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when association extension extends an invalid identifier should have validation failure -> sourceMap');
  });
});
