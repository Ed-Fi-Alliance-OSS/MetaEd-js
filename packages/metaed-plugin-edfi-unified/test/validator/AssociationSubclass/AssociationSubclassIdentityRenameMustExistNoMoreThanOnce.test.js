// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, AssociationBuilder, AssociationSubclassBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/AssociationSubclass/AssociationSubclassIdentityRenameMustExistNoMoreThanOnce';

describe('when association subclass renames base identity more than once', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edf')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringIdentity('PropertyName3', 'PropertyDocumentation3', '100')
      .withStringIdentity('PropertyName4', 'PropertyDocumentation4', '100')
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentityRename('PropertyName5', 'PropertyName3', 'PropertyDocumentation', '100')
      .withStringIdentityRename('PropertyName6', 'PropertyName4', 'PropertyDocumentation', '100')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('AssociationSubclassIdentityRenameMustExistNoMoreThanOnce');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when association subclass renames base identity more than once should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when association subclass renames base identity more than once should have validation failure -> sourceMap');
    expect(failures[1].validatorName).toBe('AssociationSubclassIdentityRenameMustExistNoMoreThanOnce');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot('when association subclass renames base identity more than once should have validation failure -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when association subclass renames base identity more than once should have validation failure -> sourceMap');
  });
});
