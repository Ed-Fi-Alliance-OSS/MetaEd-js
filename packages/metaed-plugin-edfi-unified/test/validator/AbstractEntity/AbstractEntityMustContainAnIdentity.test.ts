import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/AbstractEntity/AbstractEntityMustContainAnIdentity';

describe('when validating abstract entity with identity fields', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc1')
      .withStringIdentity('Property1', 'doc2', '100')
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));
    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating abstract entity with no identity fields', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc1')
      .withStringProperty('Property1', 'doc2', true, false, '100')
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));
    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AbstractEntityMustContainAnIdentity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating abstract entity with no identity fields -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating abstract entity with no identity fields -> sourceMap');
  });
});
