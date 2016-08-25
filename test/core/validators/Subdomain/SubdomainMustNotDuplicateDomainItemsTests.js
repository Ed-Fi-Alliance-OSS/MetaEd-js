"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const SubdomainMustNotDuplicateDomainItems_1 = require("../../../../src/core/validators/Subdomain/SubdomainMustNotDuplicateDomainItems");
let should = chai.should();
describe('SubdomainMustNotDuplicateDomainItems', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new SubdomainMustNotDuplicateDomainItems_1.SubdomainMustNotDuplicateDomainItems()));
    describe('When_domain_items_have_different_names', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartSubdomain("Subdomain1", "Domain1")
                .withDocumentation("doc")
                .withDomainItem("Item1")
                .withDomainItem("Item2")
                .withEndSubdomain()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_domain_items_have_duplicate_names', () => {
        const parentDomainName = "Domain1";
        let entityName = "Subdomain1";
        const duplicateTemplate = "Item1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartSubdomain(entityName, parentDomainName)
                .withDocumentation("doc")
                .withDomainItem(duplicateTemplate)
                .withDomainItem(duplicateTemplate)
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
            helper.errorMessageCollection[0].Message.ShouldContain("duplicate domain item");
            helper.errorMessageCollection[0].Message.ShouldContain(duplicateTemplate);
        });
    });
    describe('When_domain_items_have_multiple_duplicate_names', () => {
        const parentDomainName = "Domain1";
        let entityName = "Domain1";
        const duplicateTemplate1 = "Item1";
        const duplicateTemplate2 = "Item2";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Subdomain");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("duplicate domain items");
            helper.errorMessageCollection[0].Message.ShouldContain(duplicateTemplate1);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicateTemplate2);
        });
    });
});
//# sourceMappingURL=SubdomainMustNotDuplicateDomainItemsTests.js.map