"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const AssociationMustNotDuplicateDomainEntityNames_1 = require("../../../../src/core/validators/Association/AssociationMustNotDuplicateDomainEntityNames");
let should = chai.should();
describe('AssociationMustNotDuplicateDomainEntityNamesTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new AssociationMustNotDuplicateDomainEntityNames_1.AssociationMustNotDuplicateDomainEntityNames()));
    describe('entityNames', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc1")
                .withDomainEntityProperty("DomainEntity2", "doc2")
                .withEndAssociation()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('entityNames', () => {
        const associationName = "Association1";
        const domainEntityName = "DomainEntity1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(associationName)
                .withDocumentation("doc")
                .withDomainEntityProperty(domainEntityName, "doc1")
                .withDomainEntityProperty(domainEntityName, "doc2")
                .withEndAssociation()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association");
            helper.errorMessageCollection[0].Message.ShouldContain(associationName);
            helper.errorMessageCollection[0].Message.ShouldContain(domainEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("duplicate declarations");
        });
    });
    describe('entityNames_and_same_contexts', () => {
        const associationName = "Association1";
        const domainEntityName = "DomainEntity1";
        const contextName = "Context1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(associationName)
                .withDocumentation("doc")
                .withDomainEntityProperty(domainEntityName, "doc1", contextName)
                .withDomainEntityProperty(domainEntityName, "doc2", contextName)
                .withEndAssociation()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association");
            helper.errorMessageCollection[0].Message.ShouldContain(associationName);
            helper.errorMessageCollection[0].Message.ShouldContain(domainEntityName);
            helper.errorMessageCollection[0].Message.ShouldContain("duplicate declarations");
        });
    });
    describe('entityNames_and_different_contexts', () => {
        const domainEntityName = "DomainEntity1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty(domainEntityName, "doc1", "Context1")
                .withDomainEntityProperty(domainEntityName, "doc2", "Context2")
                .withEndAssociation()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('entityNames_and_same_contexts', () => {
        const contextName = "Context1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc1", contextName)
                .withDomainEntityProperty("DomainEntity2", "doc2", contextName)
                .withEndAssociation()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
});
//# sourceMappingURL=AssociationMustNotDuplicateDomainEntityNamesTests.js.map