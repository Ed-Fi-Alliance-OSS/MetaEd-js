/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {IntegerPropertyMinValueMustNotBeGreaterThanMaxValue}from "../../../../src/core/validators/IntegerProperty/IntegerPropertyMinValueMustNotBeGreaterThanMaxValue"

let should = chai.should();

describe('IntegerPropertyMinValueMustNotBeGreaterThanMaxValue', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.IntegerPropertyContext>(
            new IntegerPropertyMinValueMustNotBeGreaterThanMaxValue()));


    describe('When_validating_integer_property_with_no_min_or_max_value', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withIntegerIdentity("IntegerProperty", "doc2")
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_integer_property_with_no_min_value', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withIntegerIdentity("IntegerProperty", "doc2", 100)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_integer_property_with_no_max_value', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withIntegerIdentity("IntegerProperty", "doc2", null, 100)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_integer_property_with_correct_min_max_value_order', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        let maxValue: number = 100;
        let minValue: number = 50;
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withIntegerIdentity("IntegerProperty", "doc2", maxValue, minValue)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_validating_integer_property_with_min_max_values_out_of_order', () => {
        const entityName: string = "EntityForTest";
            const integerPropertyName: string = "IntegerProperty";
    let helper: ValidationTestHelper = new ValidationTestHelper();
    let maxValue: number = 50;
    let minValue: number = 100;
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartAbstractEntity(entityName)
            .withDocumentation("doc")
            .withIntegerIdentity(integerPropertyName, "doc2", maxValue, minValue)
            .withEndAbstractEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
        helper.errorMessageCollection.Any().ShouldBeTrue();
    });
    it('should_have_validation_failure_message()', () => {
        helper.errorMessageCollection[0].Message.ShouldContain("Integer Property");
        helper.errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
        helper.errorMessageCollection[0].Message.ShouldContain(integerPropertyName);
        helper.errorMessageCollection[0].Message.ShouldContain(entityName);
        helper.errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
    });
});


describe('When_validating_integer_property_with_same_min_max_values', () => {
    const entityName: string = "EntityForTest";
            const integerPropertyName: string = "IntegerProperty";
let helper: ValidationTestHelper = new ValidationTestHelper();
let maxValue: number = 100;
let minValue: number = 100;
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt

        .withBeginNamespace("edfi")
        .withStartAbstractEntity(entityName)
        .withDocumentation("doc")
        .withIntegerIdentity(integerPropertyName, "doc2", maxValue, minValue)
        .withEndAbstractEntity()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});

it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.length.should.equal(0);
});
});
});