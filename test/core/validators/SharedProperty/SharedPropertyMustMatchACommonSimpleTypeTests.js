"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal_1 = require("../../../../src/core/validators/SharedProperty/SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal");
let should = chai.should();
describe('SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal_1.SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal(helper.symbolTable)));
    describe('When_shared_property_has_identifier_of_common_simple_decimal', () => {
        let entityName = "EntityName";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonDecimal(entityName)
                .withDocumentation("doc")
                .withTotalDigits("10")
                .withDecimalPlaces("2")
                .withEndCommonDecimal()
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedDecimalProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_shared_property_has_identifier_of_common_simple_integer', () => {
        let entityName = "EntityName";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonInteger(entityName)
                .withDocumentation("doc")
                .withMinValue(0)
                .withMaxValue(1000)
                .withEndCommonInteger()
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedDecimalProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_shared_property_has_identifier_of_common_simple_short', () => {
        let entityName = "EntityName";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort(entityName)
                .withDocumentation("doc")
                .withMinValue(0)
                .withMaxValue(1000)
                .withEndCommonShort()
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedDecimalProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_shared_property_has_identifier_of_common_simple_string', () => {
        let entityName = "EntityName";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonString(entityName)
                .withDocumentation("doc")
                .withMaxLength(100)
                .withEndCommonString()
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedDecimalProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_shared_decimal_property_has_invalid_identifier', () => {
        let entityName = "DoesNotExist";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedDecimalProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Shared property");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
    describe('When_shared_integer_property_has_invalid_identifier', () => {
        let entityName = "DoesNotExist";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedIntegerProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Shared property");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
    describe('When_shared_short_property_has_invalid_identifier', () => {
        let entityName = "DoesNotExist";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedShortProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Shared property");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
    describe('When_shared_string_property_has_invalid_identifier', () => {
        let entityName = "DoesNotExist";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedStringProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Shared property");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});
//# sourceMappingURL=SharedPropertyMustMatchACommonSimpleTypeTests.js.map