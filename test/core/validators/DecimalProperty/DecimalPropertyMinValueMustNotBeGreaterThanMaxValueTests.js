var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DecimalProperty;
            (function (DecimalProperty) {
                class DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests {
                }
                DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests;
                (function (DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_no_min_or_max_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", 10, 2).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_decimal_property_with_no_min_or_max_value = When_validating_decimal_property_with_no_min_or_max_value;
                })(DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests || (DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_no_min_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", 10, 2, null, 1000).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_decimal_property_with_no_min_value = When_validating_decimal_property_with_no_min_value;
                })(DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests || (DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_no_max_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", 10, 2, 1000).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_decimal_property_with_no_max_value = When_validating_decimal_property_with_no_max_value;
                })(DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests || (DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_correct_min_max_value_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxValue = 100;
                            var minValue = 50;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", 10, 2, minValue, maxValue).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_decimal_property_with_correct_min_max_value_order = When_validating_decimal_property_with_correct_min_max_value_order;
                })(DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests || (DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_min_max_values_out_of_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxValue = 50;
                            var minValue = 100;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_decimal_property_with_min_max_values_out_of_order._entityName).WithDocumentation("doc").WithDecimalIdentity(When_validating_decimal_property_with_min_max_values_out_of_order._decimalPropertyName, "doc2", 10, 2, minValue, maxValue).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Decimal Property");
                            _errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_decimal_property_with_min_max_values_out_of_order._decimalPropertyName);
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_decimal_property_with_min_max_values_out_of_order._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
                        }
                    }
                    When_validating_decimal_property_with_min_max_values_out_of_order._entityName = "EntityForTest";
                    When_validating_decimal_property_with_min_max_values_out_of_order._decimalPropertyName = "DecimalProperty";
                    DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_decimal_property_with_min_max_values_out_of_order = When_validating_decimal_property_with_min_max_values_out_of_order;
                })(DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests || (DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_same_min_max_values extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxValue = 100;
                            var minValue = 100;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_decimal_property_with_same_min_max_values._entityName).WithDocumentation("doc").WithDecimalIdentity(When_validating_decimal_property_with_same_min_max_values._decimalPropertyName, "doc2", minValue, maxValue).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_validating_decimal_property_with_same_min_max_values._entityName = "EntityForTest";
                    When_validating_decimal_property_with_same_min_max_values._decimalPropertyName = "DecimalProperty";
                    DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_decimal_property_with_same_min_max_values = When_validating_decimal_property_with_same_min_max_values;
                })(DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests || (DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
            })(DecimalProperty = Validator.DecimalProperty || (Validator.DecimalProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DecimalPropertyMinValueMustNotBeGreaterThanMaxValueTests.js.map