"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const IdentityRenameExistsOnlyIfIdentityRenameIsAllowed_1 = require("../../../../src/core/validators/IdentityRename/IdentityRenameExistsOnlyIfIdentityRenameIsAllowed");
let should = chai.should();
describe('IdentityRenameExistsOnlyIfIdentityRenameIsAllowedTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed_1.IdentityRenameExistsOnlyIfIdentityRenameIsAllowed()));
    describe('When_association_subclass_has_invalid_identity_rename_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
//# sourceMappingURL=IdentityRenameOnlyIfIdentityRenameIsAllowedTests.js.map