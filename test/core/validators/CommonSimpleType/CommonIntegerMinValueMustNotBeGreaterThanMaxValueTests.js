import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/CommonSimpleType/CommonIntegerMinValueMustNotBeGreaterThanMaxValue'
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_common_integer_with_no_min_or_max_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonInteger('EntityForTest')
      .withDocumentation('doc')
      .withEndCommonInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_common_integer_with_no_min_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonInteger('EntityForTest')
      .withDocumentation('doc')
      .withMaxValue(100)
      .withEndCommonInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_common_integer_with_no_max_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonInteger('EntityForTest')
      .withDocumentation('doc')
      .withMinValue(0)
      .withEndCommonInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_common_integer_with_correct_min_max_value_order', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonInteger('EntityForTest')
      .withDocumentation('doc')
      .withMinValue(0)
      .withMaxValue(100)
      .withEndCommonInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_common_integer_with_min_max_values_out_of_order', () => {
    const entityName: string = 'EntityForTest';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()

      .withBeginNamespace('edfi')
      .withStartCommonInteger(entityName)
      .withDocumentation('doc')
      .withMinValue(100)
      .withMaxValue(0)
      .withEndCommonInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Common Integer');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('min value greater than max value');
    });
  });

  describe('When_validating_common_integer_with_same_min_max_values', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonInteger('EntityForTest')
      .withDocumentation('doc')
      .withMinValue(100)
      .withMaxValue(100)
      .withEndCommonInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });
});
