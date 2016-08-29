"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const InterchangeMustNotDuplicateInterchangeElementName_1 = require("../../../../src/core/validators/Interchange/InterchangeMustNotDuplicateInterchangeElementName");
let should = chai.should();
describe('InterchangeMustNotDuplicateInterchangeElementName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new InterchangeMustNotDuplicateInterchangeElementName_1.InterchangeMustNotDuplicateInterchangeElementName()));
    describe('When_elements_have_different_names', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchange("Interchange1")
                .withDocumentation("doc")
                .withElement("Template1")
                .withElement("Template2")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_elements_have_duplicate_names', () => {
        let entityName = "Interchange1";
        const duplicateTemplate = "Identity1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchange("Interchange1")
                .withDocumentation("doc")
                .withElement(duplicateTemplate)
                .withElement(duplicateTemplate)
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Interchange");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("duplicate interchange element");
            helper.errorMessageCollection[0].Message.ShouldContain(duplicateTemplate);
        });
    });
});
//# sourceMappingURL=InterchangeMustNotDuplicateInterchangeElementNameTests.js.map