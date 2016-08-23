var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Subdomain;
            (function (Subdomain) {
                class SubdomainMustNotDuplicateDomainItemsTests {
                }
                Subdomain.SubdomainMustNotDuplicateDomainItemsTests = SubdomainMustNotDuplicateDomainItemsTests;
                (function (SubdomainMustNotDuplicateDomainItemsTests) {
                    /*[TestFixture]*/
                    class When_domain_items_have_different_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartSubdomain("Subdomain1", "Domain1").WithDocumentation("doc").WithDomainItem("Item1").WithDomainItem("Item2").WithEndSubdomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SubdomainMustNotDuplicateDomainItems() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    SubdomainMustNotDuplicateDomainItemsTests.When_domain_items_have_different_names = When_domain_items_have_different_names;
                })(SubdomainMustNotDuplicateDomainItemsTests = Subdomain.SubdomainMustNotDuplicateDomainItemsTests || (Subdomain.SubdomainMustNotDuplicateDomainItemsTests = {}));
                (function (SubdomainMustNotDuplicateDomainItemsTests) {
                    /*[TestFixture]*/
                    class When_domain_items_have_duplicate_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartSubdomain(When_domain_items_have_duplicate_names._entityName, When_domain_items_have_duplicate_names._parentDomainName).WithDocumentation("doc").WithDomainItem(When_domain_items_have_duplicate_names._duplicateTemplate).WithDomainItem(When_domain_items_have_duplicate_names._duplicateTemplate).WithEndSubdomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SubdomainMustNotDuplicateDomainItems() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Subdomain");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_duplicate_names._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate domain item");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_duplicate_names._duplicateTemplate);
                        }
                    }
                    When_domain_items_have_duplicate_names._parentDomainName = "Domain1";
                    When_domain_items_have_duplicate_names._entityName = "Subdomain1";
                    When_domain_items_have_duplicate_names._duplicateTemplate = "Item1";
                    SubdomainMustNotDuplicateDomainItemsTests.When_domain_items_have_duplicate_names = When_domain_items_have_duplicate_names;
                })(SubdomainMustNotDuplicateDomainItemsTests = Subdomain.SubdomainMustNotDuplicateDomainItemsTests || (Subdomain.SubdomainMustNotDuplicateDomainItemsTests = {}));
                (function (SubdomainMustNotDuplicateDomainItemsTests) {
                    /*[TestFixture]*/
                    class When_domain_items_have_multiple_duplicate_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartSubdomain(When_domain_items_have_multiple_duplicate_names._entityName, When_domain_items_have_multiple_duplicate_names._parentDomainName).WithDocumentation("doc").WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2).WithEndSubdomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SubdomainMustNotDuplicateDomainItems() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Subdomain");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate domain items");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1);
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2);
                        }
                    }
                    When_domain_items_have_multiple_duplicate_names._parentDomainName = "Domain1";
                    When_domain_items_have_multiple_duplicate_names._entityName = "Domain1";
                    When_domain_items_have_multiple_duplicate_names._duplicateTemplate1 = "Item1";
                    When_domain_items_have_multiple_duplicate_names._duplicateTemplate2 = "Item2";
                    SubdomainMustNotDuplicateDomainItemsTests.When_domain_items_have_multiple_duplicate_names = When_domain_items_have_multiple_duplicate_names;
                })(SubdomainMustNotDuplicateDomainItemsTests = Subdomain.SubdomainMustNotDuplicateDomainItemsTests || (Subdomain.SubdomainMustNotDuplicateDomainItemsTests = {}));
            })(Subdomain = Validator.Subdomain || (Validator.Subdomain = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SubdomainMustNotDuplicateDomainItemsTests.js.map