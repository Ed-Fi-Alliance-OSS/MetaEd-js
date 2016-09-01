"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const FirstDomainEntityPropertyMustNotCollideWithOtherProperty_1 = require("../../../../src/core/validators/Association/FirstDomainEntityPropertyMustNotCollideWithOtherProperty");
const SymbolTable_1 = require("../../../../src/core/validators/SymbolTable");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
let should = chai.should();
describe('FirstDomainEntityPropertyMustNotCollideWithOtherProperty', () => {
    describe('When_domain_entity_property_does_not_collide', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_firstDomainEntity, new FirstDomainEntityPropertyMustNotCollideWithOtherProperty_1.FirstDomainEntityPropertyMustNotCollideWithOtherProperty(symbolTable)));
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
                .withIntegerProperty("Third", "doc3", false, false)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_domain_entity_property_does_collide', () => {
        const symbolTable = new SymbolTable_1.default();
        const validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_firstDomainEntity, new FirstDomainEntityPropertyMustNotCollideWithOtherProperty_1.FirstDomainEntityPropertyMustNotCollideWithOtherProperty(symbolTable)));
        const associationName = "Association1";
        const firstName = "First";
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
                .withIntegerProperty("First", "doc3", false, false)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(1);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Entity");
            helper.errorMessageCollection[0].message.should.include(associationName);
            helper.errorMessageCollection[0].message.should.include("has duplicate");
            helper.errorMessageCollection[0].message.should.include(firstName);
        });
    });
});
//# sourceMappingURL=FirstDomainEntityPropertyMustNotCollideWithOtherPropertyTests.js.map