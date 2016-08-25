"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass_1 = require("../../../../src/core/validators/DomainEntityExtension/DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass");
let should = chai.should();
describe('DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass_1.DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(helper.symbolTable)));
    describe('When_domain_entity_extension_has_valid_extendee', () => {
        let entityName = "MyIdentifier";
        const _property_name = "Property1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
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
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_domain_entity_extension_has_invalid_extendee', () => {
        let entityName = "NotADomainEntityIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", false, false)
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
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
    describe('When_domain_entity_extension_extends_domain_entity_subclass', () => {
        let entityName = "MyIdentifier";
        const subclassName = "MyIdentifierSubclass";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass(subclassName, entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndDomainEntitySubclass()
                .withStartDomainEntityExtension(subclassName)
                .withBooleanProperty("Property3", "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_domain_entity_extension_extends_abstract_domain_entity', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAbstractEntity()
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
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});
//# sourceMappingURL=DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclassTests.js.map