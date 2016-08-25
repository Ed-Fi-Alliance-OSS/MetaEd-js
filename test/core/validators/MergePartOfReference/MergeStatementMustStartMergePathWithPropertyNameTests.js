"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
let should = chai.should();
describe('MergeStatementMustStartMergePathWithPropertyName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new MergeStatementMustStartMergePathWithPropertyName()));
    describe('When_reference_property_has_merge_statement_with_correct_path', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity2")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withMergePartOfReference(entityName + ".Property", "AnotherProperty")
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_reference_property_has_merge_statement_with_incorrect_path', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity2")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withMergePartOfReference("DifferentEntity.Property", "AnotherProperty")
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(1);
            helper.errorMessageCollection[0].Message.ShouldEqual("Merge statement must start first property path with the referenced entity name of the current property.");
        });
    });
});
//# sourceMappingURL=MergeStatementMustStartMergePathWithPropertyNameTests.js.map