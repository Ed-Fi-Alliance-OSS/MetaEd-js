/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity}from "../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity"

let should = chai.should();

describe('DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(
            new DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity(helper.symbolTable)));


    describe('When_domain_entity_subclass_renames_base_identity', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseDomainEntityIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withEndDomainEntity()

                .withStartDomainEntitySubclass("When_domain_entity_subclass_renames_base_identity_entity_Name", baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });


    describe('When_domain_entity_subclass_does_not_rename_identity', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseDomainEntityIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });


    describe('When_domain_entity_subclass_renames_base_identity_more_than_once', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseDomainEntityIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.should.not.be.empty;
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
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseDomainEntityIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntitySubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
});