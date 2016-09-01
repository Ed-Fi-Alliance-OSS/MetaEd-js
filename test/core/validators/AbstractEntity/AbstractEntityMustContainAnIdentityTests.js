"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const chai = require('chai');
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const ValidatorTestHelper_1 = require("./../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const AbstractEntityMustContainAnIdentity_1 = require("../../../../src/core/validators/AbstractEntity/AbstractEntityMustContainAnIdentity");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
let should = chai.should();
describe('AbstractEntityMustContainAnIdentityTests', () => {
    describe('When_validating_abstract_entity_with_identity_fields', () => {
        const entityName = "EntityName";
        let helper;
        before(() => {
            const metaEdTextBuilder = new MetaEdTextBuilder_1.default();
            const metaEdText = metaEdTextBuilder
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("Property", "doc", 100)
                .withEndAbstractEntity()
                .withEndNamespace()
                .toString();
            helper = new ValidatorTestHelper_1.default();
            helper.setup(metaEdText, new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_abstractEntity, new AbstractEntityMustContainAnIdentity_1.AbstractEntityMustContainAnIdentity())));
        });
        it('Should_have_no_validation_failures', () => {
            helper.errorMessageCollection.length.should.equal(0);
            helper.warningMessageCollection.length.should.equal(0);
        });
    });
    describe('When_validating_abstract_entity_with_no_identity_fields', () => {
        const entityName = "EntityName";
        let helper;
        before(() => {
            const metaEdTextBuilder = new MetaEdTextBuilder_1.default();
            const metaEdText = metaEdTextBuilder
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withDateProperty("Property", "doc", true, false)
                .withEndAbstractEntity()
                .withEndNamespace()
                .toString();
            helper = new ValidatorTestHelper_1.default();
            helper.setup(metaEdText, new ValidatorListener_1.default(new TestRuleProvider_1.default(MetaEdGrammar.RULE_abstractEntity, new AbstractEntityMustContainAnIdentity_1.AbstractEntityMustContainAnIdentity())));
        });
        it('Should_have_validation_failure', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('Should_have_validation_failure_message', () => {
            const failure = helper.errorMessageCollection[0];
            failure.message.should.include("Abstract Entity");
            failure.message.should.include(entityName);
            failure.message.should.include("does not have an identity");
        });
    });
});
//# sourceMappingURL=AbstractEntityMustContainAnIdentityTests.js.map