"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const StringPropertyMustNotMatchACommonSimpleType_1 = require("../../../../src/core/validators/StringProperty/StringPropertyMustNotMatchACommonSimpleType");
let should = chai.should();
describe('StringPropertyMustNotMatchACommonSimpleType', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new StringPropertyMustNotMatchACommonSimpleType_1.StringPropertyMustNotMatchACommonSimpleType(symbolTable)));
    describe('When_string_property_has_identifier_matching_no_common_simple_types', () => {
        let entityName = "EntityName";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withStringProperty(propertyName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_string_property_has_identifier_matching_common_decimal', () => {
        const commonEntityName = "CommonEntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonDecimal(commonEntityName)
                .withDocumentation("doc")
                .withTotalDigits("10")
                .withDecimalPlaces("2")
                .withEndCommonDecimal()
                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withStringProperty(commonEntityName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.not.equal(0);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String property");
            helper.errorMessageCollection[0].Message.ShouldContain(commonEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
    describe('When_string_property_has_identifier_matching_common_integer', () => {
        const commonEntityName = "CommonEntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonInteger(commonEntityName)
                .withDocumentation("doc")
                .withMaxValue(100)
                .withEndCommonInteger()
                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withStringProperty(commonEntityName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.not.equal(0);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String property");
            helper.errorMessageCollection[0].Message.ShouldContain(commonEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
    describe('When_string_property_has_identifier_matching_common_short', () => {
        const commonEntityName = "CommonEntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort(commonEntityName)
                .withDocumentation("doc")
                .withMaxValue(100)
                .withEndCommonShort()
                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withStringProperty(commonEntityName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.not.be("0");
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String property");
            helper.errorMessageCollection[0].Message.ShouldContain(commonEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
    describe('When_string_property_has_identifier_matching_common_string', () => {
        const commonEntityName = "CommonEntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonString(commonEntityName)
                .withDocumentation("doc")
                .withMaxLength(100)
                .withEndCommonString()
                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withStringProperty(commonEntityName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.not.equal(0);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String property");
            helper.errorMessageCollection[0].Message.ShouldContain(commonEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
});
//# sourceMappingURL=StringPropertyMustNotMatchACommonSimpleTypeTests.js.map