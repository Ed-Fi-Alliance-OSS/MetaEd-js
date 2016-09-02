/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import TestRuleProvider from "../TestRuleProvider";
import {AssociationExtensionExistsOnlyInExtensionNamespace}from "../../../../src/core/validators/AssociationExtension/AssociationExtensionExistsOnlyInExtensionNamespace"
import SymbolTable from "../../../../src/core/validators/SymbolTable";

let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
let should = chai.should();

describe('AssociationExtensionExistsOnlyInExtensionNamespaceTests', () => {
    describe('When_association_extension_exists_in_extension', () => {
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionExistsOnlyInExtensionNamespace()));
        let entityName: string = "MyIdentifier";
        const _property_name: string = "Property1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionExistsOnlyInExtensionNamespace()));
        const coreNamespace: string = "edfi";
        let entityName: string = "MyIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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