"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract_1 = require("../../../../src/core/validators/ReferenceProperty/ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract");
let should = chai.should();
describe('ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract_1.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(helper.symbolTable)));
    describe('When_reference_property_has_identifier_of_domain_entity', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity("DomainEntity2")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_reference_property_has_identifier_of_domain_entity_subclass', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntityBase")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass(entityName, "DomainEntityBase")
                .withDocumentation("doc")
                .withDateProperty("BeginDate", "doc", true, false)
                .withEndDomainEntitySubclass()
                .withStartDomainEntity("DomainEntity2")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_reference_property_has_identifier_of_association', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()
                .withStartDomainEntity("DomainEntity3")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_reference_property_has_identifier_of_association_subclass', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation("BaseName")
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndAssociation()
                .withStartAssociationSubclass(entityName, "BaseName")
                .withDocumentation("doc")
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndAssociationSubclass()
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_reference_property_has_identifier_of_abstract_entity', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("Property1", "doc", 100)
                .withEndAbstractEntity()
                .withStartDomainEntity("DomainEntity2")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_reference_property_has_invalid_identifier', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Reference");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});
//# sourceMappingURL=ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests.js.map