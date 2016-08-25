"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity_1 = require("../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity");
let should = chai.should();
describe('DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity_1.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(helper.symbolTable)));
    describe('When_domain_entity_subclass_extends_domain_entity', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass("NewSubclassName", entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_domain_entity_subclass_extends_abstract_entity', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("Property1", "doc", 100)
                .withEndAbstractEntity()
                .withStartDomainEntitySubclass("NewSubclassName", entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_domain_entity_subclass_has_invalid_extendee', () => {
        let entityName = "MyIdentifier";
        const baseName = "NotAnDomainEntityIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntitySubclass(entityName, baseName)
                .withDocumentation("doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.count.should.not.equal(0);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("DomainEntity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("based on");
            helper.errorMessageCollection[0].Message.ShouldContain(baseName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});
//# sourceMappingURL=DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests.js.map