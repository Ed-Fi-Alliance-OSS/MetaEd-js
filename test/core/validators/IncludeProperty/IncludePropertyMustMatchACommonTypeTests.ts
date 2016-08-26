/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {IncludePropertyMustMatchACommonType}from "../../../../src/core/validators/IncludeProperty/IncludePropertyMustMatchACommonType"

let should = chai.should();

describe('IncludePropertyMustMatchACommonType', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(
            new IncludePropertyMustMatchACommonType(helper.symbolTable)));


    describe('When_include_property_has_identifier_of_common_type', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartCommonType(entityName)
                .withDocumentation("doc")
                .withStringProperty("StringProperty", "doc", true, false, 100)
                .withEndCommonType()
                
.withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withIncludeProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_include_property_has_identifier_of_inline_common_type', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartInlineCommonType(entityName)
                .withDocumentation("doc")
                .withStringProperty("StringProperty", "doc", true, false, 100)
                .withEndInlineCommonType()
                
.withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withIncludeProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_include_property_has_identifier_of_choice_common_type', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartChoiceType(entityName)
                .withDocumentation("doc")
                .withStringProperty("StringProperty", "doc", true, false, 100)
                .withEndChoiceType()
                
.withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withIncludeProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_include_property_has_invalid_identifier', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withIncludeProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.length.should.not.equal(0);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Include");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});