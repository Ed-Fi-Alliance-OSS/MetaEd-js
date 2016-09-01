"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity_1 = require("../../../../src/core/validators/Association/SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity");
const SymbolTable_1 = require("../../../../src/core/validators/SymbolTable");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
let should = chai.should();
describe('SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity', () => {
    describe('When_domain_entity_property_has_domain_entity_identifier', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_secondDomainEntity, new SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity_1.SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(symbolTable)));
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_secondDomainEntity, new SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity_1.SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(symbolTable)));
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartAbstractEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndAbstractEntity()
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
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_secondDomainEntity, new SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity_1.SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(symbolTable)));
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
                .withDomainEntityProperty("Second", "doc1")
                .withDomainEntityProperty("Third", "doc2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_domain_entity_property_has_invalid_identifier', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_secondDomainEntity, new SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity_1.SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(symbolTable)));
        let entityName = "MyIdentifier";
        let helper = new ValidatorTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty(entityName, "doc2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.length.should.not.equal(0);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Domain Entity");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("does not match");
        });
    });
});
//# sourceMappingURL=SecondDomainEntityPropertyMustMatchDomainEntityTests.js.map