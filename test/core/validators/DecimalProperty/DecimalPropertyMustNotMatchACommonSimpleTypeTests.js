import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/DecimalProperty/DecimalPropertyMustNotMatchACommonSimpleType';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DecimalPropertyMustNotMatchACommonSimpleTypeTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_decimal_property_has_identifier_matching_no_common_simple_types', () => {
    const entityName: string = 'EntityName';
    const propertyName: string = 'PropertyName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withDecimalProperty(propertyName, 'doc', false, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection.length.should.equal(0);
    });
  });

  describe('When_decimal_property_has_identifier_matching_common_decimal', () => {
    const entityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonDecimal(entityName)
      .withDocumentation('doc')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndCommonDecimal()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withDecimalProperty(entityName, 'doc', false, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Decimal property');
      helper.errorMessageCollection[0].message.should.include(entityName);
      helper.errorMessageCollection[0].message.should.include('has the same name');
    });
  });

  describe('When_decimal_property_has_identifier_matching_common_integer', () => {
    const entityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonInteger(entityName)
      .withDocumentation('doc')
      .withMaxValue(100)
      .withEndCommonInteger()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withDecimalProperty(entityName, 'doc', false, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Decimal property');
      helper.errorMessageCollection[0].message.should.include(entityName);
      helper.errorMessageCollection[0].message.should.include('has the same name');
    });
  });

  describe('When_decimal_property_has_identifier_matching_common_short', () => {
    const entityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonShort(entityName)
      .withDocumentation('doc')
      .withMaxValue(100)
      .withEndCommonShort()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withDecimalProperty(entityName, 'doc', false, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Decimal property');
      helper.errorMessageCollection[0].message.should.include(entityName);
      helper.errorMessageCollection[0].message.should.include('has the same name');
    });
  });

  describe('When_decimal_property_has_identifier_matching_common_string', () => {
    const entityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonString(entityName)
      .withDocumentation('doc')
      .withMaxLength(100)
      .withEndCommonString()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withDecimalProperty(entityName, 'doc', false, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Decimal property');
      helper.errorMessageCollection[0].message.should.include(entityName);
      helper.errorMessageCollection[0].message.should.include('has the same name');
    });
  });
});
