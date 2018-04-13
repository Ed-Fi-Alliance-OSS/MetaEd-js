// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  NamespaceInfoBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/AssociationSubclass/AssociationSubclassIdentifierMustMatchAnAssociation';

describe('when association subclass has valid extendee', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation1')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation2')
      .withBooleanProperty('PropertyName3', 'PropertyDocumentation3', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withBooleanProperty('PropertyName4', 'PropertyDocumentation1', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association subclass has invalid extendee', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociationSubclass('EntityName', 'BaseEntityName')
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation3', true, false)
      .withEndAssociationSubclass()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association subclass', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AssociationSubclassIdentifierMustMatchAnAssociation');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when association subclass has invalid extendee should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when association subclass has invalid extendee should have validation failure -> sourceMap',
    );
  });
});
