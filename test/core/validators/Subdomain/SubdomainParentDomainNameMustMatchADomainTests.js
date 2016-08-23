var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class SubdomainParentDomainNameMustMatchADomainTests {
                }
                DomainEntitySubclass.SubdomainParentDomainNameMustMatchADomainTests = SubdomainParentDomainNameMustMatchADomainTests;
                (function (SubdomainParentDomainNameMustMatchADomainTests) {
                    /*[TestFixture]*/
                    class When_subdomain_has_valid_parent_domain_name extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_subdomain_has_valid_parent_domain_name._entityName).WithDocumentation("doc").WithDomainItem("DomainEntity").WithEndDomain();
                            metaEdTextBuilder.WithStartSubdomain("NewSubclassName", When_subdomain_has_valid_parent_domain_name._entityName).WithDocumentation("doc").WithDomainItem("DomainEntity").WithEndSubdomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SubdomainParentDomainNameMustMatchADomain(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_subdomain_has_valid_parent_domain_name._entityName = "MyIdentifier";
                    SubdomainParentDomainNameMustMatchADomainTests.When_subdomain_has_valid_parent_domain_name = When_subdomain_has_valid_parent_domain_name;
                })(SubdomainParentDomainNameMustMatchADomainTests = DomainEntitySubclass.SubdomainParentDomainNameMustMatchADomainTests || (DomainEntitySubclass.SubdomainParentDomainNameMustMatchADomainTests = {}));
                (function (SubdomainParentDomainNameMustMatchADomainTests) {
                    /*[TestFixture]*/
                    class When_subdomain_has_invalid_parent_domain_name extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartSubdomain(When_subdomain_has_invalid_parent_domain_name._entityName, When_subdomain_has_invalid_parent_domain_name._baseName).WithDocumentation("doc").WithDomainItem("DomainEntity").WithEndSubdomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SubdomainParentDomainNameMustMatchADomain(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Subdomain");
                            _errorMessageCollection[0].Message.ShouldContain(When_subdomain_has_invalid_parent_domain_name._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("is part of");
                            _errorMessageCollection[0].Message.ShouldContain(When_subdomain_has_invalid_parent_domain_name._baseName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_subdomain_has_invalid_parent_domain_name._entityName = "MyIdentifier";
                    When_subdomain_has_invalid_parent_domain_name._baseName = "NotAnDomainEntityIdentifier";
                    SubdomainParentDomainNameMustMatchADomainTests.When_subdomain_has_invalid_parent_domain_name = When_subdomain_has_invalid_parent_domain_name;
                })(SubdomainParentDomainNameMustMatchADomainTests = DomainEntitySubclass.SubdomainParentDomainNameMustMatchADomainTests || (DomainEntitySubclass.SubdomainParentDomainNameMustMatchADomainTests = {}));
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SubdomainParentDomainNameMustMatchADomainTests.js.map