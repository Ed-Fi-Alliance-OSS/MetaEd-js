"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity_1 = require("../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity");
let should = chai.should();
describe('DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity_1.DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity(helper.symbolTable)));
    describe('When_domain_entity_subclass_renames_base_identity', () => {
        let entityName = "SubclassIdentifier";
        const baseName = "BaseDomainEntityIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass("When_domain_entity_subclass_renames_base_identity_entity_Name", baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.ShouldBeEmpty();
        });
    });
    describe('When_domain_entity_subclass_does_not_rename_identity', () => {
        let entityName = "SubclassIdentifier";
        const baseName = "BaseDomainEntityIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withStringIdentity("Property2", "because a property is required", 100)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass("When_domain_entity_subclass_does_not_rename_identity_entity_Name", baseName)
                .withDocumentation("because documentation is required")
                .withStringProperty("Property3", "because a property is required", true, false, 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.ShouldBeEmpty();
        });
    });
    describe('When_domain_entity_subclass_renames_base_identity_more_than_once', () => {
        let entityName = "SubclassIdentifier";
        const baseName = "BaseDomainEntityIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withStringIdentity("Property2", "because a property is required", 100)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass("When_domain_entity_subclass_renames_base_identity_more_than_once_entity_name", baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property3", "Property1", "because a property is required", 100)
                .withStringIdentityRename("Property4", "Property2", "because a property is required", 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.ShouldNotBeEmpty();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("based on");
            helper.errorMessageCollection[0].Message.ShouldContain(baseName);
            helper.errorMessageCollection[0].Message.ShouldContain("is invalid for identity rename");
            helper.errorMessageCollection[0].Message.ShouldContain("has more than one identity property");
        });
    });
    describe('When_domain_entity_subclass_extends_non_existant_entity', () => {
        let entityName = "SubclassIdentifier";
        const baseName = "BaseDomainEntityIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntitySubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.ShouldBeEmpty();
        });
    });
});
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentityTests.js.map