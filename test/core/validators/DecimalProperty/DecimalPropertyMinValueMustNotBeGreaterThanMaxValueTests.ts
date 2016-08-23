module MetaEd.Tests.Validator.DecimalProperty {
    export class DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests {

    }
    export module DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_no_min_or_max_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", 10, 2).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_no_min_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", 10, 2, null, 1000).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_no_max_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", 10, 2, 1000).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_correct_min_max_value_order extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var maxValue: number = 100;
                var minValue: number = 50;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", 10, 2, minValue, maxValue).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_min_max_values_out_of_order extends ValidationRuleTestBase {
            private static _entityName: string = "EntityForTest";
            private static _decimalPropertyName: string = "DecimalProperty";
            protected metaEdText(): string {
                var maxValue: number = 50;
                var minValue: number = 100;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_decimal_property_with_min_max_values_out_of_order._entityName).WithDocumentation("doc").WithDecimalIdentity(When_validating_decimal_property_with_min_max_values_out_of_order._decimalPropertyName, "doc2", 10, 2, minValue, maxValue).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Decimal Property");
                _errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_decimal_property_with_min_max_values_out_of_order._decimalPropertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_validating_decimal_property_with_min_max_values_out_of_order._entityName);
                _errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
            }
        }
    }
    export module DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_same_min_max_values extends ValidationRuleTestBase {
            private static _entityName: string = "EntityForTest";
            private static _decimalPropertyName: string = "DecimalProperty";
            protected metaEdText(): string {
                var maxValue: number = 100;
                var minValue: number = 100;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_decimal_property_with_same_min_max_values._entityName).WithDocumentation("doc").WithDecimalIdentity(When_validating_decimal_property_with_same_min_max_values._decimalPropertyName, "doc2", minValue, maxValue).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}