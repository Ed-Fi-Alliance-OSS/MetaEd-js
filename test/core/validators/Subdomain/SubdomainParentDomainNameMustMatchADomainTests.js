"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const SubdomainParentDomainNameMustMatchADomain_1 = require("../../../../src/core/validators/Subdomain/SubdomainParentDomainNameMustMatchADomain");
let should = chai.should();
describe('SubdomainParentDomainNameMustMatchADomain', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new SubdomainParentDomainNameMustMatchADomain_1.SubdomainParentDomainNameMustMatchADomain(helper.symbolTable)));
    describe('When_subdomain_has_valid_parent_domain_name', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let entityName = "MyIdentifier";
        const baseName = "NotAnDomainEntityIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartSubdomain(entityName, baseName)
                .withDocumentation("doc")
                .withDomainItem("DomainEntity")
                .withEndSubdomain()
                .withEndNamespace().toString();
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
//# sourceMappingURL=SubdomainParentDomainNameMustMatchADomainTests.js.map