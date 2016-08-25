"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const FirstDomainEntityPropertyMustNotCollideWithOtherProperty_1 = require("../../../../src/core/validators/Association/FirstDomainEntityPropertyMustNotCollideWithOtherProperty");
let should = chai.should();
describe('FirstDomainEntityPropertyMustNotCollideWithOtherProperty', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new FirstDomainEntityPropertyMustNotCollideWithOtherProperty_1.FirstDomainEntityPropertyMustNotCollideWithOtherProperty(symbolTable)));
    describe('When_domain_entity_property_does_not_collide', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withIntegerProperty("Third", "doc3", false, false)
                .withEndAssociation()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_domain_entity_property_does_collide', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()
                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withIntegerProperty("First", "doc3", false, false)
                .withEndAssociation()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(1);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldEqual("Entity Association1 has duplicate properties named First");
        });
    });
});
//# sourceMappingURL=FirstDomainEntityPropertyMustNotCollideWithOtherPropertyTests.js.map