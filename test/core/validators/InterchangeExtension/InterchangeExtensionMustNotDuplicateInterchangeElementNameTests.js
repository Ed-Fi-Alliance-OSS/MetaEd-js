"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const InterchangeExtensionMustNotDuplicateInterchangeElementName_1 = require("../../../../src/core/validators/InterchangeExtension/InterchangeExtensionMustNotDuplicateInterchangeElementName");
let should = chai.should();
describe('InterchangeExtensionMustNotDuplicateInterchangeElementName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new InterchangeExtensionMustNotDuplicateInterchangeElementName_1.InterchangeExtensionMustNotDuplicateInterchangeElementName(helper.symbolTable)));
    describe('When_elements_have_different_names', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchangeExtension("Interchange1")
                .withElement("Template1")
                .withElement("Template2")
                .withEndInterchangeExtension()
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
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchangeExtension("Interchange1")
                .withElement(duplicateTemplate)
                .withElement(duplicateTemplate)
                .withEndInterchangeExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Interchange additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("duplicate interchange element");
            helper.errorMessageCollection[0].Message.ShouldContain(duplicateTemplate);
        });
    });
});
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateInterchangeElementNameTests.js.map