var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var StringProperty;
            (function (StringProperty) {
                class StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests {
                }
                StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests;
                (function (StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests) {
                    /*[TestFixture]*/
                    class When_validating_string_property_with_no_min_length extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithStringIdentity("StringProperty", "doc2", 100).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new StringPropertyMinLengthMustNotBeGreaterThanMaxLength() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests.When_validating_string_property_with_no_min_length = When_validating_string_property_with_no_min_length;
                })(StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests || (StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = {}));
                (function (StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests) {
                    /*[TestFixture]*/
                    class When_validating_string_property_with_correct_min_max_length_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxLength = 100;
                            var minLength = 50;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithStringIdentity("StringProperty", "doc2", maxLength, minLength).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new StringPropertyMinLengthMustNotBeGreaterThanMaxLength() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests.When_validating_string_property_with_correct_min_max_length_order = When_validating_string_property_with_correct_min_max_length_order;
                })(StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests || (StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = {}));
                (function (StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests) {
                    /*[TestFixture]*/
                    class When_validating_string_property_with_min_max_length_out_of_order extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxLength = 50;
                            var minLength = 100;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_string_property_with_min_max_length_out_of_order._entity_name).WithDocumentation("doc").WithStringIdentity(When_validating_string_property_with_min_max_length_out_of_order._string_property_name, "doc2", maxLength, minLength).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new StringPropertyMinLengthMustNotBeGreaterThanMaxLength() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("String Property");
                            _errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_string_property_with_min_max_length_out_of_order._string_property_name);
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_string_property_with_min_max_length_out_of_order._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("min length greater than max length");
                        }
                    }
                    When_validating_string_property_with_min_max_length_out_of_order._entity_name = "EntityForTest";
                    When_validating_string_property_with_min_max_length_out_of_order._string_property_name = "StringProperty";
                    StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests.When_validating_string_property_with_min_max_length_out_of_order = When_validating_string_property_with_min_max_length_out_of_order;
                })(StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests || (StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = {}));
                (function (StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests) {
                    /*[TestFixture]*/
                    class When_validating_string_property_with_same_min_max_length extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var maxLength = 100;
                            var minLength = 100;
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_string_property_with_same_min_max_length._entity_name).WithDocumentation("doc").WithStringIdentity(When_validating_string_property_with_same_min_max_length._string_property_name, "doc2", maxLength, minLength).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new StringPropertyMinLengthMustNotBeGreaterThanMaxLength() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_validating_string_property_with_same_min_max_length._entity_name = "EntityForTest";
                    When_validating_string_property_with_same_min_max_length._string_property_name = "StringProperty";
                    StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests.When_validating_string_property_with_same_min_max_length = When_validating_string_property_with_same_min_max_length;
                })(StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests || (StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests = {}));
            })(StringProperty = Validator.StringProperty || (Validator.StringProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests.js.map