"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const CommonShortMinValueMustNotBeGreaterThanMaxValue_1 = require("../../../../src/core/validators/CommonSimpleType/CommonShortMinValueMustNotBeGreaterThanMaxValue");
let should = chai.should();
describe('CommonShortMinValueMustNotBeGreaterThanMaxValue', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new CommonShortMinValueMustNotBeGreaterThanMaxValue_1.CommonShortMinValueMustNotBeGreaterThanMaxValue()));
    describe('When_validating_common_short_with_no_min_or_max_value', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort("EntityForTest")
                .withDocumentation("doc")
                .withEndCommonShort()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_common_short_with_no_min_value', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort("EntityForTest")
                .withDocumentation("doc")
                .withMaxValue(100)
                .withEndCommonShort()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_common_short_with_no_max_value', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort("EntityForTest")
                .withDocumentation("doc")
                .withMinValue(0)
                .withEndCommonShort()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_common_short_with_correct_min_max_value_order', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort("EntityForTest")
                .withDocumentation("doc")
                .withMinValue(0)
                .withMaxValue(100)
                .withEndCommonShort()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_common_short_with_min_max_values_out_of_order', () => {
        const entityName = "EntityForTest";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort(entityName)
                .withDocumentation("doc")
                .withMinValue(100)
                .withMaxValue(0)
                .withEndCommonShort()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Common Short");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
        });
    });
    describe('When_validating_common_short_with_same_min_max_values', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort("EntityForTest")
                .withDocumentation("doc")
                .withMinValue(100)
                .withMaxValue(100)
                .withEndCommonShort()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});
//# sourceMappingURL=CommonShortMinValueMustNotBeGreaterThanMaxValueTests.js.map