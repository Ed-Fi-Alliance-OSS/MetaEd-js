import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import TestRuleProvider from "../TestRuleProvider";
import {AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass}from "../../../../src/core/validators/AssociationExtension/AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass"
import SymbolTable from "../../../../src/core/validators/SymbolTable";

import {MetaEdGrammar} from '../../../../src/grammar/gen/MetaEdGrammar';
let should = chai.should();

describe('AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass', () => {
    describe('When_association_extension_has_valid_extendee', () => {
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(symbolTable)));

        let entityName: string = "MyIdentifier";
        const _property_name: string = "Property1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(symbolTable)));

        let entityName: string = "NotAnAssociationIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(symbolTable)));

        let entityName: string = "MyIdentifier";
        const subclassName: string = "MyIdentifierSubclass";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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