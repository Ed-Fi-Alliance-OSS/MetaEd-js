var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var ShortProperty;
            (function (ShortProperty) {
                class ShortPropertyMustNotMatchACommonSimpleTypeTests {
                }
                ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests = ShortPropertyMustNotMatchACommonSimpleTypeTests;
                (function (ShortPropertyMustNotMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_short_property_has_identifier_matching_no_common_simple_types extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_short_property_has_identifier_matching_no_common_simple_types._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithShortProperty(When_short_property_has_identifier_matching_no_common_simple_types._propertyName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ShortPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_short_property_has_identifier_matching_no_common_simple_types._entityName = "EntityName";
                    When_short_property_has_identifier_matching_no_common_simple_types._propertyName = "PropertyName";
                    ShortPropertyMustNotMatchACommonSimpleTypeTests.When_short_property_has_identifier_matching_no_common_simple_types = When_short_property_has_identifier_matching_no_common_simple_types;
                })(ShortPropertyMustNotMatchACommonSimpleTypeTests = ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests || (ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests = {}));
                (function (ShortPropertyMustNotMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_short_property_has_identifier_matching_common_decimal extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_short_property_has_identifier_matching_common_decimal._commonEntityName).WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithEndCommonDecimal();
                            metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithShortProperty(When_short_property_has_identifier_matching_common_decimal._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ShortPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Short property");
                            _errorMessageCollection[0].Message.ShouldContain(When_short_property_has_identifier_matching_common_decimal._commonEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("has the same name");
                        }
                    }
                    When_short_property_has_identifier_matching_common_decimal._commonEntityName = "CommonEntityName";
                    ShortPropertyMustNotMatchACommonSimpleTypeTests.When_short_property_has_identifier_matching_common_decimal = When_short_property_has_identifier_matching_common_decimal;
                })(ShortPropertyMustNotMatchACommonSimpleTypeTests = ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests || (ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests = {}));
                (function (ShortPropertyMustNotMatchACommonSimpleTypeTests) {
                    class When_short_property_has_identifier_matching_common_integer extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger(When_short_property_has_identifier_matching_common_integer._commonEntityName).WithDocumentation("doc").WithMaxValue(100).WithEndCommonInteger();
                            metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithShortProperty(When_short_property_has_identifier_matching_common_integer._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ShortPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Short property");
                            _errorMessageCollection[0].Message.ShouldContain(When_short_property_has_identifier_matching_common_integer._commonEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("has the same name");
                        }
                    }
                    When_short_property_has_identifier_matching_common_integer._commonEntityName = "CommonEntityName";
                    ShortPropertyMustNotMatchACommonSimpleTypeTests.When_short_property_has_identifier_matching_common_integer = When_short_property_has_identifier_matching_common_integer;
                })(ShortPropertyMustNotMatchACommonSimpleTypeTests = ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests || (ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests = {}));
                (function (ShortPropertyMustNotMatchACommonSimpleTypeTests) {
                    class When_short_property_has_identifier_matching_common_short extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonShort(When_short_property_has_identifier_matching_common_short._commonEntityName).WithDocumentation("doc").WithMaxValue(100).WithEndCommonShort();
                            metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithShortProperty(When_short_property_has_identifier_matching_common_short._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ShortPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Short property");
                            _errorMessageCollection[0].Message.ShouldContain(When_short_property_has_identifier_matching_common_short._commonEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("has the same name");
                        }
                    }
                    When_short_property_has_identifier_matching_common_short._commonEntityName = "CommonEntityName";
                    ShortPropertyMustNotMatchACommonSimpleTypeTests.When_short_property_has_identifier_matching_common_short = When_short_property_has_identifier_matching_common_short;
                })(ShortPropertyMustNotMatchACommonSimpleTypeTests = ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests || (ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests = {}));
                (function (ShortPropertyMustNotMatchACommonSimpleTypeTests) {
                    class When_short_property_has_identifier_matching_common_string extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_short_property_has_identifier_matching_common_string._commonEntityName).WithDocumentation("doc").WithMaxLength(100).WithEndCommonString();
                            metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithShortProperty(When_short_property_has_identifier_matching_common_string._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ShortPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Short property");
                            _errorMessageCollection[0].Message.ShouldContain(When_short_property_has_identifier_matching_common_string._commonEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("has the same name");
                        }
                    }
                    When_short_property_has_identifier_matching_common_string._commonEntityName = "CommonEntityName";
                    ShortPropertyMustNotMatchACommonSimpleTypeTests.When_short_property_has_identifier_matching_common_string = When_short_property_has_identifier_matching_common_string;
                })(ShortPropertyMustNotMatchACommonSimpleTypeTests = ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests || (ShortProperty.ShortPropertyMustNotMatchACommonSimpleTypeTests = {}));
            })(ShortProperty = Validator.ShortProperty || (Validator.ShortProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=ShortPropertyMustNotMatchACommonSimpleTypeTests.js.map