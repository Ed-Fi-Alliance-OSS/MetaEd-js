"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const AssociationMustNotDuplicateDomainEntityNames_1 = require("../../../../src/core/validators/Association/AssociationMustNotDuplicateDomainEntityNames");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
let should = chai.should();
describe('AssociationMustNotDuplicateDomainEntityNamesTests', () => {
    let validatorListener = new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_Association, new AssociationMustNotDuplicateDomainEntityNames_1.AssociationMustNotDuplicateDomainEntityNames()));
    describe('entityNames', () => {
        let helper = new ValidationTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc1")
                .withDomainEntityProperty("DomainEntity2", "doc2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('entityNames', () => {
        const associationName = "Association1";
        const domainEntityName = "DomainEntity1";
        let helper = new ValidationTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(associationName)
                .withDocumentation("doc")
                .withDomainEntityProperty(domainEntityName, "doc1")
                .withDomainEntityProperty(domainEntityName, "doc2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Association");
            helper.errorMessageCollection[0].message.should.include(associationName);
            helper.errorMessageCollection[0].message.should.include(domainEntityName);
            helper.errorMessageCollection[0].message.should.include("duplicate declarations");
        });
    });
    describe('entityNames_and_same_contexts', () => {
        const associationName = "Association1";
        const domainEntityName = "DomainEntity1";
        const contextName = "Context1";
        let helper = new ValidationTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(associationName)
                .withDocumentation("doc")
                .withDomainEntityProperty(domainEntityName, "doc1", contextName)
                .withDomainEntityProperty(domainEntityName, "doc2", contextName)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Association");
            helper.errorMessageCollection[0].message.should.include(associationName);
            helper.errorMessageCollection[0].message.should.include(domainEntityName);
            helper.errorMessageCollection[0].message.should.include("duplicate declarations");
        });
    });
    describe('entityNames_and_different_contexts', () => {
        const domainEntityName = "DomainEntity1";
        let helper = new ValidationTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty(domainEntityName, "doc1", "Context1")
                .withDomainEntityProperty(domainEntityName, "doc2", "Context2")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('entityNames_and_same_contexts', () => {
        const contextName = "Context1";
        let helper = new ValidationTestHelper_1.default();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc1", contextName)
                .withDomainEntityProperty("DomainEntity2", "doc2", contextName)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});
//# sourceMappingURL=AssociationMustNotDuplicateDomainEntityNamesTests.js.map