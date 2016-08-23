module MetaEd.Tests.Validator.IncludeProperty {
    export class IncludePropertyMustMatchACommonTypeTests {

    }
    export module IncludePropertyMustMatchACommonTypeTests {
        /*[TestFixture]*/
        export class When_include_property_has_identifier_of_common_type extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_identifier_of_common_type._entityName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIncludeProperty(When_include_property_has_identifier_of_common_type._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyMustMatchACommonType(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module IncludePropertyMustMatchACommonTypeTests {
        /*[TestFixture]*/
        export class When_include_property_has_identifier_of_inline_common_type extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInlineCommonType(When_include_property_has_identifier_of_inline_common_type._entityName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndInlineCommonType();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIncludeProperty(When_include_property_has_identifier_of_inline_common_type._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyMustMatchACommonType(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module IncludePropertyMustMatchACommonTypeTests {
        /*[TestFixture]*/
        export class When_include_property_has_identifier_of_choice_common_type extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartChoiceType(When_include_property_has_identifier_of_choice_common_type._entityName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndChoiceType();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIncludeProperty(When_include_property_has_identifier_of_choice_common_type._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyMustMatchACommonType(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module IncludePropertyMustMatchACommonTypeTests {
        /*[TestFixture]*/
        export class When_include_property_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIncludeProperty(When_include_property_has_invalid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyMustMatchACommonType(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Include");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_invalid_identifier._entityName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}