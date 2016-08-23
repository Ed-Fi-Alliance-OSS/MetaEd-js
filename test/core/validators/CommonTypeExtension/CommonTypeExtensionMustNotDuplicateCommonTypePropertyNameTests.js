var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var CommonTypeExtension;
            (function (CommonTypeExtension) {
                class CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests {
                }
                CommonTypeExtension.CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests = CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests;
                (function (CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests) {
                    /*[TestFixture]*/
                    class When_common_type_extension_has_different_property_name extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_common_type_extension_has_different_property_name._entity_name).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartCommonTypeExtension(When_common_type_extension_has_different_property_name._entity_name).WithBooleanProperty("Property2", "doc", true, false).WithEndCommonTypeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonTypeExtensionMustNotDuplicateCommonTypePropertyName(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_common_type_extension_has_different_property_name._entity_name = "MyIdentifier";
                    CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests.When_common_type_extension_has_different_property_name = When_common_type_extension_has_different_property_name;
                })(CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests = CommonTypeExtension.CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests || (CommonTypeExtension.CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests = {}));
                (function (CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests) {
                    /*[TestFixture]*/
                    class When_common_type_extension_has_duplicate_property_name extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_common_type_extension_has_duplicate_property_name._entity_name).WithDocumentation("doc").WithBooleanProperty(When_common_type_extension_has_duplicate_property_name._duplicate_property_name, "doc", true, false).WithEndCommonType();
                            metaEdTextBuilder.WithStartCommonTypeExtension(When_common_type_extension_has_duplicate_property_name._entity_name).WithBooleanProperty(When_common_type_extension_has_duplicate_property_name._duplicate_property_name, "doc", true, false).WithEndCommonTypeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new CommonTypeExtensionMustNotDuplicateCommonTypePropertyName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Common Type additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_common_type_extension_has_duplicate_property_name._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain(When_common_type_extension_has_duplicate_property_name._duplicate_property_name);
                            _errorMessageCollection[0].Message.ShouldContain("already in property list");
                        }
                    }
                    When_common_type_extension_has_duplicate_property_name._entity_name = "MyIdentifier";
                    When_common_type_extension_has_duplicate_property_name._duplicate_property_name = "Property1";
                    CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests.When_common_type_extension_has_duplicate_property_name = When_common_type_extension_has_duplicate_property_name;
                })(CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests = CommonTypeExtension.CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests || (CommonTypeExtension.CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests = {}));
            })(CommonTypeExtension = Validator.CommonTypeExtension || (Validator.CommonTypeExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests.js.map