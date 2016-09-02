"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DescriptorMapTypeItemsMustBeUnique_1 = require("../../../../src/core/validators/Descriptor/DescriptorMapTypeItemsMustBeUnique");
let should = chai.should();
describe('DescriptorMapTypeItemsMustBeUniqueTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DescriptorMapTypeItemsMustBeUnique_1.DescriptorMapTypeItemsMustBeUnique()));
    describe('When_map_type_items_have_different_short_descriptions', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDescriptor("Descriptor1")
                .withDocumentation("doc")
                .withStartMapType()
                .withDocumentation("map type doc")
                .withEnumerationItem("this is short description 1", "doc1")
                .withEnumerationItem("this is short description 2", "doc2")
                .withEndMapType()
                .withEndDescriptor()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_map_type_items_have_duplicate_short_descriptions', () => {
        let entityName = "Descriptor1";
        const duplicateShortDescription = "this is a duplicate short description";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDescriptor(entityName)
                .withDocumentation("doc")
                .withStartMapType()
                .withDocumentation("map type doc")
                .withEnumerationItem(duplicateShortDescription, "doc1")
                .withEnumerationItem(duplicateShortDescription, "doc2")
                .withEndMapType()
                .withEndDescriptor()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("Descriptor 'Descriptor1' declares duplicate item 'this is a duplicate short description'.");
        });
    });
    describe('When_map_type_items_have_multiple_duplicate_short_descriptions', () => {
        let entityName = "Descriptor1";
        const duplicateShortDescription1 = "this is duplicate short description 1";
        const duplicateShortDescription2 = "this is duplicate short description 2";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDescriptor(entityName)
                .withDocumentation("doc")
                .withStartMapType()
                .withDocumentation("map type doc")
                .withEnumerationItem(duplicateShortDescription1, "doc1")
                .withEnumerationItem(duplicateShortDescription1, "doc1 again")
                .withEnumerationItem(duplicateShortDescription2, "doc2")
                .withEnumerationItem(duplicateShortDescription2, "doc2 again")
                .withEndMapType()
                .withEndDescriptor()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("Descriptor 'Descriptor1' declares duplicate items 'this is duplicate short description 1', 'this is duplicate short description 2'.");
        });
    });
});
//# sourceMappingURL=DescriptorMapTypeItemsMustBeUniqueTests.js.map