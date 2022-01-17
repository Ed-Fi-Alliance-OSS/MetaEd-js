import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce';

describe('when domain entity subclass renames base identity more than once', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domainEntity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domainEntitySubclass', (): void => {
    expect(coreNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DomainEntitySubclassIdenitityRenameMustExistNoMoreThanOnce');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('DomainEntitySubclassIdenitityRenameMustExistNoMoreThanOnce');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});
