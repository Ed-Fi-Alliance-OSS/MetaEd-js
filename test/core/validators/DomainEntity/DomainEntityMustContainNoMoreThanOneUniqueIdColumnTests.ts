/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {DomainEntityMustContainNoMoreThanOneUniqueIdColumn}from "../../../../src/core/validators/DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn"

let should = chai.should();

describe('DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainEntityContext>(
            new DomainEntityMustContainNoMoreThanOneUniqueIdColumn()));


    describe('When_validating_domain_entity_with_no_uniqueId_fields', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity1")
                .withDocumentation("doc1")
                .withStringIdentity("Property1", "doc2", 100)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });


    describe('When_validating_domain_entity_with_one_uniqueId_field', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity1")
                .withDocumentation("doc1")
                .withStringIdentity("UniqueId", "doc2", 100)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });


    describe('When_validating_domain_entity_with_multiple_uniqueId_fields', () => {
        const entityName: string = "DomainEntity1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc1")
                .withStringIdentity("UniqueId", "doc2", 100, null, null, "Student")
                .withStringIdentity("UniqueId", "doc2", 100, null, null, "Staff")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("has multiple properties with a property name of 'UniqueId'");
        });
    });


    describe('When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace', () => {
        const entityName: string = "DomainEntity1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("extension", "projectExtension")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc1")
                .withStringIdentity("UniqueId", "doc2", 100, null, null, "Student")
                .withStringIdentity("UniqueId", "doc2", 100, null, null, "Staff")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
});