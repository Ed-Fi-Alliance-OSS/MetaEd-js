"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const InlineCommonTypeExistsOnlyInCoreNamespace_1 = require("../../../../src/core/validators/InlineCommonType/InlineCommonTypeExistsOnlyInCoreNamespace");
let should = chai.should();
describe('InlineCommonTypeExistsOnlyInCoreNamespace', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new InlineCommonTypeExistsOnlyInCoreNamespace_1.InlineCommonTypeExistsOnlyInCoreNamespace()));
    describe('When_inline_common_type_exists_in_core', () => {
        let entityName = "MyIdentifier";
        const _property_name = "Property1";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        const extensionNamespace = "edfi";
        let entityName = "MyIdentifier";
        const propertyName = "Property1";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace(extensionNamespace, "projectExtension")
                .withStartInlineCommonType(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndInlineCommonType()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Inline Common Type");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("is not valid in extension namespace");
            helper.errorMessageCollection[0].Message.ShouldContain(extensionNamespace);
        });
    });
});
//# sourceMappingURL=InlineCommonTypeExistsOnlyInCoreNamespaceTests.js.map