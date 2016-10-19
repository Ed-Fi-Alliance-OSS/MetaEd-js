"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DomainEntityExtensionExistsOnlyInExtensionNamespace_1 = require("../../../../src/core/validators/DomainEntityExtension/DomainEntityExtensionExistsOnlyInExtensionNamespace");
let should = chai.should();
describe('DomainEntityExtensionExistsOnlyInExtensionNamespaceTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DomainEntityExtensionExistsOnlyInExtensionNamespace_1.DomainEntityExtensionExistsOnlyInExtensionNamespace()));
    describe('When_domain_entity_extension_exists_in_extension', () => {
        let entityName = "MyIdentifier";
        const _property_name = "Property1";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "projectExtension")
                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_domain_entity_extension_exists_in_core', () => {
        const coreNamespace = "edfi";
        let entityName = "MyIdentifier";
        const _property_name = "Property1";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace(coreNamespace)
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndDomainEntity()
                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("is not valid in core namespace");
            helper.errorMessageCollection[0].Message.ShouldContain(coreNamespace);
        });
    });
});
//# sourceMappingURL=DomainEntityExtensionExistsOnlyInExtensionNamespaceTests.js.map