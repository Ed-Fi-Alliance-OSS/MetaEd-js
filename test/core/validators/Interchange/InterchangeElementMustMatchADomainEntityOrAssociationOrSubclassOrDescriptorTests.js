"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass_1 = require("../../../../src/core/validators/Interchange/InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass");
let should = chai.should();
describe('InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass_1.InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(helper.symbolTable)));
    describe('When_element_is_domain_entity', () => {
        let entityName = "EntityName";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withElement(entityName)
                .withEndInterchange()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_element_is_domain_entity_subclass', () => {
        let entityName = "EntityName";
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
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withElement(entityName)
                .withEndInterchange()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_element_is_association', () => {
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
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withElement(entityName)
                .withEndInterchange()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_element_is_association_subclass', () => {
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
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withElement(entityName)
                .withEndInterchange()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_element_is_descriptor', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDescriptor(entityName)
                .withDocumentation("doc")
                .withStartMapType()
                .withDocumentation("map type doc")
                .withEnumerationItem("this is short description 1", "doc1")
                .withEndMapType()
                .withEndDescriptor()
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withElement(entityName)
                .withEndInterchange()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_validate()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
    });
    describe('When_element_has_invalid_identifier', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withElement(entityName)
                .withEndInterchange()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("element");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});
//# sourceMappingURL=InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests.js.map