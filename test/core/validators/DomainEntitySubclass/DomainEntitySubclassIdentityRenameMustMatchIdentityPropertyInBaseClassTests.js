"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass_1 = require("../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass");
let should = chai.should();
//TODO: Different TestRuleProvider parameters!
describe('DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass_1.DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable)));
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
                .withStartDomainEntitySubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
    }, protected, getRuleProvider(), IRuleProvider, {
        return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass_1.DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
});
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.ShouldBeEmpty();
});
;
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
            .withEndDomainEntity()
            .withStartDomainEntitySubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringProperty("Property2", "because a property is required", true, false, 100)
            .withEndDomainEntitySubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass_1.DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.ShouldBeEmpty();
});
;
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
            .withStartDomainEntitySubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringIdentityRename("Property3", "Property1", "because a property is required", 100)
            .withStringIdentityRename("Property4", "Property2", "because a property is required", 100)
            .withEndDomainEntitySubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce() }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.ShouldNotBeEmpty();
});
it('should_have_validation_failure_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldEqual("Domain Entity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename columns Property1, Property2.  Only one identity rename is allowed for a given Domain Entity.");
});
;
describe('When_domain_entity_subclass_renames_base_identity_that_does_not_exist', () => {
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
            .withStartDomainEntitySubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
            .withEndDomainEntitySubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass_1.DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.ShouldNotBeEmpty();
});
it('should_have_validation_failure_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldEqual("DomainEntity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename Property3 which is not part of the identity.");
});
;
describe('When_domain_entity_subclass_renames_base_property_that_is_not_identity', () => {
    let entityName = "SubclassIdentifier";
    const baseName = "BaseDomainEntityIdentifier";
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
    before(() => {
        let metaEdText = MetaEdTextBuilder_1.default.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity(baseName)
            .withDocumentation("because documentation is required")
            .withStringIdentity("Property1", "because a property is required", 100)
            .withStringProperty("Property3", "foo", true, false, 100)
            .withEndDomainEntity()
            .withStartDomainEntitySubclass(entityName, baseName)
            .withDocumentation("because documentation is required")
            .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
            .withEndDomainEntitySubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass_1.DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.ShouldNotBeEmpty();
});
it('should_have_validation_failure_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldEqual("DomainEntity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename Property3 which is not part of the identity.");
});
;
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
}, protected, getRuleProvider(), IRuleProvider, {
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass_1.DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }) });
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.ShouldBeEmpty();
});
;
;
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests.js.map