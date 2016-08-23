module MetaEd.Tests.Validator.IncludeProperty {
    export class IncludePropertyMustNotContainIdentityTests {

    }
    export module IncludePropertyMustNotContainIdentityTests {
        /*[TestFixture]*/
        export class When_include_property_has_primary_key extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_primary_key._commonTypeName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_primary_key._entityName).WithDocumentation("doc").WithIdentityProperty("include", When_include_property_has_primary_key._propertyName, "doc").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyMustNotContainIdentity() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Include");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_primary_key._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
}