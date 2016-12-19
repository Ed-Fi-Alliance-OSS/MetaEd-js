import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/CommonSimpleType/CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigitsTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_common_decimal_with_correct_total_digit_and_decimal_places_order', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const totalDigits = '10';
      const decimalPlaces = '2';

      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonDecimal('EntityForTest')
      .withDocumentation('doc')
      .withTotalDigits(totalDigits)
      .withDecimalPlaces(decimalPlaces)
      .withEndCommonDecimal()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('Should_have_no_validation_failures', () => {
      helper.errorMessages().length.should.equal(0);
      helper.warningMessages().length.should.equal(0);
    });
  });

  describe('When_validating_common_decimal_with_total_digit_and_decimal_places_out_of_order', () => {
    const entityName: string = 'EntityForTest';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();

    before(() => {
      const totalDigits = '2';
      const decimalPlaces = '10';

      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonDecimal(entityName)
      .withDocumentation('doc')
      .withTotalDigits(totalDigits)
      .withDecimalPlaces(decimalPlaces)
      .withEndCommonDecimal()
      .withEndNamespace()
      .toString();

      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message', () => {
      helper.errorMessages()[0].message.should.contain('Common Decimal');
      helper.errorMessages()[0].message.should.contain(entityName);
      helper.errorMessages()[0].message.should.contain('decimal places greater than total digits');
    });
  });

  describe('When_validating_common_decimal_with_same_total_digit_and_decimal_places', () => {
    const _entityName: string = 'EntityForTest';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const totalDigits = '10';
      const decimalPlaces = '10';

      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonDecimal(_entityName)
      .withDocumentation('doc')
      .withTotalDigits(totalDigits)
      .withDecimalPlaces(decimalPlaces)
      .withEndCommonDecimal()
      .withEndNamespace()
      .toString();

      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures', () => {
      helper.errorMessages().length.should.equal(0);
      helper.warningMessages().length.should.equal(0);
    });
  });
});
