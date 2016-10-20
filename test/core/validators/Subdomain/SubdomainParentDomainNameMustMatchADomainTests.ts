import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {SubdomainParentDomainNameMustMatchADomain}from "../../../../src/core/validators/Subdomain/SubdomainParentDomainNameMustMatchADomain"

let should = chai.should();

describe('SubdomainParentDomainNameMustMatchADomain', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.SubdomainContext>(
            new SubdomainParentDomainNameMustMatchADomain(helper.symbolTable)));


    describe('When_subdomain_has_valid_parent_domain_name', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomain(entityName)
                .withDocumentation("doc")
                .withDomainItem("DomainEntity")
                .withEndDomain()
                
.withStartSubdomain("NewSubclassName", entityName)
                .withDocumentation("doc")
                .withDomainItem("DomainEntity")
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_subdomain_has_invalid_parent_domain_name', () => {
        let entityName: string = "MyIdentifier";
        const baseName: string = "NotAnDomainEntityIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartSubdomain(entityName, baseName)
                .withDocumentation("doc")
                .withDomainItem("DomainEntity")
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Subdomain");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("is part of");
            helper.errorMessageCollection[0].message.should.include(baseName);
            helper.errorMessageCollection[0].message.should.include("does not match");
        });
    });
});