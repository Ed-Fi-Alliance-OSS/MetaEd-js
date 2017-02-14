import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/SharedSimpleType/SharedStringMinLengthMustNotBeGreaterThanMaxLength';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_common_string_with_no_min_value', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString('EntityForTest')
      .withDocumentation('doc')
      .withMaxLength(100)
      .withEndSharedString()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_common_string_with_correct_min_max_value_order', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString('EntityForTest')
      .withDocumentation('doc')
      .withMinLength(0)
      .withMaxLength(100)
      .withEndSharedString()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_common_string_with_min_max_values_out_of_order', () => {
    const entityName: string = 'EntityForTest';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString(entityName)
      .withDocumentation('doc')
      .withMinLength(100)
      .withMaxLength(0)
      .withEndSharedString()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Common String');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('min length greater than max length');
    });
  });

  describe('When_validating_common_string_with_same_min_max_values', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString('EntityForTest')
      .withDocumentation('doc')
      .withMinLength(100)
      .withMaxLength(100)
      .withEndSharedString()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When rule context has minLength exception', () => {
    const { ruleContext } = addRuleContextPath(['minLength', 'UNSIGNED_INT'], {}, true);
    addRuleContextPath(['maxLength', 'UNSIGNED_INT'], ruleContext, false);
    addRuleContextPath(['commonStringName'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has maxLength exception', () => {
    const { ruleContext } = addRuleContextPath(['minLength', 'UNSIGNED_INT'], {}, false);
    addRuleContextPath(['maxLength', 'UNSIGNED_INT'], ruleContext, true);
    addRuleContextPath(['commonStringName'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has commonStringName exception', () => {
    const { ruleContext } = addRuleContextPath(['minLength', 'UNSIGNED_INT'], {}, false);
    addRuleContextPath(['maxLength', 'UNSIGNED_INT'], ruleContext, false);
    addRuleContextPath(['commonStringName'], ruleContext, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
