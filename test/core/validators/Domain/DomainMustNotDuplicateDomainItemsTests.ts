import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {DomainMustNotDuplicateDomainItems}from "../../../../src/core/validators/Domain/DomainMustNotDuplicateDomainItems"

let should = chai.should();

describe('DomainMustNotDuplicateDomainItemsTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainContext>(
            new DomainMustNotDuplicateDomainItems()));


    describe('When_domain_items_have_different_names', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomain("Domain1")
                .withDocumentation("doc")
                .withDomainItem("Item1")
                .withDomainItem("Item2")
                .withEndDomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_items_have_duplicate_names', () => {
        let entityName: string = "Domain1";
        const duplicateTemplate: string = "Item1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomain(entityName)
                .withDocumentation("doc")
                .withDomainItem(duplicateTemplate)
                .withDomainItem(duplicateTemplate)
                .withEndDomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Domain");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("duplicate domain item");
            helper.errorMessageCollection[0].message.should.include(duplicateTemplate);
        });
    });


    describe('When_domain_items_have_multiple_duplicate_names', () => {
        let entityName: string = "Domain1";
        const duplicateTemplate1: string = "Item1";
        const duplicateTemplate2: string = "Item2";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomain(entityName)
                .withDocumentation("doc")
                .withDomainItem(duplicateTemplate1)
                .withDomainItem(duplicateTemplate1)
                .withDomainItem(duplicateTemplate1)
                .withDomainItem(duplicateTemplate1)
                .withDomainItem(duplicateTemplate2)
                .withDomainItem(duplicateTemplate2)
                .withEndDomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Domain");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("duplicate domain items");
            helper.errorMessageCollection[0].message.should.include(duplicateTemplate1);
            helper.errorMessageCollection[0].message.should.include(duplicateTemplate2);
        });
    });
});