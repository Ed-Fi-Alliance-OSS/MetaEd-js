/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {SubdomainParentDomainNameMustMatchADomain}from "../../../../src/core/validators/Subdomain/SubdomainParentDomainNameMustMatchADomain"

let should = chai.should();

describe('SubdomainParentDomainNameMustMatchADomain', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.SubdomainContext>(
            new SubdomainParentDomainNameMustMatchADomain(helper.symbolTable)));


    describe('When_subdomain_has_valid_parent_domain_name', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomain(entityName)
                .withDocumentation("doc")
                .withDomainItem("DomainEntity")
                .withEndDomain()
                
.withStartSubdomain("NewSubclassName", entityName)
                .withDocumentation("doc")
                .withDomainItem("DomainEntity")
                .withEndSubdomain()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });


    describe('When_subdomain_has_invalid_parent_domain_name', () => {
        let entityName: string = "MyIdentifier";
        const baseName: string = "NotAnDomainEntityIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartSubdomain(entityName, baseName)
                .withDocumentation("doc")
                .withDomainItem("DomainEntity")
                .withEndSubdomain()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Subdomain");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("is part of");
            helper.errorMessageCollection[0].Message.ShouldContain(baseName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});