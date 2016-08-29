"use strict";
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const ValidationTestHelper_1 = require("./../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits_1 = require("../../../../src/core/validators/CommonSimpleType/CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
const chai = require('chai');
let should = chai.should();
describe('CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigitsTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(MetaEdGrammar.RULE_commonDecimal, new CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits_1.CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits()));
    describe('When_validating_common_decimal_with_correct_total_digit_and_decimal_places_order', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const totalDigits = "10";
            const decimalPlaces = "2";
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonDecimal("EntityForTest")
                .withDocumentation("doc")
                .withTotalDigits(totalDigits)
                .withDecimalPlaces(decimalPlaces)
                .withEndCommonDecimal()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('Should_have_no_validation_failures', () => {
            helper.errorMessageCollection.length.should.equal(0);
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_validating_common_decimal_with_total_digit_and_decimal_places_out_of_order', () => {
        const entityName = "EntityForTest";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let totalDigits = "2";
            let decimalPlaces = "10";
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonDecimal(entityName)
                .withDocumentation("doc")
                .withTotalDigits(totalDigits)
                .withDecimalPlaces(decimalPlaces)
                .withEndCommonDecimal()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures', () => {
            helper.errorMessageCollection[0].should.not.be.null;
        });
        it('should_have_validation_failure_message', () => {
            helper.errorMessageCollection[0].message.should.contain("Common Decimal");
            helper.errorMessageCollection[0].message.should.contain(entityName);
            helper.errorMessageCollection[0].message.should.contain("decimal places greater than total digits");
        });
    });
    describe('When_validating_common_decimal_with_same_total_digit_and_decimal_places', () => {
        const _entityName = "EntityForTest";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let totalDigits = "10";
            let decimalPlaces = "10";
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonDecimal(_entityName)
                .withDocumentation("doc")
                .withTotalDigits(totalDigits)
                .withDecimalPlaces(decimalPlaces)
                .withEndCommonDecimal()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});
//# sourceMappingURL=CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigitsTests.js.map