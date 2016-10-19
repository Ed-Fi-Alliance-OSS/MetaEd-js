import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {InterchangeExtensionMustNotDuplicateInterchangeElementName}from "../../../../src/core/validators/InterchangeExtension/InterchangeExtensionMustNotDuplicateInterchangeElementName"

let should = chai.should();

describe('InterchangeExtensionMustNotDuplicateInterchangeElementName', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.InterchangeExtensionContext>(
            new InterchangeExtensionMustNotDuplicateInterchangeElementName(helper.symbolTable)));


    describe('When_elements_have_different_names', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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
        let entityName: string = "Interchange1";
        const duplicateTemplate: string = "Identity1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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