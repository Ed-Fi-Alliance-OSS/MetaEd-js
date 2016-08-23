module MetaEd.Tests.Validator.DomainEntitySubclass {
    export class SubdomainParentDomainNameMustMatchADomainTests {

    }
    export module SubdomainParentDomainNameMustMatchADomainTests {
        /*[TestFixture]*/
        export class When_subdomain_has_valid_parent_domain_name extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_subdomain_has_valid_parent_domain_name._entityName).WithDocumentation("doc").WithDomainItem("DomainEntity").WithEndDomain();
                metaEdTextBuilder.WithStartSubdomain("NewSubclassName", When_subdomain_has_valid_parent_domain_name._entityName).WithDocumentation("doc").WithDomainItem("DomainEntity").WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SubdomainContext>(), { SuppliedRule: new SubdomainParentDomainNameMustMatchADomain(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module SubdomainParentDomainNameMustMatchADomainTests {
        /*[TestFixture]*/
        export class When_subdomain_has_invalid_parent_domain_name extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _baseName: string = "NotAnDomainEntityIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartSubdomain(When_subdomain_has_invalid_parent_domain_name._entityName, When_subdomain_has_invalid_parent_domain_name._baseName).WithDocumentation("doc").WithDomainItem("DomainEntity").WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SubdomainContext>(), { SuppliedRule: new SubdomainParentDomainNameMustMatchADomain(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Subdomain");
                _errorMessageCollection[0].Message.ShouldContain(When_subdomain_has_invalid_parent_domain_name._entityName);
                _errorMessageCollection[0].Message.ShouldContain("is part of");
                _errorMessageCollection[0].Message.ShouldContain(When_subdomain_has_invalid_parent_domain_name._baseName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}