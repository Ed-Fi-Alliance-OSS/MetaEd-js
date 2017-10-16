// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, EnumerationBuilder, DomainEntityBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/EnumerationProperty/EnumerationPropertyMustMatchAnEnumeration';

describe('when enumeration property has valid identifier', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration(entityName)
      .withDocumentation('EntityDocumentation')
      .withEndEnumeration()

      .withStartDomainEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withEnumerationProperty(entityName, 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when enumeration property has invalid identifier', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('EntityName1')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withEnumerationProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('EnumerationPropertyMustMatchAEnumeration');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when enumeration property has invalid identifier should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when enumeration property has invalid identifier should have validation failure -> sourceMap');
  });
});
