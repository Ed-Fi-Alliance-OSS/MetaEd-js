var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Domain;
            (function (Domain) {
                class DomainMustNotDuplicateDomainItemsTests {
                }
                Domain.DomainMustNotDuplicateDomainItemsTests = DomainMustNotDuplicateDomainItemsTests;
                (function (DomainMustNotDuplicateDomainItemsTests) {
                    /*[TestFixture]*/
                    class When_domain_items_have_different_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain("Domain1").WithDocumentation("doc").WithDomainItem("Item1").WithDomainItem("Item2").WithEndDomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainMustNotDuplicateDomainItems() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    DomainMustNotDuplicateDomainItemsTests.When_domain_items_have_different_names = When_domain_items_have_different_names;
                })(DomainMustNotDuplicateDomainItemsTests = Domain.DomainMustNotDuplicateDomainItemsTests || (Domain.DomainMustNotDuplicateDomainItemsTests = {}));
                (function (DomainMustNotDuplicateDomainItemsTests) {
                    /*[TestFixture]*/
                    class When_domain_items_have_duplicate_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_domain_items_have_duplicate_names._entityName).WithDocumentation("doc").WithDomainItem(When_domain_items_have_duplicate_names._duplicateTemplate).WithDomainItem(When_domain_items_have_duplicate_names._duplicateTemplate).WithEndDomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainMustNotDuplicateDomainItems() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Domain");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_duplicate_names._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate domain item");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_duplicate_names._duplicateTemplate);
                        }
                    }
                    When_domain_items_have_duplicate_names._entityName = "Domain1";
                    When_domain_items_have_duplicate_names._duplicateTemplate = "Item1";
                    DomainMustNotDuplicateDomainItemsTests.When_domain_items_have_duplicate_names = When_domain_items_have_duplicate_names;
                })(DomainMustNotDuplicateDomainItemsTests = Domain.DomainMustNotDuplicateDomainItemsTests || (Domain.DomainMustNotDuplicateDomainItemsTests = {}));
                (function (DomainMustNotDuplicateDomainItemsTests) {
                    /*[TestFixture]*/
                    class When_domain_items_have_multiple_duplicate_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_domain_items_have_multiple_duplicate_names._entityName).WithDocumentation("doc").WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2).WithEndDomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainMustNotDuplicateDomainItems() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Domain");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate domain items");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1);
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2);
                        }
                    }
                    When_domain_items_have_multiple_duplicate_names._entityName = "Domain1";
                    When_domain_items_have_multiple_duplicate_names._duplicateTemplate1 = "Item1";
                    When_domain_items_have_multiple_duplicate_names._duplicateTemplate2 = "Item2";
                    DomainMustNotDuplicateDomainItemsTests.When_domain_items_have_multiple_duplicate_names = When_domain_items_have_multiple_duplicate_names;
                })(DomainMustNotDuplicateDomainItemsTests = Domain.DomainMustNotDuplicateDomainItemsTests || (Domain.DomainMustNotDuplicateDomainItemsTests = {}));
            })(Domain = Validator.Domain || (Validator.Domain = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainMustNotDuplicateDomainItemsTests.js.map