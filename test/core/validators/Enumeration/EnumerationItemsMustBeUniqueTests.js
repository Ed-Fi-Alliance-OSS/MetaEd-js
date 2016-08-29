"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const EnumerationItemsMustBeUnique_1 = require("../../../../src/core/validators/Enumeration/EnumerationItemsMustBeUnique");
let should = chai.should();
describe('EnumerationItemsMustBeUnique', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new EnumerationItemsMustBeUnique_1.EnumerationItemsMustBeUnique()));
    describe('When_enumeration_items_have_different_short_descriptions', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartEnumeration("Enumeration1")
                .withDocumentation("doc")
                .withEnumerationItem("this is short description 1", "doc1")
                .withEnumerationItem("this is short description 2", "doc2")
                .withEndEnumeration()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_enumeration_items_have_duplicate_short_descriptions', () => {
        let entityName = "Enumeration1";
        const duplicateShortDescription = "this is a duplicate short description";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartEnumeration("Enumeration1")
                .withDocumentation("doc")
                .withEnumerationItem(duplicateShortDescription, "doc1")
                .withEnumerationItem(duplicateShortDescription, "doc2")
                .withEndEnumeration()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("Enumeration 'Enumeration1' declares duplicate item 'this is a duplicate short description'.");
        });
    });
    describe('When_enumeration_items_have_multiple_duplicate_short_descriptions', () => {
        let entityName = "Enumeration1";
        const duplicateShortDescription1 = "this is duplicate short description 1";
        const duplicateShortDescription2 = "this is duplicate short description 2";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartEnumeration("Enumeration1")
                .withDocumentation("doc")
                .withEnumerationItem(duplicateShortDescription1, "doc1")
                .withEnumerationItem(duplicateShortDescription1, "doc1 again")
                .withEnumerationItem(duplicateShortDescription2, "doc2")
                .withEnumerationItem(duplicateShortDescription2, "doc2 again")
                .withEndEnumeration()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("Enumeration 'Enumeration1' declares duplicate items 'this is duplicate short description 1', 'this is duplicate short description 2'.");
        });
    });
});
//# sourceMappingURL=EnumerationItemsMustBeUniqueTests.js.map