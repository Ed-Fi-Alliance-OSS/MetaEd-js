import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/SharedSimpleType/SharedShortMinValueMustNotBeGreaterThanMaxValue';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('CommonShortMinValueMustNotBeGreaterThanMaxValue', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_common_short_with_no_min_or_max_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort('EntityForTest')
      .withDocumentation('doc')
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_common_short_with_no_min_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort('EntityForTest')
      .withDocumentation('doc')
      .withMaxValue(100)
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_common_short_with_no_max_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort('EntityForTest')
      .withDocumentation('doc')
      .withMinValue(0)
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_common_short_with_correct_min_max_value_order', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort('EntityForTest')
      .withDocumentation('doc')
      .withMinValue(0)
      .withMaxValue(100)
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_common_short_with_min_max_values_out_of_order', () => {
    const entityName: string = 'EntityForTest';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort(entityName)
      .withDocumentation('doc')
      .withMinValue(100)
      .withMaxValue(0)
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Common Short');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('min value greater than max value');
    });
  });

  describe('When_validating_common_short_with_same_min_max_values', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort('EntityForTest')
      .withDocumentation('doc')
      .withMinValue(100)
      .withMaxValue(100)
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When rule context has minValue exception', () => {
    const { ruleContext } = addRuleContextPath(['minValue', 'signed_int'], {}, true);
    addRuleContextPath(['maxValue', 'signed_int'], ruleContext, false);
    addRuleContextPath(['commonShortName'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has maxValue exception', () => {
    const { ruleContext } = addRuleContextPath(['minValue', 'signed_int'], {}, false);
    addRuleContextPath(['maxValue', 'signed_int'], ruleContext, true);
    addRuleContextPath(['commonShortName'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has commonShortName exception', () => {
    const { ruleContext } = addRuleContextPath(['minValue', 'signed_int'], {}, false);
    addRuleContextPath(['maxValue', 'signed_int'], ruleContext, false);
    addRuleContextPath(['commonShortName'], ruleContext, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
