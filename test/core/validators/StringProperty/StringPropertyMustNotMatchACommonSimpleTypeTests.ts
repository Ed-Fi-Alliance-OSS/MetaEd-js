/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {StringPropertyMustNotMatchACommonSimpleType}from "../../../../src/core/validators/StringProperty/StringPropertyMustNotMatchACommonSimpleType"

let should = chai.should();

describe('StringPropertyMustNotMatchACommonSimpleType', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(
            new StringPropertyMustNotMatchACommonSimpleType(symbolTable)));


    describe('When_string_property_has_identifier_matching_no_common_simple_types', () => {
        let entityName: string = "EntityName";
        let propertyName: string = "PropertyName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withStringProperty(propertyName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });


    describe('When_string_property_has_identifier_matching_common_decimal', () => {
        const const commonEntityName: string = "CommonEntityName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String property");
            helper.errorMessageCollection[0].Message.ShouldContain(commonEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });

    describe('When_string_property_has_identifier_matching_common_integer', () => {
        const const commonEntityName: string = "CommonEntityName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String property");
            helper.errorMessageCollection[0].Message.ShouldContain(commonEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });

    describe('When_string_property_has_identifier_matching_common_short', () => {
        const const commonEntityName: string = "CommonEntityName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String property");
            helper.errorMessageCollection[0].Message.ShouldContain(commonEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });

    describe('When_string_property_has_identifier_matching_common_string', () => {
        const const commonEntityName: string = "CommonEntityName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("String property");
            helper.errorMessageCollection[0].Message.ShouldContain(commonEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
        });
    });
});