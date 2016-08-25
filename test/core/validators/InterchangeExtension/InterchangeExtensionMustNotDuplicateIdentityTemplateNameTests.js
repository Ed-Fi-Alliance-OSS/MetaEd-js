"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const InterchangeExtensionMustNotDuplicateIdentityTemplateName_1 = require("../../../../src/core/validators/InterchangeExtension/InterchangeExtensionMustNotDuplicateIdentityTemplateName");
let should = chai.should();
describe('InterchangeExtensionMustNotDuplicateIdentityTemplateName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new InterchangeExtensionMustNotDuplicateIdentityTemplateName_1.InterchangeExtensionMustNotDuplicateIdentityTemplateName(helper.symbolTable)));
    describe('When_identity_templates_have_different_names', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchangeExtension("Interchange1")
                .withIdentityTemplate("Template1")
                .withIdentityTemplate("Template2")
                .withEndInterchangeExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
    describe('When_identity_templates_have_duplicate_names', () => {
        let entityName = "Interchange1";
        const duplicateTemplate = "Identity1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchangeExtension("Interchange1")
                .withIdentityTemplate(duplicateTemplate)
                .withIdentityTemplate(duplicateTemplate)
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
            helper.errorMessageCollection[0].Message.ShouldContain("duplicate identity template");
            helper.errorMessageCollection[0].Message.ShouldContain(duplicateTemplate);
        });
    });
});
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests.js.map