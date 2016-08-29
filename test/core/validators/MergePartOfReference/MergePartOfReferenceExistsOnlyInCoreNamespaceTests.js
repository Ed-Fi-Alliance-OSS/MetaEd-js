"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const MergePartOfReferenceExistsOnlyInCoreNamespace_1 = require("../../../../src/core/validators/MergePartOfReference/MergePartOfReferenceExistsOnlyInCoreNamespace");
let should = chai.should();
//TODO: special case?
describe('MergePartOfReferenceExistsOnlyInCoreNamespace', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new MergePartOfReferenceExistsOnlyInCoreNamespace_1.MergePartOfReferenceExistsOnlyInCoreNamespace()));
    describe('When_merge_exists_in_core', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("Entity1")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop1", "doc")
                .withEndDomainEntity()
                .withStartDomainEntity("Entity2")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop1", "doc")
                .withReferenceProperty("Entity1", "doc", false, false)
                .withMergePartOfReference("Entity1.Prop1", "Prop1")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_validate_successfully()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_merged_exists_in_extension', () => {
        const entityName1 = "Entity1";
        const entityName2 = "Entity2";
        const propertyName = "Prop1";
        const extensionNamespace = "extension";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace(extensionNamespace, "EXTENSION")
                .withStartDomainEntity(entityName1)
                .withDocumentation("doc")
                .withDecimalIdentity("Prop1", "doc", "5", "3")
                .withEndDomainEntity()
                .withStartDomainEntity(entityName2)
                .withDocumentation("doc")
                .withIntegerIdentity(propertyName, "doc")
                .withReferenceProperty(entityName1, "doc", false, false)
                .withMergePartOfReference(entityName1 + "." + propertyName, propertyName)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(1);
        });
        it('should_have_meaningful_validation_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("'merge' is invalid for property");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName1);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName2);
            helper.errorMessageCollection[0].Message.ShouldContain(extensionNamespace);
            helper.errorMessageCollection[0].Message.ShouldContain("'merge' is only valid for properties on types in a core namespace.");
        });
    });
});
//# sourceMappingURL=MergePartOfReferenceExistsOnlyInCoreNamespaceTests.js.map