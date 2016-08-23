module MetaEd.Tests.Validator.CommonSimpleType {
    export class CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests {

    }
    export module CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_decimal_with_no_min_or_max_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithEndCommonDecimal().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonDecimalContext>(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_decimal_with_no_min_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMaxValue(100).WithEndCommonDecimal().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonDecimalContext>(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_decimal_with_no_max_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMinValue(0).WithEndCommonDecimal().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonDecimalContext>(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_decimal_with_correct_min_max_value_order extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMinValue(0).WithMaxValue(100).WithEndCommonDecimal().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonDecimalContext>(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_decimal_with_min_max_values_out_of_order extends ValidationRuleTestBase {
            private static _entityName: string = "EntityForTest";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_validating_common_decimal_with_min_max_values_out_of_order._entityName).WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMinValue(100).WithMaxValue(0).WithEndCommonDecimal().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonDecimalContext>(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Common Decimal");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_common_decimal_with_min_max_values_out_of_order._entityName);
                _errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
            }
        }
    }
    export module CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_decimal_with_same_min_max_values extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMinValue(100).WithMaxValue(100).WithEndCommonDecimal().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonDecimalContext>(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}