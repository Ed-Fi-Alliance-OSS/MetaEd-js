"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const CommonTypeExtensionIdentifierMustMatchACommonType_1 = require("../../../../src/core/validators/CommonTypeExtension/CommonTypeExtensionIdentifierMustMatchACommonType");
let should = chai.should();
describe('CommonTypeExtensionIdentifierMustMatchACommonTypeTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new CommonTypeExtensionIdentifierMustMatchACommonType_1.CommonTypeExtensionIdentifierMustMatchACommonType()));
    describe('When_common_type_extension_has_valid_extendee', () => {
        let entityName = "MyIdentifier";
        const _property_name = "Property1";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndCommonType()
                .withStartCommonTypeExtension(entityName)
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndCommonTypeExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_common_type_extension_has_invalid_extendee', () => {
        let entityName = "NotACommonTypeIdentifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonTypeExtension(entityName)
                .withBooleanProperty("Property2", "doc", false, false)
                .withEndCommonTypeExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Common Type additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});
//# sourceMappingURL=CommonTypeExtensionIdentifierMustMatchACommonTypeTests.js.map