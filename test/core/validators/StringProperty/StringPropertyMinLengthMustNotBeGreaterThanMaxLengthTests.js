import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/StringProperty/StringPropertyMinLengthMustNotBeGreaterThanMaxLength';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_string_property_with_no_min_length', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('EntityForTest')
      .withDocumentation('doc')
      .withStringIdentity('StringProperty', 'doc2', 100)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_string_property_with_correct_min_max_length_order', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const maxLength: string = 100;
    const minLength: string = 50;
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('EntityForTest')
      .withDocumentation('doc')
      .withStringIdentity('StringProperty', 'doc2', maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_string_property_with_min_max_length_out_of_order', () => {
    const entityName: string = 'EntityForTest';
    const stringPropertyName: string = 'StringProperty';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const maxLength: string = 50;
    const minLength: string = 100;
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity(stringPropertyName, 'doc2', maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('String Property');
      helper.errorMessages()[0].message.should.include('Abstract Entity');
      helper.errorMessages()[0].message.should.include(stringPropertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('min length greater than max length');
    });
  });

  describe('When_validating_string_property_with_same_min_max_length', () => {
    const entityName: string = 'EntityForTest';
    const stringPropertyName: string = 'StringProperty';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const maxLength: string = 100;
    const minLength: string = 100;
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity(stringPropertyName, 'doc2', maxLength, minLength)
      .withEndAbstractEntity()
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
    addRuleContextPath(['propertyName'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has maxLength exception', () => {
    const { ruleContext } = addRuleContextPath(['minLength', 'UNSIGNED_INT'], {}, false);
    addRuleContextPath(['maxLength', 'UNSIGNED_INT'], ruleContext, true);
    addRuleContextPath(['propertyName'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has propertyName exception', () => {
    const { ruleContext } = addRuleContextPath(['minLength', 'UNSIGNED_INT'], {}, false);
    addRuleContextPath(['maxLength', 'UNSIGNED_INT'], ruleContext, false);
    addRuleContextPath(['propertyName'], ruleContext, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
