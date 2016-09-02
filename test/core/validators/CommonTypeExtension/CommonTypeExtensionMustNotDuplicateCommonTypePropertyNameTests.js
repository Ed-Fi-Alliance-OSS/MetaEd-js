"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const CommonTypeExtensionMustNotDuplicateCommonTypePropertyName_1 = require("../../../../src/core/validators/CommonTypeExtension/CommonTypeExtensionMustNotDuplicateCommonTypePropertyName");
let should = chai.should();
describe('CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new CommonTypeExtensionMustNotDuplicateCommonTypePropertyName_1.CommonTypeExtensionMustNotDuplicateCommonTypePropertyName(entityType)));
    describe('When_common_type_extension_has_different_property_name', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndAssociation()
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
    describe('When_common_type_extension_has_duplicate_property_name', () => {
        let entityName = "MyIdentifier";
        const duplicatePropertyName = "Property1";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(duplicatePropertyName, "doc", true, false)
                .withEndCommonType()
                .withStartCommonTypeExtension(entityName)
                .withBooleanProperty(duplicatePropertyName, "doc", true, false)
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
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
        });
    });
});
//# sourceMappingURL=CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests.js.map