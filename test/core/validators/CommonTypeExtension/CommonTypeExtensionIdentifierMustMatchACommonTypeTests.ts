module MetaEd.Tests.Validator.CommonTypeExtension {
    export class CommonTypeExtensionIdentifierMustMatchACommonTypeTests {

    }
    export module CommonTypeExtensionIdentifierMustMatchACommonTypeTests {
        /*[TestFixture]*/
        export class When_common_type_extension_has_valid_extendee extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_common_type_extension_has_valid_extendee._entity_name).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartCommonTypeExtension(When_common_type_extension_has_valid_extendee._entity_name).WithBooleanProperty("Property2", "doc", true, false).WithEndCommonTypeExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonTypeExtensionContext>(), { SuppliedRule: new CommonTypeExtensionIdentifierMustMatchACommonType(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonTypeExtensionIdentifierMustMatchACommonTypeTests {
        /*[TestFixture]*/
        export class When_common_type_extension_has_invalid_extendee extends ValidationRuleTestBase {
            protected static _entity_name: string = "NotACommonTypeIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonTypeExtension(When_common_type_extension_has_invalid_extendee._entity_name).WithBooleanProperty("Property2", "doc", false, false).WithEndCommonTypeExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonTypeExtensionContext>(), { SuppliedRule: new CommonTypeExtensionIdentifierMustMatchACommonType(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Common Type additions");
                _errorMessageCollection[0].Message.ShouldContain(When_common_type_extension_has_invalid_extendee._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}