var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var IntegerProperty;
            (function (IntegerProperty) {
                class IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests {
                }
                IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests;
                (function (IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_integer_property_with_no_min_or_max_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithIntegerIdentity("IntegerProperty", "doc2").WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_integer_property_with_no_min_or_max_value = When_validating_integer_property_with_no_min_or_max_value;
                })(IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests || (IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_integer_property_with_no_min_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithIntegerIdentity("IntegerProperty", "doc2", 100).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_integer_property_with_no_min_value = When_validating_integer_property_with_no_min_value;
                })(IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests || (IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_integer_property_with_no_max_value extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithIntegerIdentity("IntegerProperty", "doc2", null, 100).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_integer_property_with_no_max_value = When_validating_integer_property_with_no_max_value;
                })(IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests || (IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_integer_property_with_correct_min_max_value_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxValue = 100;
                            var minValue = 50;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithIntegerIdentity("IntegerProperty", "doc2", maxValue, minValue).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_integer_property_with_correct_min_max_value_order = When_validating_integer_property_with_correct_min_max_value_order;
                })(IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests || (IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_integer_property_with_min_max_values_out_of_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxValue = 50;
                            var minValue = 100;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_integer_property_with_min_max_values_out_of_order._entityName).WithDocumentation("doc").WithIntegerIdentity(When_validating_integer_property_with_min_max_values_out_of_order._integerPropertyName, "doc2", maxValue, minValue).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Integer Property");
                            _errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_integer_property_with_min_max_values_out_of_order._integerPropertyName);
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_integer_property_with_min_max_values_out_of_order._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
                        }
                    }
                    When_validating_integer_property_with_min_max_values_out_of_order._entityName = "EntityForTest";
                    When_validating_integer_property_with_min_max_values_out_of_order._integerPropertyName = "IntegerProperty";
                    IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_integer_property_with_min_max_values_out_of_order = When_validating_integer_property_with_min_max_values_out_of_order;
                })(IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests || (IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
                (function (IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests) {
                    /*[TestFixture]*/
                    class When_validating_integer_property_with_same_min_max_values extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxValue = 100;
                            var minValue = 100;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_integer_property_with_same_min_max_values._entityName).WithDocumentation("doc").WithIntegerIdentity(When_validating_integer_property_with_same_min_max_values._integerPropertyName, "doc2", maxValue, minValue).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMinValueMustNotBeGreaterThanMaxValue() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_validating_integer_property_with_same_min_max_values._entityName = "EntityForTest";
                    When_validating_integer_property_with_same_min_max_values._integerPropertyName = "IntegerProperty";
                    IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests.When_validating_integer_property_with_same_min_max_values = When_validating_integer_property_with_same_min_max_values;
                })(IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests || (IntegerProperty.IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests = {}));
            })(IntegerProperty = Validator.IntegerProperty || (Validator.IntegerProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IntegerPropertyMinValueMustNotBeGreaterThanMaxValueTests.js.map