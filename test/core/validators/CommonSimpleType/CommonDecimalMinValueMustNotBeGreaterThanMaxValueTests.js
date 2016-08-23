var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var CommonSimpleType;
            (function (CommonSimpleType) {
                class CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests {
                }
                CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests;
                (function (CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_common_decimal_with_no_min_or_max_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithEndCommonDecimal().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests.When_validating_common_decimal_with_no_min_or_max_value = When_validating_common_decimal_with_no_min_or_max_value;
                })(CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests || (CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_common_decimal_with_no_min_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMaxValue(100).WithEndCommonDecimal().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests.When_validating_common_decimal_with_no_min_value = When_validating_common_decimal_with_no_min_value;
                })(CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests || (CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_common_decimal_with_no_max_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMinValue(0).WithEndCommonDecimal().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests.When_validating_common_decimal_with_no_max_value = When_validating_common_decimal_with_no_max_value;
                })(CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests || (CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_common_decimal_with_correct_min_max_value_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMinValue(0).WithMaxValue(100).WithEndCommonDecimal().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests.When_validating_common_decimal_with_correct_min_max_value_order = When_validating_common_decimal_with_correct_min_max_value_order;
                })(CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests || (CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_common_decimal_with_min_max_values_out_of_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_validating_common_decimal_with_min_max_values_out_of_order._entityName).WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMinValue(100).WithMaxValue(0).WithEndCommonDecimal().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Common Decimal");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_common_decimal_with_min_max_values_out_of_order._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
                        }
                    }
                    When_validating_common_decimal_with_min_max_values_out_of_order._entityName = "EntityForTest";
                    CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests.When_validating_common_decimal_with_min_max_values_out_of_order = When_validating_common_decimal_with_min_max_values_out_of_order;
                })(CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests || (CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_common_decimal_with_same_min_max_values extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal("EntityForTest").WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithMinValue(100).WithMaxValue(100).WithEndCommonDecimal().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonDecimalMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests.When_validating_common_decimal_with_same_min_max_values = When_validating_common_decimal_with_same_min_max_values;
                })(CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests || (CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests = {}));
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonDecimalMinValueMustNotBeGreaterThanMaxValueTests.js.map