"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const StringPropertyMinLengthMustNotBeGreaterThanMaxLength_1 = require("../../../../src/core/validators/StringProperty/StringPropertyMinLengthMustNotBeGreaterThanMaxLength");
let should = chai.should();
describe('ReplaceMeWithFileName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new StringPropertyMinLengthMustNotBeGreaterThanMaxLength_1.StringPropertyMinLengthMustNotBeGreaterThanMaxLength()));
    describe('When_validating_string_property_with_no_min_length', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withStringIdentity("StringProperty", "doc2", 100)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_string_property_with_correct_min_max_length_order', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        let maxLength = 100;
        let minLength = 50;
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity("EntityForTest")
                .withDocumentation("doc")
                .withStringIdentity("StringProperty", "doc2", maxLength, minLength)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_string_property_with_min_max_length_out_of_order', () => {
        let entityName = "EntityForTest";
        const stringPropertyName = "StringProperty";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        let maxLength = 50;
        let minLength = 100;
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity(stringPropertyName, "doc2", maxLength, minLength)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String Property");
            helper.errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
            helper.errorMessageCollection[0].Message.ShouldContain(stringPropertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("min length greater than max length");
        });
    });
    describe('When_validating_string_property_with_same_min_max_length', () => {
        let entityName = "EntityForTest";
        const stringPropertyName = "StringProperty";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        let maxLength = 100;
        let minLength = 100;
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity(stringPropertyName, "doc2", maxLength, minLength)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});
//# sourceMappingURL=StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests.js.map