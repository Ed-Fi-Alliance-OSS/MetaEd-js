"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DecimalPropertyMustNotMatchACommonSimpleType_1 = require("../../../../src/core/validators/DecimalProperty/DecimalPropertyMustNotMatchACommonSimpleType");
let should = chai.should();
describe('DecimalPropertyMustNotMatchACommonSimpleTypeTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DecimalPropertyMustNotMatchACommonSimpleType_1.DecimalPropertyMustNotMatchACommonSimpleType(symbolTable)));
    describe('When_decimal_property_has_identifier_matching_no_common_simple_types', () => {
        let entityName = "EntityName";
        let propertyName = "PropertyName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withDecimalProperty(propertyName, "doc", false, false, "10", "2")
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_decimal_property_has_identifier_matching_common_decimal', () => {
        const entityName = "CommonEntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonDecimal(entityName)
                .withDocumentation("doc")
                .withTotalDigits("10")
                .withDecimalPlaces("2")
                .withEndCommonDecimal()
                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withDecimalProperty(entityName, "doc", false, false, "10", "2")
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Decimal property");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
    describe('When_decimal_property_has_identifier_matching_common_integer', () => {
        const entityName = "CommonEntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonInteger(entityName)
                .withDocumentation("doc")
                .withMaxValue(100)
                .withEndCommonInteger()
                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withDecimalProperty(entityName, "doc", false, false, "10", "2")
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Decimal property");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
    describe('When_decimal_property_has_identifier_matching_common_short', () => {
        const entityName = "CommonEntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonShort(entityName)
                .withDocumentation("doc")
                .withMaxValue(100)
                .withEndCommonShort()
                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withDecimalProperty(entityName, "doc", false, false, "10", "2")
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Decimal property");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
    describe('When_decimal_property_has_identifier_matching_common_string', () => {
        const entityName = "CommonEntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonString(entityName)
                .withDocumentation("doc")
                .withMaxLength(100)
                .withEndCommonString()
                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withDecimalProperty(entityName, "doc", false, false, "10", "2")
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Decimal property");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
});
//# sourceMappingURL=DecimalPropertyMustNotMatchACommonSimpleTypeTests.js.map