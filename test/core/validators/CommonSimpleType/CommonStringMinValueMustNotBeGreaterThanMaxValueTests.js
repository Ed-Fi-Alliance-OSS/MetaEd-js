var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var CommonSimpleType;
            (function (CommonSimpleType) {
                class CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests {
                }
                CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests;
                (function (CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests) {
                    /*[TestFixture]*/
                    class When_validating_common_string_with_no_min_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString("EntityForTest").WithDocumentation("doc").WithMaxLength(100).WithEndCommonString().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonStringMinLengthMustNotBeGreaterThanMaxLength() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests.When_validating_common_string_with_no_min_value = When_validating_common_string_with_no_min_value;
                })(CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests || (CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = {}));
                (function (CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests) {
                    /*[TestFixture]*/
                    class When_validating_common_string_with_correct_min_max_value_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString("EntityForTest").WithDocumentation("doc").WithMinLength(0).WithMaxLength(100).WithEndCommonString().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonStringMinLengthMustNotBeGreaterThanMaxLength() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests.When_validating_common_string_with_correct_min_max_value_order = When_validating_common_string_with_correct_min_max_value_order;
                })(CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests || (CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = {}));
                (function (CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests) {
                    /*[TestFixture]*/
                    class When_validating_common_string_with_min_max_values_out_of_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_validating_common_string_with_min_max_values_out_of_order._entityName).WithDocumentation("doc").WithMinLength(100).WithMaxLength(0).WithEndCommonString().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonStringMinLengthMustNotBeGreaterThanMaxLength() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Common String");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_common_string_with_min_max_values_out_of_order._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("min length greater than max length");
                        }
                    }
                    When_validating_common_string_with_min_max_values_out_of_order._entityName = "EntityForTest";
                    CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests.When_validating_common_string_with_min_max_values_out_of_order = When_validating_common_string_with_min_max_values_out_of_order;
                })(CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests || (CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = {}));
                (function (CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests) {
                    /*[TestFixture]*/
                    class When_validating_common_string_with_same_min_max_values extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString("EntityForTest").WithDocumentation("doc").WithMinLength(100).WithMaxLength(100).WithEndCommonString().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonStringMinLengthMustNotBeGreaterThanMaxLength() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests.When_validating_common_string_with_same_min_max_values = When_validating_common_string_with_same_min_max_values;
                })(CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests || (CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLengthTests = {}));
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonStringMinValueMustNotBeGreaterThanMaxValueTests.js.map