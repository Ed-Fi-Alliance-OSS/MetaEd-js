"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const IncludePropertyMustNotContainIdentity_1 = require("../../../../src/core/validators/IncludeProperty/IncludePropertyMustNotContainIdentity");
let should = chai.should();
describe('IncludePropertyMustNotContainIdentity', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new IncludePropertyMustNotContainIdentity_1.IncludePropertyMustNotContainIdentity()));
    describe('When_include_property_has_primary_key', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withStringProperty("StringProperty", "doc", true, false, 100)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIdentityProperty("include", propertyName, "doc")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Include");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
});
//# sourceMappingURL=IncludePropertyMustNotContainIdentityTests.js.map