"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const CommonStringMinLengthMustNotBeGreaterThanMaxLength_1 = require("../../../../src/core/validators/CommonSimpleType/CommonStringMinLengthMustNotBeGreaterThanMaxLength");
let should = chai.should();
describe('CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new CommonStringMinLengthMustNotBeGreaterThanMaxLength_1.CommonStringMinLengthMustNotBeGreaterThanMaxLength()));
    describe('When_validating_common_string_with_no_min_value', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonString("EntityForTest")
                .withDocumentation("doc")
                .withMaxLength(100)
                .withEndCommonString()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_common_string_with_correct_min_max_value_order', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonString("EntityForTest")
                .withDocumentation("doc")
                .withMinLength(0)
                .withMaxLength(100)
                .withEndCommonString()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_common_string_with_min_max_values_out_of_order', () => {
        const entityName = "EntityForTest";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonString(entityName)
                .withDocumentation("doc")
                .withMinLength(100)
                .withMaxLength(0)
                .withEndCommonString()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Common String");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("min length greater than max length");
        });
    });
    describe('When_validating_common_string_with_same_min_max_values', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonString("EntityForTest")
                .withDocumentation("doc")
                .withMinLength(100)
                .withMaxLength(100)
                .withEndCommonString()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});
//# sourceMappingURL=CommonStringMinValueMustNotBeGreaterThanMaxValueTests.js.map