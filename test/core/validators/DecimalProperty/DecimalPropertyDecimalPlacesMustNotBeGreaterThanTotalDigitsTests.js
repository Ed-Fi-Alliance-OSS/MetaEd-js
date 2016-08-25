"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits_1 = require("../../../../src/core/validators/DecimalProperty/DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits");
let should = chai.should();
describe('DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits_1.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits()));
    describe('When_validating_decimal_property_with_correct_total_digit_and_decimal_places_order', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        let totalDigits = "10";
        let decimalPlaces = "2";
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withDecimalIdentity("DecimalProperty", "doc2", totalDigits, decimalPlaces)
                .withEndAbstractEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order', () => {
        const entityName = "EntityForTest";
        const decimalPropertyName = "DecimalProperty";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        let totalDigits = "2";
        let decimalPlaces = "10";
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withDecimalIdentity(decimalPropertyName, "doc2", totalDigits, decimalPlaces)
                .withEndAbstractEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Decimal Property");
            helper.errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
            helper.errorMessageCollection[0].Message.ShouldContain(decimalPropertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("decimal places greater than total digits");
        });
    });
    describe('When_validating_decimal_property_with_same_total_digit_and_decimal_places', () => {
        const entityName = "EntityForTest";
        const decimalPropertyName = "DecimalProperty";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        let totalDigits = "10";
        let decimalPlaces = "2";
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withDecimalIdentity(decimalPropertyName, "doc2", totalDigits, decimalPlaces)
                .withEndAbstractEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
});
//# sourceMappingURL=DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests.js.map