module MetaEd.Tests.Validator.StringProperty {
    export class StringPropertyMustNotMatchACommonSimpleTypeTests {

    }
    export module StringPropertyMustNotMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_string_property_has_identifier_matching_no_common_simple_types extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_string_property_has_identifier_matching_no_common_simple_types._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithStringProperty(When_string_property_has_identifier_matching_no_common_simple_types._propertyName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMustNotMatchACommonSimpleType(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module StringPropertyMustNotMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_string_property_has_identifier_matching_common_decimal extends ValidationRuleTestBase {
            protected static _commonEntityName: string = "CommonEntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_string_property_has_identifier_matching_common_decimal._commonEntityName).WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithEndCommonDecimal();
                metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithStringProperty(When_string_property_has_identifier_matching_common_decimal._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMustNotMatchACommonSimpleType(_symbolTable) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("String property");
                _errorMessageCollection[0].Message.ShouldContain(When_string_property_has_identifier_matching_common_decimal._commonEntityName);
                _errorMessageCollection[0].Message.ShouldContain("has the same name");
            }
        }
    }
    export module StringPropertyMustNotMatchACommonSimpleTypeTests {
        export class When_string_property_has_identifier_matching_common_integer extends ValidationRuleTestBase {
            protected static _commonEntityName: string = "CommonEntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger(When_string_property_has_identifier_matching_common_integer._commonEntityName).WithDocumentation("doc").WithMaxValue(100).WithEndCommonInteger();
                metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithStringProperty(When_string_property_has_identifier_matching_common_integer._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMustNotMatchACommonSimpleType(_symbolTable) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("String property");
                _errorMessageCollection[0].Message.ShouldContain(When_string_property_has_identifier_matching_common_integer._commonEntityName);
                _errorMessageCollection[0].Message.ShouldContain("has the same name");
            }
        }
    }
    export module StringPropertyMustNotMatchACommonSimpleTypeTests {
        export class When_string_property_has_identifier_matching_common_short extends ValidationRuleTestBase {
            protected static _commonEntityName: string = "CommonEntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonShort(When_string_property_has_identifier_matching_common_short._commonEntityName).WithDocumentation("doc").WithMaxValue(100).WithEndCommonShort();
                metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithStringProperty(When_string_property_has_identifier_matching_common_short._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMustNotMatchACommonSimpleType(_symbolTable) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("String property");
                _errorMessageCollection[0].Message.ShouldContain(When_string_property_has_identifier_matching_common_short._commonEntityName);
                _errorMessageCollection[0].Message.ShouldContain("has the same name");
            }
        }
    }
    export module StringPropertyMustNotMatchACommonSimpleTypeTests {
        export class When_string_property_has_identifier_matching_common_string extends ValidationRuleTestBase {
            protected static _commonEntityName: string = "CommonEntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_string_property_has_identifier_matching_common_string._commonEntityName).WithDocumentation("doc").WithMaxLength(100).WithEndCommonString();
                metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithStringProperty(When_string_property_has_identifier_matching_common_string._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMustNotMatchACommonSimpleType(_symbolTable) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("String property");
                _errorMessageCollection[0].Message.ShouldContain(When_string_property_has_identifier_matching_common_string._commonEntityName);
                _errorMessageCollection[0].Message.ShouldContain("has the same name");
            }
        }
    }
}