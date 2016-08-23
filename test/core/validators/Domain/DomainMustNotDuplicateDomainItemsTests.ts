module MetaEd.Tests.Validator.Domain {
    export class DomainMustNotDuplicateDomainItemsTests {

    }
    export module DomainMustNotDuplicateDomainItemsTests {
        /*[TestFixture]*/
        export class When_domain_items_have_different_names extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain("Domain1").WithDocumentation("doc").WithDomainItem("Item1").WithDomainItem("Item2").WithEndDomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainContext>(), { SuppliedRule: new DomainMustNotDuplicateDomainItems() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainMustNotDuplicateDomainItemsTests {
        /*[TestFixture]*/
        export class When_domain_items_have_duplicate_names extends ValidationRuleTestBase {
            protected static _entityName: string = "Domain1";
            protected static _duplicateTemplate: string = "Item1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_domain_items_have_duplicate_names._entityName).WithDocumentation("doc").WithDomainItem(When_domain_items_have_duplicate_names._duplicateTemplate).WithDomainItem(When_domain_items_have_duplicate_names._duplicateTemplate).WithEndDomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainContext>(), { SuppliedRule: new DomainMustNotDuplicateDomainItems() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_duplicate_names._entityName);
                _errorMessageCollection[0].Message.ShouldContain("duplicate domain item");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_duplicate_names._duplicateTemplate);
            }
        }
    }
    export module DomainMustNotDuplicateDomainItemsTests {
        /*[TestFixture]*/
        export class When_domain_items_have_multiple_duplicate_names extends ValidationRuleTestBase {
            protected static _entityName: string = "Domain1";
            protected static _duplicateTemplate1: string = "Item1";
            protected static _duplicateTemplate2: string = "Item2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_domain_items_have_multiple_duplicate_names._entityName).WithDocumentation("doc").WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2).WithDomainItem(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2).WithEndDomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainContext>(), { SuppliedRule: new DomainMustNotDuplicateDomainItems() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._entityName);
                _errorMessageCollection[0].Message.ShouldContain("duplicate domain items");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._duplicateTemplate1);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_items_have_multiple_duplicate_names._duplicateTemplate2);
            }
        }
    }
}