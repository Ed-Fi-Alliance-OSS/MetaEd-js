import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/DecimalProperty/DecimalPropertyMinValueMustNotBeGreaterThanMaxValue';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_decimal_property_with_no_min_or_max_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('EntityForTest')
      .withDocumentation('doc')
      .withDecimalIdentity('DecimalProperty', 'doc2', '10', '2')
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_decimal_property_with_no_min_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('EntityForTest')
      .withDocumentation('doc')
      .withDecimalIdentity('DecimalProperty', 'doc2', '10', '2', null, 1000)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_decimal_property_with_no_max_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('EntityForTest')
      .withDocumentation('doc')
      .withDecimalIdentity('DecimalProperty', 'doc2', '10', '2', 1000)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_decimal_property_with_correct_min_max_value_order', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const maxValue: string = 100;
    const minValue: string = 50;
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('EntityForTest')
      .withDocumentation('doc')
      .withDecimalIdentity('DecimalProperty', 'doc2', '10', '2', minValue, maxValue)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_decimal_property_with_min_max_values_out_of_order', () => {
    const entityName: string = 'EntityForTest';
    const decimalPropertyName: string = 'DecimalProperty';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const maxValue: string = 50;
    const minValue: string = 100;
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity(decimalPropertyName, 'doc2', '10', '2', minValue, maxValue)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Decimal Property');
      helper.errorMessageCollection()[0].message.should.include('Abstract Entity');
      helper.errorMessageCollection()[0].message.should.include(decimalPropertyName);
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('min value greater than max value');
    });
  });

  describe('When_validating_decimal_property_with_same_min_max_values', () => {
    const entityName: string = 'EntityForTest';
    const decimalPropertyName: string = 'DecimalProperty';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const maxValue: string = '100';
    const minValue: string = '100';
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity(decimalPropertyName, 'doc2', minValue, maxValue)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });
});
