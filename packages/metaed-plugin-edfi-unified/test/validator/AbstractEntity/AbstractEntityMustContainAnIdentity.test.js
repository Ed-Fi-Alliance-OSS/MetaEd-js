// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/AbstractEntity/AbstractEntityMustContainAnIdentity';

describe('when validating abstract entity with identity fields', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc1')
      .withStringIdentity('Property1', 'doc2', '100')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating abstract entity with no identity fields', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc1')
      .withStringProperty('Property1', 'doc2', true, false, '100')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AbstractEntityMustContainAnIdentity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating abstract entity with no identity fields -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating abstract entity with no identity fields -> sourceMap');
  });
});
