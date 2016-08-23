var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var CommonTypeExtension;
            (function (CommonTypeExtension) {
                class CommonTypeExtensionIdentifierMustMatchACommonTypeTests {
                }
                CommonTypeExtension.CommonTypeExtensionIdentifierMustMatchACommonTypeTests = CommonTypeExtensionIdentifierMustMatchACommonTypeTests;
                (function (CommonTypeExtensionIdentifierMustMatchACommonTypeTests) {
                    /*[TestFixture]*/
                    class When_common_type_extension_has_valid_extendee extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_common_type_extension_has_valid_extendee._entity_name).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndCommonType();
                            metaEdTextBuilder.WithStartCommonTypeExtension(When_common_type_extension_has_valid_extendee._entity_name).WithBooleanProperty("Property2", "doc", true, false).WithEndCommonTypeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonTypeExtensionIdentifierMustMatchACommonType(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_common_type_extension_has_valid_extendee._entity_name = "MyIdentifier";
                    When_common_type_extension_has_valid_extendee._property_name = "Property1";
                    CommonTypeExtensionIdentifierMustMatchACommonTypeTests.When_common_type_extension_has_valid_extendee = When_common_type_extension_has_valid_extendee;
                })(CommonTypeExtensionIdentifierMustMatchACommonTypeTests = CommonTypeExtension.CommonTypeExtensionIdentifierMustMatchACommonTypeTests || (CommonTypeExtension.CommonTypeExtensionIdentifierMustMatchACommonTypeTests = {}));
                (function (CommonTypeExtensionIdentifierMustMatchACommonTypeTests) {
                    /*[TestFixture]*/
                    class When_common_type_extension_has_invalid_extendee extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonTypeExtension(When_common_type_extension_has_invalid_extendee._entity_name).WithBooleanProperty("Property2", "doc", false, false).WithEndCommonTypeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonTypeExtensionIdentifierMustMatchACommonType(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Common Type additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_common_type_extension_has_invalid_extendee._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_common_type_extension_has_invalid_extendee._entity_name = "NotACommonTypeIdentifier";
                    CommonTypeExtensionIdentifierMustMatchACommonTypeTests.When_common_type_extension_has_invalid_extendee = When_common_type_extension_has_invalid_extendee;
                })(CommonTypeExtensionIdentifierMustMatchACommonTypeTests = CommonTypeExtension.CommonTypeExtensionIdentifierMustMatchACommonTypeTests || (CommonTypeExtension.CommonTypeExtensionIdentifierMustMatchACommonTypeTests = {}));
            })(CommonTypeExtension = Validator.CommonTypeExtension || (Validator.CommonTypeExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonTypeExtensionIdentifierMustMatchACommonTypeTests.js.map