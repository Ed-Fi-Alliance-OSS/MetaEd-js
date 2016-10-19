"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const InterchangeMustNotDuplicateIdentityTemplateName_1 = require("../../../../src/core/validators/Interchange/InterchangeMustNotDuplicateIdentityTemplateName");
let should = chai.should();
describe('ReplaceMeWithFileName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new InterchangeMustNotDuplicateIdentityTemplateName_1.InterchangeMustNotDuplicateIdentityTemplateName(helper.symbolTable)));
    describe('When_identity_templates_have_different_names', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchange("Interchange1")
                .withDocumentation("doc")
                .withElement("Required")
                .withIdentityTemplate("Template1")
                .withIdentityTemplate("Template2")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_identity_templates_have_duplicate_names', () => {
        let entityName = "Interchange1";
        const duplicateTemplate = "Identity1";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInterchange("Interchange1")
                .withDocumentation("doc")
                .withElement("Required")
                .withIdentityTemplate(duplicateTemplate)
                .withIdentityTemplate(duplicateTemplate)
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
            helper.errorMessageCollection[0].Message.ShouldContain("duplicate identity template");
            helper.errorMessageCollection[0].Message.ShouldContain(duplicateTemplate);
        });
    });
});
//# sourceMappingURL=InterchangeMustNotDuplicateIdentityTemplateNameTests.js.map