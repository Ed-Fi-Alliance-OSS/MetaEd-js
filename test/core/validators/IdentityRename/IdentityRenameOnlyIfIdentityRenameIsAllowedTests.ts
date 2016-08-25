/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {IdentityRenameExistsOnlyIfIdentityRenameIsAllowed}from "../../../../src/core/validators/IdentityRename/IdentityRenameExistsOnlyIfIdentityRenameIsAllowed"

let should = chai.should();

describe('IdentityRenameExistsOnlyIfIdentityRenameIsAllowedTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.IdentityRenameContext>(
            new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed()));

    describe('When_association_subclass_has_invalid_identity_rename_property', () => {
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringIdentityRename(propertyName, "BaseIdentifier", "Docs", 100)
                .withEndAssociation()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });

    describe('When_domain_entity_has_invalid_identity_rename_property', () => {
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentityRename(propertyName, "BaseIdentifier", "doc", 100)
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });

    describe('When_association_subclass_has_valid_identity_rename_property', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringIdentity("BaseIdentifier", "doc", 100)
                .withEndAssociation()

                .withStartAssociationSubclass("NewSubclass", entityName)
                .withDocumentation("doc")
                .withStringIdentityRename("Identifier", "BaseIdentifier", "Docs", 100)
                .withEndAssociationSubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });


    describe('When_domain_entity_subclass_has_valid_identity_rename_property', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("BaseIdentifier", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntitySubclass("NewSubclass", entityName)
                .withDocumentation("doc")
                .withStringIdentityRename("Identifier", "BaseIdentifier", "Docs", 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
});