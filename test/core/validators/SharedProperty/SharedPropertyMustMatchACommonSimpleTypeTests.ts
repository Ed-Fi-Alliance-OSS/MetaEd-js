module MetaEd.Tests.Validator.SharedProperty {
    export class SharedPropertyMustMatchACommonSimpleTypeTests {

    }
    export module SharedPropertyMustMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_shared_property_has_identifier_of_common_simple_decimal extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_shared_property_has_identifier_of_common_simple_decimal._entityName).WithDocumentation("doc").WithTotalDigits("10").WithDecimalPlaces("2").WithEndCommonDecimal();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_property_has_identifier_of_common_simple_decimal._entityName, When_shared_property_has_identifier_of_common_simple_decimal._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SharedDecimalPropertyContext>(), { SuppliedRule: new SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module SharedPropertyMustMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_shared_property_has_identifier_of_common_simple_integer extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger(When_shared_property_has_identifier_of_common_simple_integer._entityName).WithDocumentation("doc").WithMinValue("0").WithMaxValue("1000").WithEndCommonInteger();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_property_has_identifier_of_common_simple_integer._entityName, When_shared_property_has_identifier_of_common_simple_integer._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SharedIntegerPropertyContext>(), { SuppliedRule: new SharedIntegerPropertyTypeMustMatchACommonSimpleInteger(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module SharedPropertyMustMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_shared_property_has_identifier_of_common_simple_short extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonShort(When_shared_property_has_identifier_of_common_simple_short._entityName).WithDocumentation("doc").WithMinValue("0").WithMaxValue("1000").WithEndCommonShort();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_property_has_identifier_of_common_simple_short._entityName, When_shared_property_has_identifier_of_common_simple_short._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SharedShortPropertyContext>(), { SuppliedRule: new SharedShortPropertyTypeMustMatchACommonSimpleShort(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module SharedPropertyMustMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_shared_property_has_identifier_of_common_simple_string extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_shared_property_has_identifier_of_common_simple_string._entityName).WithDocumentation("doc").WithMaxLength("100").WithEndCommonString();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_property_has_identifier_of_common_simple_string._entityName, When_shared_property_has_identifier_of_common_simple_string._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SharedStringPropertyContext>(), { SuppliedRule: new SharedStringPropertyTypeMustMatchACommonSimpleString(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module SharedPropertyMustMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_shared_decimal_property_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "DoesNotExist";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_decimal_property_has_invalid_identifier._entityName, When_shared_decimal_property_has_invalid_identifier._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SharedDecimalPropertyContext>(), { SuppliedRule: new SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Shared property");
                _errorMessageCollection[0].Message.ShouldContain(When_shared_decimal_property_has_invalid_identifier._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
    export module SharedPropertyMustMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_shared_integer_property_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "DoesNotExist";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedIntegerProperty(When_shared_integer_property_has_invalid_identifier._entityName, When_shared_integer_property_has_invalid_identifier._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SharedIntegerPropertyContext>(), { SuppliedRule: new SharedIntegerPropertyTypeMustMatchACommonSimpleInteger(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Shared property");
                _errorMessageCollection[0].Message.ShouldContain(When_shared_integer_property_has_invalid_identifier._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
    export module SharedPropertyMustMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_shared_short_property_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "DoesNotExist";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedShortProperty(When_shared_short_property_has_invalid_identifier._entityName, When_shared_short_property_has_invalid_identifier._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SharedShortPropertyContext>(), { SuppliedRule: new SharedShortPropertyTypeMustMatchACommonSimpleShort(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Shared property");
                _errorMessageCollection[0].Message.ShouldContain(When_shared_short_property_has_invalid_identifier._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
    export module SharedPropertyMustMatchACommonSimpleTypeTests {
        /*[TestFixture]*/
        export class When_shared_string_property_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "DoesNotExist";
            protected static _propertyName: string = "PropertyName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedStringProperty(When_shared_string_property_has_invalid_identifier._entityName, When_shared_string_property_has_invalid_identifier._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.SharedStringPropertyContext>(), { SuppliedRule: new SharedStringPropertyTypeMustMatchACommonSimpleString(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Shared property");
                _errorMessageCollection[0].Message.ShouldContain(When_shared_string_property_has_invalid_identifier._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}