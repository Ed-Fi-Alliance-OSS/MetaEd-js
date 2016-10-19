import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {StringPropertyMinLengthMustNotBeGreaterThanMaxLength}from "../../../../src/core/validators/StringProperty/StringPropertyMinLengthMustNotBeGreaterThanMaxLength"

let should = chai.should();

describe('ReplaceMeWithFileName', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(
            new StringPropertyMinLengthMustNotBeGreaterThanMaxLength()));


    describe('When_validating_string_property_with_no_min_length', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let maxLength: string = 100;
        let minLength: string = 50;
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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
        let entityName: string = "EntityForTest";
        const stringPropertyName: string = "StringProperty";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let maxLength: string = 50;
        let minLength: string = 100;
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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
        let entityName: string = "EntityForTest";
        const stringPropertyName: string = "StringProperty";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        let maxLength: string = 100;
        let minLength: string = 100;
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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