module MetaEd.Tests.Validator.IncludeProperty {
    export class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtensionTests {

    }
    export module IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtensionTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_of_non_common_type_extension extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_of_non_common_type_extension._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_extension_override_of_non_common_type_extension._entityName).WithDocumentation("doc").WithBooleanProperty("DummyProperty2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartDomainEntityExtension(When_include_property_has_extension_override_of_non_common_type_extension._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_of_non_common_type_extension._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("include extension");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_of_non_common_type_extension._propertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_of_non_common_type_extension._entityName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtensionTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_of_common_type_extension extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_of_common_type_extension._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartCommonTypeExtension(When_include_property_has_extension_override_of_common_type_extension._commonTypeName).WithBooleanProperty("DummyProperty3", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_extension_override_of_common_type_extension._entityName).WithDocumentation("doc").WithBooleanProperty("DummyProperty2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartDomainEntityExtension(When_include_property_has_extension_override_of_common_type_extension._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_of_common_type_extension._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension(_symbolTable) });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeFalse();
            }
        }
    }
}