// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  NamespaceInfoBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce';

describe('when domain entity subclass renames base identity more than once', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edf')
      .withStartDomainEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withStringIdentity('PropertyName2', 'PropertyDocumentation', '100')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentityRename('PropertyName3', 'PropertyName1', 'PropertyDocumentation', '100')
      .withStringIdentityRename('PropertyName4', 'PropertyName2', 'PropertyDocumentation', '100')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domainEntity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DomainEntitySubclassIdenitityRenameMustExistNoMoreThanOnce');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when domain entity subclass renames base identity more than once should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when domain entity subclass renames base identity more than once should have validation failure -> sourceMap',
    );
    expect(failures[1].validatorName).toBe('DomainEntitySubclassIdenitityRenameMustExistNoMoreThanOnce');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when domain entity subclass renames base identity more than once should have validation failure -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when domain entity subclass renames base identity more than once should have validation failure -> sourceMap',
    );
  });
});
