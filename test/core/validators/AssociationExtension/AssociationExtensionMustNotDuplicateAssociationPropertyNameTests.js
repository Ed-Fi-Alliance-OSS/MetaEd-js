"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const SymbolTable_1 = require("../../../../src/core/validators/SymbolTable");
const AssociationExtensionMustNotDuplicateAssociationPropertyName_1 = require("../../../../src/core/validators/AssociationExtension/AssociationExtensionMustNotDuplicateAssociationPropertyName");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
let should = chai.should();
describe('AssociationExtensionMustNotDuplicateAssociationPropertyName', () => {
    describe('When_association_extension_has_different_property_name', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName_1.AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));
        let entityName = "MyIdentifier";
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
    describe('When_association_extension_has_duplicate_property_name', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName_1.AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));
        let entityName = "MyIdentifier";
        const duplicatePropertyName = "Property1";
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
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
            helper.errorMessageCollection[0].message.should.include(duplicatePropertyName);
            helper.errorMessageCollection[0].message.should.include("already in property list");
        });
    });
    describe('When_association_extension_has_multiple_association_names', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName_1.AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));
        let entityName = "MyIdentifier";
        const notDuplicatePropertyName = "NotADuplicate";
        const duplicatePropertyName1 = "Property1";
        const duplicatePropertyName2 = "Property2";
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
                .withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
                .withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
                .withBooleanProperty(notDuplicatePropertyName, "because a property is required", true, false)
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
            helper.errorMessageCollection[0].message.should.include(duplicatePropertyName1);
            helper.errorMessageCollection[0].message.should.include(duplicatePropertyName2);
            helper.errorMessageCollection[0].message.should.include("already in property list");
            helper.errorMessageCollection[0].message.should.not.include(notDuplicatePropertyName);
        });
    });
    describe('When_association_extension_has_duplicate_include_property', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName_1.AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));
        let entityName = "MyIdentifier";
        const duplicatePropertyName = "Property1";
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.length.should.equal(1);
        });
    });
    describe('When_association_extension_has_duplicate_include_extension_override_property', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName_1.AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));
        let entityName = "MyIdentifier";
        const duplicatePropertyName = "Property1";
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withIncludeExtensionOverrideProperty(duplicatePropertyName, "doc", true, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyNameTests.js.map