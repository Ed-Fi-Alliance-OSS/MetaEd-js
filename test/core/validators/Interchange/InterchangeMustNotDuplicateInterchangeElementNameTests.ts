/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {InterchangeMustNotDuplicateInterchangeElementName}from "../../../../src/core/validators/Interchange/InterchangeMustNotDuplicateInterchangeElementName"

let should = chai.should();

describe('InterchangeMustNotDuplicateInterchangeElementName', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.InterchangeContext>(
            new InterchangeMustNotDuplicateInterchangeElementName()));


    describe('When_elements_have_different_names', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
        let entityName: string = "Interchange1";
        const duplicateTemplate: string = "Identity1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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