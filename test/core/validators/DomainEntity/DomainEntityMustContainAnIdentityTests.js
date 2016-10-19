"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DomainEntityMustContainAnIdentity_1 = require("../../../../src/core/validators/DomainEntity/DomainEntityMustContainAnIdentity");
let should = chai.should();
describe('DomainEntityMustContainAnIdentityTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DomainEntityMustContainAnIdentity_1.DomainEntityMustContainAnIdentity()));
    describe('When_validating_domain_entity_with_identity_fields', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity1")
                .withDocumentation("doc1")
                .withStringIdentity("Property1", "doc2", 100)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_domain_entity_with_no_identity_fields', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc1")
                .withDateProperty("Property1", "doc2", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not have an identity");
        });
    });
});
//# sourceMappingURL=DomainEntityMustContainAnIdentityTests.js.map