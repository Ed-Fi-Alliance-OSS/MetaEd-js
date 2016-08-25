"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
let should = chai.should();
describe('AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass', () => {
    //TODO: multiple validatorListeners 
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass()));
    describe('When_association_subclass_renames_base_identity', () => {
        let entityName = "SubclassIdentifier";
        baseName: string = "BaseAssociationIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(baseName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withEndAssociation()
                .withStartAssociationSubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                .withEndAssociationSubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
    }, protected, getRuleProvider(), IRuleProvider, {
        return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
});
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.ShouldBeEmpty();
});
;
describe('When_association_subclass_does_not_rename_identity', () => {
    let entityName = "SubclassIdentifier";
    baseName: string = "BaseAssociationIdentifier";
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
    before(() => {
        let metaEdText = MetaEdTextBuilder_1.default.buildIt
            .withBeginNamespace("edfi")
            .withStartAssociation(baseName)
            .withDocumentation("because documentation is required")
            .withDomainEntityProperty("DomainEntity1", "doc")
            .withDomainEntityProperty("DomainEntity2", "doc")
            .withStringIdentity("Property1", "because a property is required", 100)
            .withEndAssociation()
            .withStartAssociationSubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringProperty("Property2", "because a property is required", true, false, 100)
            .withEndAssociationSubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.ShouldBeEmpty();
});
;
describe('When_association_subclass_renames_base_identity_more_than_once', () => {
    let entityName = "SubclassIdentifier";
    baseName: string = "BaseAssociationIdentifier";
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
    before(() => {
        let metaEdText = MetaEdTextBuilder_1.default.buildIt
            .withBeginNamespace("edfi")
            .withStartAssociation(baseName)
            .withDocumentation("because documentation is required")
            .withDomainEntityProperty("DomainEntity1", "doc")
            .withDomainEntityProperty("DomainEntity2", "doc")
            .withStringIdentity("Property1", "because a property is required", 100)
            .withStringIdentity("Property2", "because a property is required", 100)
            .withEndAssociation()
            .withStartAssociationSubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringIdentityRename("Property3", "Property1", "because a property is required", 100)
            .withStringIdentityRename("Property4", "Property2", "because a property is required", 100)
            .withEndAssociationSubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new AssociationSubclassIdentityRenameMustExistNoMoreThanOnce() }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.ShouldNotBeEmpty();
});
it('should_have_validation_failure_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename columns Property1, Property2.  Only one identity rename is allowed for a given Association.");
});
;
describe('When_association_subclass_renames_base_identity_that_does_not_exist', () => {
    let entityName = "SubclassIdentifier";
    baseName: string = "BaseAssociationIdentifier";
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
    before(() => {
        let metaEdText = MetaEdTextBuilder_1.default.buildIt
            .withBeginNamespace("edfi")
            .withStartAssociation(baseName)
            .withDocumentation("because documentation is required")
            .withDomainEntityProperty("DomainEntity1", "doc")
            .withDomainEntityProperty("DomainEntity2", "doc")
            .withStringIdentity("Property1", "because a property is required", 100)
            .withEndAssociation()
            .withStartAssociationSubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
            .withEndAssociationSubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.ShouldNotBeEmpty();
});
it('should_have_validation_failure_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename Property3 which is not part of the identity.");
});
;
describe('When_association_subclass_renames_base_property_that_is_not_identity', () => {
    let entityName = "SubclassIdentifier";
    baseName: string = "BaseAssociationIdentifier";
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
    before(() => {
        let metaEdText = MetaEdTextBuilder_1.default.buildIt
            .withBeginNamespace("edfi")
            .withStartAssociation(baseName)
            .withDocumentation("because documentation is required")
            .withDomainEntityProperty("DomainEntity1", "doc")
            .withDomainEntityProperty("DomainEntity2", "doc")
            .withStringProperty("Property1", "because a property is required", true, false, 100)
            .withEndAssociation()
            .withStartAssociationSubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
            .withEndAssociationSubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.ShouldNotBeEmpty();
});
it('should_have_validation_failure_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename Property1 which is not part of the identity.");
});
;
describe('When_association_subclass_extends_non_existent_entity', () => {
    let entityName = "SubclassIdentifier";
    baseName: string = "BaseAssociationIdentifier";
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
    before(() => {
        let metaEdText = MetaEdTextBuilder_1.default.buildIt
            .withBeginNamespace("edfi")
            .withStartAssociationSubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
            .withEndAssociationSubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.ShouldBeEmpty();
});
;
;
//# sourceMappingURL=AssociationSubclassPrimaryKeyRenameMustMatchPrimaryKeyPropertyInBaseClassTests.js.map