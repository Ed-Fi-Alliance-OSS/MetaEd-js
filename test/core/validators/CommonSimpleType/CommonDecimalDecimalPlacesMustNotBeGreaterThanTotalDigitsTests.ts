import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import {ValidatorTestHelper} from "./../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits} from "../../../../src/core/validators/CommonSimpleType/CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits";

let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

import chai = require('chai');
let should = chai.should();

describe('CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigitsTests', () => {

    let validatorListener = new ValidatorListener(new TestRuleProvider(MetaEdGrammar.RULE_commonDecimal, new CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits()));

    describe('When_validating_common_decimal_with_correct_total_digit_and_decimal_places_order', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const totalDigits = "10";
            const decimalPlaces = "2";

            let metaEdText = MetaEdTextBuilder.buildIt
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
        const entityName: string = "EntityForTest";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();

        before(() => {
            let totalDigits = "2";
            let decimalPlaces = "10";

            let metaEdText = MetaEdTextBuilder.buildIt
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
        const _entityName: string = "EntityForTest";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let totalDigits = "10";
            let decimalPlaces = "10";

            let metaEdText = MetaEdTextBuilder.buildIt
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