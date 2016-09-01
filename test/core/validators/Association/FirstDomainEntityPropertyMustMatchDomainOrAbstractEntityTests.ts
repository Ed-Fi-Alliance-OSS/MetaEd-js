/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import TestRuleProvider from "../TestRuleProvider";
import {FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity}from "../../../../src/core/validators/Association/FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity";
import SymbolTable from "../../../../src/core/validators/SymbolTable";

let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

let should = chai.should();

describe('FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests', () => {
    describe('When_domain_entity_property_has_domain_entity_identifier', () => {
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_firstDomainEntity, new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(symbolTable)));
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_entity_property_has_abstract_entity_identifier', () => {
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_firstDomainEntity, new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(symbolTable)));
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndAbstractEntity()

                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_entity_property_has_subclass_entity_identifier', () => {
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_firstDomainEntity, new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(symbolTable)));
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAbstractEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndAbstractEntity()

                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntitySubclass("Third", "First")
                .withDocumentation("doc")
                .withStringProperty("RequirePrimaryKey", "doc", true, false, 100)
                .withEndDomainEntity()

                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("Third", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_entity_property_has_invalid_identifier', () => {
        const symbolTable = new SymbolTable();
        const validatorListener = new ValidatorListener(
            new TestRuleProvider(MetaEdGrammar.RULE_firstDomainEntity, new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(symbolTable)));

        let entityName: string = "MyIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty(entityName, "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.length.should.not.equal(0)
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Domain Entity");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("does not match");
        });
    });
});