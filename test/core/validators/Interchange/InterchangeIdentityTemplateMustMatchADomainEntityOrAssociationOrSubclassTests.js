"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass_1 = require("../../../../src/core/validators/Interchange/InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass");
let should = chai.should();
describe('InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass_1.InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(helper.symbolTable)));
    describe('When_identity_template_is_domain_entity', () => {
        let entityName = "EntityName";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_identity_template_is_domain_entity_subclass', () => {
        let entityName = "EntityName";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
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
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_identity_template_is_association', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_identity_template_is_association_subclass', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
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
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_identity_template_is_abstract_entity', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("Property1", "doc", 100)
                .withEndAbstractEntity()
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_identity_template_has_invalid_identifier', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("identity template");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});
//# sourceMappingURL=InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclassTests.js.map