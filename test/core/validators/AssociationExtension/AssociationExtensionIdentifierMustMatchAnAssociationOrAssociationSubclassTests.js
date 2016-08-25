"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass_1 = require("../../../../src/core/validators/AssociationExtension/AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass");
let should = chai.should();
describe('AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass_1.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(symbolTable)));
    describe('When_association_extension_has_valid_extendee', () => {
        let entityName = "MyIdentifier";
        const _property_name = "Property1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_association_extension_has_invalid_extendee', () => {
        let entityName = "NotAnAssociationIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociationExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", false, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
    describe('When_association_extension_extends_association_subclass', () => {
        let entityName = "MyIdentifier";
        const subclassName = "MyIdentifierSubclass";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()
                .withStartAssociationSubclass(subclassName, entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociationSubclass()
                .withStartAssociationExtension(subclassName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
});
//# sourceMappingURL=AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests.js.map