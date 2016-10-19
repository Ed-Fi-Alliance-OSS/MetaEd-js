"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const IntegerPropertyMinValueMustNotBeGreaterThanMaxValue_1 = require("../../../../src/core/validators/IntegerProperty/IntegerPropertyMinValueMustNotBeGreaterThanMaxValue");
let should = chai.should();
describe('IntegerPropertyMinValueMustNotBeGreaterThanMaxValue', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new IntegerPropertyMinValueMustNotBeGreaterThanMaxValue_1.IntegerPropertyMinValueMustNotBeGreaterThanMaxValue()));
    describe('When_validating_integer_property_with_no_min_or_max_value', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        let maxValue = 100;
        let minValue = 50;
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        const entityName = "EntityForTest";
        const integerPropertyName = "IntegerProperty";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        let maxValue = 50;
        let minValue = 100;
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        const entityName = "EntityForTest";
        const integerPropertyName = "IntegerProperty";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        let maxValue = 100;
        let minValue = 100;
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
//# sourceMappingURL=IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests.js.map