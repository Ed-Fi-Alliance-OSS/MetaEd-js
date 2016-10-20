import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {DecimalPropertyMinValueMustNotBeGreaterThanMaxValue}from "../../../../src/core/validators/DecimalProperty/DecimalPropertyMinValueMustNotBeGreaterThanMaxValue"

let should = chai.should();

describe('DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(
            new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue()));


    describe('When_validating_decimal_property_with_no_min_or_max_value', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withDecimalIdentity("DecimalProperty", "doc2", "10", "2")
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_decimal_property_with_no_min_value', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withDecimalIdentity("DecimalProperty", "doc2", "10", "2", null, 1000)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_decimal_property_with_no_max_value', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withDecimalIdentity("DecimalProperty", "doc2", "10", "2", 1000)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_decimal_property_with_correct_min_max_value_order', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let maxValue: string = 100;
        let minValue: string = 50;
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withDecimalIdentity("DecimalProperty", "doc2", "10", "2", minValue, maxValue)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_decimal_property_with_min_max_values_out_of_order', () => {
        const entityName: string = "EntityForTest";
        const decimalPropertyName: string = "DecimalProperty";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let maxValue: string = 50;
        let minValue: string = 100;
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withDecimalIdentity(decimalPropertyName, "doc2", "10", "2", minValue, maxValue)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Decimal Property");
            helper.errorMessageCollection[0].message.should.include("Abstract Entity");
            helper.errorMessageCollection[0].message.should.include(decimalPropertyName);
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("min value greater than max value");
        });
    });


    describe('When_validating_decimal_property_with_same_min_max_values', () => {
        const entityName: string = "EntityForTest";
        const decimalPropertyName: string = "DecimalProperty";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let maxValue: string = "100";
        let minValue: string = "100";
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withDecimalIdentity(decimalPropertyName, "doc2", minValue, maxValue)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});