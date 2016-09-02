"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const AssociationExtensionExistsOnlyInExtensionNamespace_1 = require("../../../../src/core/validators/AssociationExtension/AssociationExtensionExistsOnlyInExtensionNamespace");
const SymbolTable_1 = require("../../../../src/core/validators/SymbolTable");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
let should = chai.should();
describe('AssociationExtensionExistsOnlyInExtensionNamespaceTests', () => {
    describe('When_association_extension_exists_in_extension', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionExistsOnlyInExtensionNamespace_1.AssociationExtensionExistsOnlyInExtensionNamespace()));
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
                .withEndNamespace()
                .withBeginNamespace("extension", "projectExtension")
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
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionExistsOnlyInExtensionNamespace_1.AssociationExtensionExistsOnlyInExtensionNamespace()));
        const coreNamespace = "edfi";
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
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.length.should.equal(1);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Association additions");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("is not valid in core namespace");
            helper.errorMessageCollection[0].message.should.include(coreNamespace);
        });
    });
});
//# sourceMappingURL=AssociationExtensionExistsOnlyInExtensionNamespaceTests.js.map