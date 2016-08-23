var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var InlineCommonType;
            (function (InlineCommonType) {
                class InlineCommonTypeExistsOnlyInCoreNamespaceTests {
                }
                InlineCommonType.InlineCommonTypeExistsOnlyInCoreNamespaceTests = InlineCommonTypeExistsOnlyInCoreNamespaceTests;
                (function (InlineCommonTypeExistsOnlyInCoreNamespaceTests) {
                    /*[TestFixture]*/
                    class When_inline_common_type_exists_in_core extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInlineCommonType(When_inline_common_type_exists_in_core._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndInlineCommonType().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InlineCommonTypeExistsOnlyInCoreNamespace() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_inline_common_type_exists_in_core._entity_name = "MyIdentifier";
                    When_inline_common_type_exists_in_core._property_name = "Property1";
                    InlineCommonTypeExistsOnlyInCoreNamespaceTests.When_inline_common_type_exists_in_core = When_inline_common_type_exists_in_core;
                })(InlineCommonTypeExistsOnlyInCoreNamespaceTests = InlineCommonType.InlineCommonTypeExistsOnlyInCoreNamespaceTests || (InlineCommonType.InlineCommonTypeExistsOnlyInCoreNamespaceTests = {}));
                (function (InlineCommonTypeExistsOnlyInCoreNamespaceTests) {
                    /*[TestFixture]*/
                    class When_inline_common_type_exists_in_extension extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace(When_inline_common_type_exists_in_extension._extensionNamespace, "projectExtension").WithStartInlineCommonType(When_inline_common_type_exists_in_extension._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property2", "because a property is required", true, false).WithEndInlineCommonType().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InlineCommonTypeExistsOnlyInCoreNamespace() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Inline Common Type");
                            _errorMessageCollection[0].Message.ShouldContain(When_inline_common_type_exists_in_extension._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("is not valid in extension namespace");
                            _errorMessageCollection[0].Message.ShouldContain(When_inline_common_type_exists_in_extension._extensionNamespace);
                        }
                    }
                    When_inline_common_type_exists_in_extension._extensionNamespace = "edfi";
                    When_inline_common_type_exists_in_extension._entity_name = "MyIdentifier";
                    When_inline_common_type_exists_in_extension._property_name = "Property1";
                    InlineCommonTypeExistsOnlyInCoreNamespaceTests.When_inline_common_type_exists_in_extension = When_inline_common_type_exists_in_extension;
                })(InlineCommonTypeExistsOnlyInCoreNamespaceTests = InlineCommonType.InlineCommonTypeExistsOnlyInCoreNamespaceTests || (InlineCommonType.InlineCommonTypeExistsOnlyInCoreNamespaceTests = {}));
            })(InlineCommonType = Validator.InlineCommonType || (Validator.InlineCommonType = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InlineCommonTypeExistsOnlyInCoreNamespaceTests.js.map