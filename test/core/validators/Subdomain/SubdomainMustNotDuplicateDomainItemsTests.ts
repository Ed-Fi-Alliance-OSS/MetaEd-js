import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {SubdomainMustNotDuplicateDomainItems}from "../../../../src/core/validators/Subdomain/SubdomainMustNotDuplicateDomainItems"

let should = chai.should();

describe('SubdomainMustNotDuplicateDomainItems', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.SubdomainContext>(
            new SubdomainMustNotDuplicateDomainItems()));


    describe('When_domain_items_have_different_names', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartSubdomain("Subdomain1", "Domain1")
                .withDocumentation("doc")
                .withDomainItem("Item1")
                .withDomainItem("Item2")
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_items_have_duplicate_names', () => {
        const parentDomainName: string = "Domain1";
        let entityName: string = "Subdomain1";
        const duplicateTemplate: string = "Item1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartSubdomain(entityName, parentDomainName)
                .withDocumentation("doc")
                .withDomainItem(duplicateTemplate)
                .withDomainItem(duplicateTemplate)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Subdomain");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("duplicate domain item");
            helper.errorMessageCollection[0].message.should.include(duplicateTemplate);
        });
    });


    describe('When_domain_items_have_multiple_duplicate_names', () => {
        const parentDomainName: string = "Domain1";
        let entityName: string = "Domain1";
        const duplicateTemplate1: string = "Item1";
        const duplicateTemplate2: string = "Item2";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartSubdomain(entityName, parentDomainName)
                .withDocumentation("doc")
                .withDomainItem(duplicateTemplate1)
                .withDomainItem(duplicateTemplate1)
                .withDomainItem(duplicateTemplate1)
                .withDomainItem(duplicateTemplate1)
                .withDomainItem(duplicateTemplate2)
                .withDomainItem(duplicateTemplate2)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Subdomain");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("duplicate domain items");
            helper.errorMessageCollection[0].message.should.include(duplicateTemplate1);
            helper.errorMessageCollection[0].message.should.include(duplicateTemplate2);
        });
    });
});