"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass_1 = require("../../../../src/core/validators/AssociationExtension/AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass");
const SymbolTable_1 = require("../../../../src/core/validators/SymbolTable");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
let should = chai.should();
describe('AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass', () => {
    describe('When_association_extension_has_valid_extendee', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass_1.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(symbolTable)));
        let entityName = "MyIdentifier";
        const _property_name = "Property1";
        let helper = new ValidatorTestHelper_1.default();
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
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_association_extension_has_invalid_extendee', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass_1.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(symbolTable)));
        let entityName = "NotAnAssociationIdentifier";
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociationExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", false, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.length.should.equal(1);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Association additions");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("does not match");
        });
    });
    describe('When_association_extension_extends_association_subclass', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass_1.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(symbolTable)));
        let entityName = "MyIdentifier";
        const subclassName = "MyIdentifierSubclass";
        let helper = new ValidatorTestHelper_1.default();
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
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});
//# sourceMappingURL=AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests.js.map