"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const MustNotDuplicateMetaEdId_1 = require("../../../../src/core/validators/MetaEdId/MustNotDuplicateMetaEdId");
let should = chai.should();
describe('MustNotDuplicateMetaEdId', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new MustNotDuplicateMetaEdId_1.MustNotDuplicateMetaEdId()));
    describe('When_domain_entity_has_valid_metaEdId', () => {
        const metaEdId1 = "100";
        const metaEdId2 = "101";
        const entityName1 = "MyIdentifier1";
        let propertyName1 = "Identifier1";
        const entityName2 = "MyIdentifier2";
        let propertyName2 = "Identifier2";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName1)
                .withMetaEdId(metaEdId1)
                .withDocumentation("doc")
                .withStringIdentity(propertyName1, "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity(entityName2)
                .withMetaEdId(metaEdId2)
                .withDocumentation("doc")
                .withStringIdentity(propertyName2, "doc", 100)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
    describe('When_domain_entity_has_duplicate_metaEdId', () => {
        const metaEdId = "100";
        const entityName1 = "MyIdentifier1";
        let propertyName1 = "Identifier1";
        const entityName2 = "MyIdentifier2";
        let propertyName2 = "Identifier2";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName1)
                .withMetaEdId(metaEdId)
                .withDocumentation("doc")
                .withStringIdentity(propertyName1, "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity(entityName2)
                .withMetaEdId(metaEdId)
                .withDocumentation("doc")
                .withStringIdentity(propertyName2, "doc", 100)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("MetaEdId");
            helper.errorMessageCollection[0].Message.ShouldContain(metaEdId);
            helper.errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
        });
    });
    describe('When_domain_entity_has_duplicate_metaEdId_with_property', () => {
        const metaEdId = "100";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withMetaEdId(metaEdId)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100, null, null, metaEdId)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("MetaEdId");
            helper.errorMessageCollection[0].Message.ShouldContain(metaEdId);
            helper.errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
        });
    });
    describe('When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity', () => {
        const metaEdId = "100";
        const entityName1 = "MyIdentifier1";
        let propertyName1 = "Identifier1";
        const entityName2 = "MyIdentifier2";
        let propertyName2 = "Identifier2";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName1)
                .withMetaEdId(metaEdId)
                .withDocumentation("doc")
                .withStringIdentity(propertyName1, "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity(entityName2)
                .withDocumentation("doc")
                .withStringIdentity(propertyName2, "doc", 100, null, null, metaEdId)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("MetaEdId");
            helper.errorMessageCollection[0].Message.ShouldContain(metaEdId);
            helper.errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
        });
    });
});
//# sourceMappingURL=MustNotDuplicateMetaEdIdTests.js.map