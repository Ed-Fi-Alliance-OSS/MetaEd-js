import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {InlineCommonTypeExistsOnlyInCoreNamespace}from "../../../../src/core/validators/InlineCommonType/InlineCommonTypeExistsOnlyInCoreNamespace"

let should = chai.should();

describe('InlineCommonTypeExistsOnlyInCoreNamespace', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.InlineCommonTypeContext>(
            new InlineCommonTypeExistsOnlyInCoreNamespace()));


    describe('When_inline_common_type_exists_in_core', () => {
        let entityName: string = "MyIdentifier";
        const _property_name: string = "Property1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartInlineCommonType(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndInlineCommonType()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_inline_common_type_exists_in_extension', () => {
        const extensionNamespace: string = "edfi";
        let entityName: string = "MyIdentifier";
        const propertyName: string = "Property1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace(extensionNamespace, "projectExtension")
                .withStartInlineCommonType(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndInlineCommonType()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Inline Common Type");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("is not valid in extension namespace");
            helper.errorMessageCollection[0].message.should.include(extensionNamespace);
        });
    });
});