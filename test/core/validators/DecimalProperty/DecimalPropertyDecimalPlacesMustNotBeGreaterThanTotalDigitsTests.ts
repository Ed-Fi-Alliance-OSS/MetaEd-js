import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits}from "../../../../src/core/validators/DecimalProperty/DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits"

let should = chai.should();

describe('DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(
            new DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits()));


    describe('When_validating_decimal_property_with_correct_total_digit_and_decimal_places_order', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let totalDigits: string = "10";
        let decimalPlaces: string = "2";
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withDecimalIdentity("DecimalProperty", "doc2", totalDigits, decimalPlaces)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order', () => {
        const entityName: string = "EntityForTest";
        const decimalPropertyName: string = "DecimalProperty";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let totalDigits: string = "2";
        let decimalPlaces: string = "10";
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withDecimalIdentity(decimalPropertyName, "doc2", totalDigits, decimalPlaces)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
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
        const entityName: string = "EntityForTest";
        const decimalPropertyName: string = "DecimalProperty";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let totalDigits: string = "10";
        let decimalPlaces: string = "2";
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withDecimalIdentity(decimalPropertyName, "doc2", totalDigits, decimalPlaces)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});