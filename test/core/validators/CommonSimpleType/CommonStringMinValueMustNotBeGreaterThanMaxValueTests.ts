module MetaEd.Tests.Validator.CommonSimpleType {
    export class CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests {

    }
    export module CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests {
        /*[TestFixture]*/
        export class When_validating_common_string_with_no_min_value extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString("EntityForTest").WithDocumentation("doc").WithMaxLength(100).WithEndCommonString().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonStringContext>(), { SuppliedRule: new CommonStringMinLengthMustNotBeGreaterThanMaxLength() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests {
        /*[TestFixture]*/
        export class When_validating_common_string_with_correct_min_max_value_order extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString("EntityForTest").WithDocumentation("doc").WithMinLength(0).WithMaxLength(100).WithEndCommonString().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonStringContext>(), { SuppliedRule: new CommonStringMinLengthMustNotBeGreaterThanMaxLength() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests {
        /*[TestFixture]*/
        export class When_validating_common_string_with_min_max_values_out_of_order extends ValidationRuleTestBase {
            private static _entityName: string = "EntityForTest";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_validating_common_string_with_min_max_values_out_of_order._entityName).WithDocumentation("doc").WithMinLength(100).WithMaxLength(0).WithEndCommonString().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonStringContext>(), { SuppliedRule: new CommonStringMinLengthMustNotBeGreaterThanMaxLength() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Common String");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_common_string_with_min_max_values_out_of_order._entityName);
                _errorMessageCollection[0].Message.ShouldContain("min length greater than max length");
            }
        }
    }
    export module CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests {
        /*[TestFixture]*/
        export class When_validating_common_string_with_same_min_max_values extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString("EntityForTest").WithDocumentation("doc").WithMinLength(100).WithMaxLength(100).WithEndCommonString().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.CommonStringContext>(), { SuppliedRule: new CommonStringMinLengthMustNotBeGreaterThanMaxLength() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}