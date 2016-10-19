import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {InterchangeExtensionMustNotDuplicateIdentityTemplateName}from "../../../../src/core/validators/InterchangeExtension/InterchangeExtensionMustNotDuplicateIdentityTemplateName"

let should = chai.should();

describe('InterchangeExtensionMustNotDuplicateIdentityTemplateName', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.InterchangeExtensionContext>(
            new InterchangeExtensionMustNotDuplicateIdentityTemplateName(helper.symbolTable)));


    describe('When_identity_templates_have_different_names', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartInterchangeExtension("Interchange1")
                .withIdentityTemplate("Template1")
                .withIdentityTemplate("Template2")
                .withEndInterchangeExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_identity_templates_have_duplicate_names', () => {
        let entityName: string = "Interchange1";
        const duplicateTemplate: string = "Identity1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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