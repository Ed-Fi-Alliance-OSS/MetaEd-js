import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/DecimalProperty/DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_decimal_property_with_correct_total_digit_and_decimal_places_order', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const totalDigits: string = '10';
    const decimalPlaces: string = '2';
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('EntityForTest')
      .withDocumentation('doc')
      .withDecimalIdentity('DecimalProperty', 'doc2', totalDigits, decimalPlaces)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order', () => {
    const entityName: string = 'EntityForTest';
    const decimalPropertyName: string = 'DecimalProperty';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const totalDigits: string = '2';
    const decimalPlaces: string = '10';
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity(decimalPropertyName, 'doc2', totalDigits, decimalPlaces)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Decimal Property');
      helper.errorMessages()[0].message.should.include('Abstract Entity');
      helper.errorMessages()[0].message.should.include(decimalPropertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('decimal places greater than total digits');
    });
  });

  describe('When_validating_decimal_property_with_same_total_digit_and_decimal_places', () => {
    const entityName: string = 'EntityForTest';
    const decimalPropertyName: string = 'DecimalProperty';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    const totalDigits: string = '10';
    const decimalPlaces: string = '2';
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity(decimalPropertyName, 'doc2', totalDigits, decimalPlaces)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When rule context has decimalPlaces exception', () => {
    const { ruleContext } = addRuleContextPath(['decimalPlaces', 'UNSIGNED_INT'], {}, true);
    addRuleContextPath(['totalDigits', 'UNSIGNED_INT'], ruleContext, false);
    addRuleContextPath(['propertyName', 'ID'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has totalDigits exception', () => {
    const { ruleContext } = addRuleContextPath(['decimalPlaces', 'UNSIGNED_INT'], {}, false);
    addRuleContextPath(['totalDigits', 'UNSIGNED_INT'], ruleContext, true);
    addRuleContextPath(['propertyName', 'ID'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has propertyName exception', () => {
    const { ruleContext } = addRuleContextPath(['decimalPlaces', 'UNSIGNED_INT'], {}, false);
    addRuleContextPath(['totalDigits', 'UNSIGNED_INT'], ruleContext, false);
    addRuleContextPath(['propertyName', 'ID'], ruleContext, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
