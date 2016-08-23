var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyMustMatchACommonTypeTests {
                }
                IncludeProperty.IncludePropertyMustMatchACommonTypeTests = IncludePropertyMustMatchACommonTypeTests;
                (function (IncludePropertyMustMatchACommonTypeTests) {
                    /*[TestFixture]*/
                    class When_include_property_has_identifier_of_common_type extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_identifier_of_common_type._entityName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndCommonType();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIncludeProperty(When_include_property_has_identifier_of_common_type._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IncludePropertyMustMatchACommonType(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_include_property_has_identifier_of_common_type._entityName = "MyIdentifier";
                    IncludePropertyMustMatchACommonTypeTests.When_include_property_has_identifier_of_common_type = When_include_property_has_identifier_of_common_type;
                })(IncludePropertyMustMatchACommonTypeTests = IncludeProperty.IncludePropertyMustMatchACommonTypeTests || (IncludeProperty.IncludePropertyMustMatchACommonTypeTests = {}));
                (function (IncludePropertyMustMatchACommonTypeTests) {
                    /*[TestFixture]*/
                    class When_include_property_has_identifier_of_inline_common_type extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInlineCommonType(When_include_property_has_identifier_of_inline_common_type._entityName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndInlineCommonType();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIncludeProperty(When_include_property_has_identifier_of_inline_common_type._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IncludePropertyMustMatchACommonType(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_include_property_has_identifier_of_inline_common_type._entityName = "MyIdentifier";
                    IncludePropertyMustMatchACommonTypeTests.When_include_property_has_identifier_of_inline_common_type = When_include_property_has_identifier_of_inline_common_type;
                })(IncludePropertyMustMatchACommonTypeTests = IncludeProperty.IncludePropertyMustMatchACommonTypeTests || (IncludeProperty.IncludePropertyMustMatchACommonTypeTests = {}));
                (function (IncludePropertyMustMatchACommonTypeTests) {
                    /*[TestFixture]*/
                    class When_include_property_has_identifier_of_choice_common_type extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartChoiceType(When_include_property_has_identifier_of_choice_common_type._entityName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndChoiceType();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIncludeProperty(When_include_property_has_identifier_of_choice_common_type._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IncludePropertyMustMatchACommonType(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_include_property_has_identifier_of_choice_common_type._entityName = "MyIdentifier";
                    IncludePropertyMustMatchACommonTypeTests.When_include_property_has_identifier_of_choice_common_type = When_include_property_has_identifier_of_choice_common_type;
                })(IncludePropertyMustMatchACommonTypeTests = IncludeProperty.IncludePropertyMustMatchACommonTypeTests || (IncludeProperty.IncludePropertyMustMatchACommonTypeTests = {}));
                (function (IncludePropertyMustMatchACommonTypeTests) {
                    /*[TestFixture]*/
                    class When_include_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIncludeProperty(When_include_property_has_invalid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IncludePropertyMustMatchACommonType(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Include");
                            _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_invalid_identifier._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_include_property_has_invalid_identifier._entityName = "MyIdentifier";
                    IncludePropertyMustMatchACommonTypeTests.When_include_property_has_invalid_identifier = When_include_property_has_invalid_identifier;
                })(IncludePropertyMustMatchACommonTypeTests = IncludeProperty.IncludePropertyMustMatchACommonTypeTests || (IncludeProperty.IncludePropertyMustMatchACommonTypeTests = {}));
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyMustMatchACommonTypeTests.js.map