"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DomainEntityMustContainNoMoreThanOneUniqueIdColumn_1 = require("../../../../src/core/validators/DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn");
let should = chai.should();
describe('DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DomainEntityMustContainNoMoreThanOneUniqueIdColumn_1.DomainEntityMustContainNoMoreThanOneUniqueIdColumn()));
    describe('When_validating_domain_entity_with_no_uniqueId_fields', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        const entityName = "DomainEntity1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        const entityName = "DomainEntity1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
//# sourceMappingURL=DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests.js.map