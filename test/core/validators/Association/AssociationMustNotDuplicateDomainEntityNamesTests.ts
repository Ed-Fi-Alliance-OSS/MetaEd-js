/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import ValidationTestHelper from "../ValidationTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import TestRuleProvider from "../TestRuleProvider";
import {AssociationMustNotDuplicateDomainEntityNames}from "../../../../src/core/validators/Association/AssociationMustNotDuplicateDomainEntityNames"
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

let should = chai.should();

describe('AssociationMustNotDuplicateDomainEntityNamesTests', () => {
    let validatorListener = new ValidatorListener(new TestRuleProvider(MetaEdGrammar.RULE_Association, new AssociationMustNotDuplicateDomainEntityNames()));


    describe('entityNames', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
        const associationName: string = "Association1";
        const domainEntityName: string = "DomainEntity1";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
        const associationName: string = "Association1";
        const domainEntityName: string = "DomainEntity1";
        const contextName: string = "Context1";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
        const domainEntityName: string = "DomainEntity1";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
        const contextName: string = "Context1";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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