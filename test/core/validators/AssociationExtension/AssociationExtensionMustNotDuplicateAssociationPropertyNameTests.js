import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import TestRuleProvider from "../TestRuleProvider";
import SymbolTable from "../../../../src/core/validators/SymbolTable";
import {AssociationExtensionMustNotDuplicateAssociationPropertyName} from "../../../../src/core/validators/AssociationExtension/AssociationExtensionMustNotDuplicateAssociationPropertyName";

import {MetaEdGrammar} from '../../../../src/grammar/gen/MetaEdGrammar';
let should = chai.should();

describe('AssociationExtensionMustNotDuplicateAssociationPropertyName', () => {
    describe('When_association_extension_has_different_property_name', () => {
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));

        let entityName: string = "MyIdentifier";
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


    describe('When_association_extension_has_duplicate_property_name', () => {
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));

        let entityName: string = "MyIdentifier";
        const duplicatePropertyName: string = "Property1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()
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
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));

        let entityName: string = "MyIdentifier";
        const notDuplicatePropertyName: string = "NotADuplicate";
        const duplicatePropertyName1: string = "Property1";
        const duplicatePropertyName2: string = "Property2";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()
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
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));

        let entityName: string = "MyIdentifier";
        const duplicatePropertyName: string = "Property1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()
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
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_associationExtension, new AssociationExtensionMustNotDuplicateAssociationPropertyName(symbolTable)));

        let entityName: string = "MyIdentifier";
        const duplicatePropertyName: string = "Property1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()
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