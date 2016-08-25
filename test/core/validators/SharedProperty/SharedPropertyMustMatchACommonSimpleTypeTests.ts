/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal}from "../../../../src/core/validators/SharedProperty/SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal"

let should = chai.should();

describe('SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.SharedDecimalPropertyContext>(
            new SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal(helper.symbolTable)));


    describe('When_shared_property_has_identifier_of_common_simple_decimal', () => {
        let entityName: string = "EntityName";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });


    describe('When_shared_property_has_identifier_of_common_simple_integer', () => {
        let entityName: string = "EntityName";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });


    describe('When_shared_property_has_identifier_of_common_simple_short', () => {
        let entityName: string = "EntityName";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });


    describe('When_shared_property_has_identifier_of_common_simple_string', () => {
        let entityName: string = "EntityName";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });


    describe('When_shared_decimal_property_has_invalid_identifier', () => {
        let entityName: string = "DoesNotExist";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedDecimalProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace();
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
        let entityName: string = "DoesNotExist";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedIntegerProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace();
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
        let entityName: string = "DoesNotExist";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedShortProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace();
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
        let entityName: string = "DoesNotExist";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withSharedStringProperty(entityName, propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace();
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