var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DecimalProperty;
            (function (DecimalProperty) {
                class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests {
                }
                DecimalProperty.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests = DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests;
                (function (DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_correct_total_digit_and_decimal_places_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var totalDigits = 10;
                            var decimalPlaces = 2;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", totalDigits, decimalPlaces).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests.When_validating_decimal_property_with_correct_total_digit_and_decimal_places_order = When_validating_decimal_property_with_correct_total_digit_and_decimal_places_order;
                })(DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests = DecimalProperty.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests || (DecimalProperty.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests = {}));
                (function (DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var totalDigits = 2;
                            var decimalPlaces = 10;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._entityName).WithDocumentation("doc").WithDecimalIdentity(When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._decimalPropertyName, "doc2", totalDigits, decimalPlaces).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Decimal Property");
                            _errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._decimalPropertyName);
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("decimal places greater than total digits");
                        }
                    }
                    When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._entityName = "EntityForTest";
                    When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._decimalPropertyName = "DecimalProperty";
                    DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests.When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order = When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order;
                })(DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests = DecimalProperty.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests || (DecimalProperty.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests = {}));
                (function (DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests) {
                    /*[TestFixture]*/
                    class When_validating_decimal_property_with_same_total_digit_and_decimal_places extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var totalDigits = 10;
                            var decimalPlaces = 2;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_decimal_property_with_same_total_digit_and_decimal_places._entityName).WithDocumentation("doc").WithDecimalIdentity(When_validating_decimal_property_with_same_total_digit_and_decimal_places._decimalPropertyName, "doc2", totalDigits, decimalPlaces).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_validating_decimal_property_with_same_total_digit_and_decimal_places._entityName = "EntityForTest";
                    When_validating_decimal_property_with_same_total_digit_and_decimal_places._decimalPropertyName = "DecimalProperty";
                    DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests.When_validating_decimal_property_with_same_total_digit_and_decimal_places = When_validating_decimal_property_with_same_total_digit_and_decimal_places;
                })(DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests = DecimalProperty.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests || (DecimalProperty.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests = {}));
            })(DecimalProperty = Validator.DecimalProperty || (Validator.DecimalProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests.js.map