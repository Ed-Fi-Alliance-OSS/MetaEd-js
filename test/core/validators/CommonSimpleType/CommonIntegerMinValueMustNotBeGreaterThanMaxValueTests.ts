module MetaEd.Tests.Validator.CommonSimpleType {
    export class CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests {

    }
    export module CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_integer_with_no_min_or_max_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger("EntityForTest").WithDocumentation("doc").WithEndCommonInteger().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonIntegerContext>(), { SuppliedRule: new CommonIntegerMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_integer_with_no_min_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger("EntityForTest").WithDocumentation("doc").WithMaxValue(100).WithEndCommonInteger().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonIntegerContext>(), { SuppliedRule: new CommonIntegerMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_integer_with_no_max_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger("EntityForTest").WithDocumentation("doc").WithMinValue(0).WithEndCommonInteger().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonIntegerContext>(), { SuppliedRule: new CommonIntegerMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_integer_with_correct_min_max_value_order extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger("EntityForTest").WithDocumentation("doc").WithMinValue(0).WithMaxValue(100).WithEndCommonInteger().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonIntegerContext>(), { SuppliedRule: new CommonIntegerMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_integer_with_min_max_values_out_of_order extends ValidationRuleTestBase {
            private static _entityName: string = "EntityForTest";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger(When_validating_common_integer_with_min_max_values_out_of_order._entityName).WithDocumentation("doc").WithMinValue(100).WithMaxValue(0).WithEndCommonInteger().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonIntegerContext>(), { SuppliedRule: new CommonIntegerMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Common Integer");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_common_integer_with_min_max_values_out_of_order._entityName);
                _errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
            }
        }
    }
    export module CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests {
        /*[TestFixture]*/
        export class When_validating_common_integer_with_same_min_max_values extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger("EntityForTest").WithDocumentation("doc").WithMinValue(100).WithMaxValue(100).WithEndCommonInteger().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonIntegerContext>(), { SuppliedRule: new CommonIntegerMinValueMustNotBeGreaterThanMaxValue() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}