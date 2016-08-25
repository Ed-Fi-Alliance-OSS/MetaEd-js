"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension_1 = require("../../../../src/core/validators/IncludeProperty/IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension");
let should = chai.should();
describe('IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension_1.IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension(helper.symbolTable)));
    describe('When_include_property_has_extension_override_of_non_common_type_extension', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartDomainEntityExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("include extension");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_include_property_has_extension_override_of_common_type_extension', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartCommonTypeExtension(commonTypeName)
                .withBooleanProperty("DummyProperty3", "doc", true, false)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartDomainEntityExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });
});
//# sourceMappingURL=IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtensionTests.js.map