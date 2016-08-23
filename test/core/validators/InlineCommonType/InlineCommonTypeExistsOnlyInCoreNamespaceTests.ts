module MetaEd.Tests.Validator.InlineCommonType {
    export class InlineCommonTypeExistsOnlyInCoreNamespaceTests {

    }
    export module InlineCommonTypeExistsOnlyInCoreNamespaceTests {
        /*[TestFixture]*/
        export class When_inline_common_type_exists_in_core extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInlineCommonType(When_inline_common_type_exists_in_core._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndInlineCommonType().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InlineCommonTypeContext>(), { SuppliedRule: new InlineCommonTypeExistsOnlyInCoreNamespace() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InlineCommonTypeExistsOnlyInCoreNamespaceTests {
        /*[TestFixture]*/
        export class When_inline_common_type_exists_in_extension extends ValidationRuleTestBase {
            protected static _extensionNamespace: string = "edfi";
            protected static _entity_name: string = "MyIdentifier";
            protected static _property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace(When_inline_common_type_exists_in_extension._extensionNamespace, "projectExtension").WithStartInlineCommonType(When_inline_common_type_exists_in_extension._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property2", "because a property is required", true, false).WithEndInlineCommonType().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InlineCommonTypeContext>(), { SuppliedRule: new InlineCommonTypeExistsOnlyInCoreNamespace() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Inline Common Type");
                _errorMessageCollection[0].Message.ShouldContain(When_inline_common_type_exists_in_extension._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("is not valid in extension namespace");
                _errorMessageCollection[0].Message.ShouldContain(When_inline_common_type_exists_in_extension._extensionNamespace);
            }
        }
    }
}